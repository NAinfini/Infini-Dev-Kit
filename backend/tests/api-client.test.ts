import { describe, expect, it, vi } from "vitest";

import {
  ApiClientError,
  createApiClient,
  type EndpointDefinition,
} from "../api-client";

function responseJson(status: number, body: unknown, headers?: HeadersInit): Response {
  const mergedHeaders = new Headers(headers);
  if (!mergedHeaders.has("content-type")) {
    mergedHeaders.set("content-type", "application/json");
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: mergedHeaders,
  });
}

describe("createApiClient", () => {
  it("normalizes non-2xx into ApiClientError with problem details", async () => {
    const fetcher = vi.fn(async () => {
      return responseJson(
        400,
        {
          type: "https://example.com/validation-error",
          title: "Validation Failed",
          status: 400,
          detail: "name is required",
        },
        { "content-type": "application/problem+json" },
      );
    });

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
    });

    await expect(client.request({ method: "GET", path: "/users" })).rejects.toMatchObject({
      kind: "http",
      status: 400,
      problem: {
        title: "Validation Failed",
      },
    });
  });

  it("retries idempotent requests on network errors", async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockResolvedValueOnce(responseJson(200, { ok: true }));

    const sleep = vi.fn(async () => undefined);

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      sleep,
      random: () => 0,
      retry: {
        retries: 2,
        baseDelayMs: 1,
        jitterMs: 0,
      },
    });

    const result = await client.request<{ ok: boolean }>({ method: "GET", path: "/health" });

    expect(result.ok).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it("does not retry non-idempotent requests by default", async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError("offline"));

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      retry: {
        retries: 3,
        baseDelayMs: 1,
        jitterMs: 0,
      },
    });

    await expect(
      client.request({
        method: "POST",
        path: "/users",
        body: { name: "A" },
      }),
    ).rejects.toMatchObject({
      kind: "network",
      problem: {
        type: "urn:infini:error:network",
      },
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("supports timeout and maps to timeout error kind", async () => {
    vi.useFakeTimers();

    const fetcher = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        if (init?.signal?.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }

        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    });

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      timeoutMs: 20,
      retry: { retries: 0 },
    });

    const promise = client.request({ method: "GET", path: "/slow" });
    const assertion = expect(promise).rejects.toMatchObject({
      kind: "timeout",
      problem: {
        status: 408,
        title: "Request Timeout",
      },
    });

    await vi.advanceTimersByTimeAsync(25);
    await assertion;

    vi.useRealTimers();
  });

  it("supports explicit abort signal and maps to aborted error", async () => {
    const fetcher = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        if (init?.signal?.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }

        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    });

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      retry: { retries: 0 },
    });

    const abortController = new AbortController();
    const promise = client.request({
      method: "GET",
      path: "/abort-me",
      signal: abortController.signal,
    });

    abortController.abort();

    await expect(promise).rejects.toMatchObject({
      kind: "aborted",
      problem: {
        status: 499,
        title: "Request Aborted",
      },
    });
  });

  it("injects auth and trace headers", async () => {
    const fetcher = vi.fn(async () => responseJson(200, { ok: true }));

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      getAuthToken: async () => "abc123",
      traceContext: async () => ({
        traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00",
        tracestate: "congo=t61rcWkgMzE",
      }),
    });

    await client.request({
      method: "GET",
      path: "/secure",
      requiresAuth: true,
    });

    const firstCall = fetcher.mock.calls[0] as unknown[] | undefined;
    expect(firstCall).toBeDefined();
    const init = (firstCall && firstCall.length > 1 ? firstCall[1] : {}) as RequestInit;
    const headers = new Headers(init.headers);

    expect(headers.get("authorization")).toBe("Bearer abc123");
    expect(headers.get("traceparent")).toContain("4bf92f3577b34da6a3ce929d0e0e4736");
    expect(headers.get("tracestate")).toBe("congo=t61rcWkgMzE");
  });

  it("calls onAuthError for final 401/403 failures", async () => {
    const fetcher = vi.fn(async () =>
      responseJson(
        401,
        {
          title: "Unauthorized",
          status: 401,
        },
        { "content-type": "application/problem+json" },
      ),
    );

    const onAuthError = vi.fn(async (_error: ApiClientError) => undefined);

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      onAuthError,
      retry: { retries: 0 },
    });

    await expect(client.request({ method: "GET", path: "/secure" })).rejects.toMatchObject({
      kind: "http",
      status: 401,
    });

    expect(onAuthError).toHaveBeenCalledTimes(1);
  });

  it("supports endpoint builder path/query/body parsing", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/users/42")) {
        return responseJson(200, {
          id: 42,
          name: "Ava",
        });
      }

      return responseJson(500, {
        title: "Unexpected",
      });
    });

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
    });

    type UserResponse = {
      id: number;
      name: string;
    };

    const endpoint: EndpointDefinition<
      UserResponse,
      { id: number },
      { includePosts?: boolean; name?: string }
    > = {
      method: "GET",
      path: "/users/:id",
      parseAs: "json",
    };

    const getUser = client.endpoint(endpoint);

    const response = await getUser({
      pathParams: { id: 42 },
      query: { includePosts: true, name: "ava" },
    });

    expect(response.id).toBe(42);
    const calledUrl = String(fetcher.mock.calls[0]?.[0] ?? "");
    expect(calledUrl).toContain("/users/42");
    expect(calledUrl).toContain("includePosts=true");
    expect(calledUrl).toContain("name=ava");
  });

  it("returns undefined for 204 with json parser", async () => {
    const fetcher = vi.fn(async () => {
      return new Response(null, { status: 204 });
    });

    const client = createApiClient({ baseUrl: "https://api.example.com", fetcher });

    const result = await client.request({ method: "GET", path: "/empty", parseAs: "json" });
    expect(result).toBeUndefined();
  });

  it("normalizes parse errors with problem details fields", async () => {
    const fetcher = vi.fn(async () => {
      return new Response("not-json", {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      retry: { retries: 0 },
    });

    await expect(client.request({ method: "GET", path: "/broken-json" })).rejects.toMatchObject({
      kind: "parse",
      status: 200,
      problem: {
        status: 200,
        title: "Response Parse Error",
      },
    });
  });

  it("retries idempotent requests on 429 and honors Retry-After seconds", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        responseJson(
          429,
          {
            title: "Too Many Requests",
            status: 429,
          },
          {
            "content-type": "application/problem+json",
            "retry-after": "2",
          },
        ),
      )
      .mockResolvedValueOnce(responseJson(200, { ok: true }));

    const sleep = vi.fn(async () => undefined);

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      sleep,
      random: () => 0,
      retry: {
        retries: 2,
        baseDelayMs: 10,
        jitterMs: 0,
      },
    });

    const result = await client.request<{ ok: boolean }>({ method: "GET", path: "/rate-limited" });

    expect(result.ok).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(2000);
  });

  it("retries idempotent requests on 429 and honors Retry-After HTTP-date", async () => {
    vi.useFakeTimers();
    const retryAt = new Date(Date.now() + 1500).toUTCString();

    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        responseJson(
          429,
          {
            title: "Too Many Requests",
            status: 429,
          },
          {
            "content-type": "application/problem+json",
            "retry-after": retryAt,
          },
        ),
      )
      .mockResolvedValueOnce(responseJson(200, { ok: true }));

    const sleep = vi.fn(async () => undefined);

    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      sleep,
      random: () => 0,
      retry: {
        retries: 2,
        baseDelayMs: 10,
        jitterMs: 0,
      },
    });

    const result = await client.request<{ ok: boolean }>({ method: "GET", path: "/rate-limited-date" });

    expect(result.ok).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
    const firstSleepCall = sleep.mock.calls[0] as unknown[] | undefined;
    const firstDelay = typeof firstSleepCall?.[0] === "number" ? firstSleepCall[0] : -1;
    expect(firstDelay).toBeGreaterThanOrEqual(0);
    expect(firstDelay).toBeLessThanOrEqual(1500);
    vi.useRealTimers();
  });

  it("does not retry non-idempotent requests on 429 by default", async () => {
    const fetcher = vi.fn(async () =>
      responseJson(
        429,
        {
          title: "Too Many Requests",
          status: 429,
        },
        {
          "content-type": "application/problem+json",
          "retry-after": "5",
        },
      ),
    );

    const sleep = vi.fn(async () => undefined);
    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetcher,
      sleep,
      random: () => 0,
      retry: {
        retries: 3,
        baseDelayMs: 10,
        jitterMs: 0,
      },
    });

    await expect(
      client.request({
        method: "POST",
        path: "/rate-limited-post",
        body: { name: "A" },
      }),
    ).rejects.toMatchObject({
      kind: "http",
      status: 429,
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledTimes(0);
  });
});
