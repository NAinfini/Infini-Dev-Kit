export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type ParseAs = "json" | "text" | "blob" | "raw";

export type ApiErrorKind = "http" | "network" | "timeout" | "aborted" | "parse";

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

export interface ApiClientErrorOptions {
  kind: ApiErrorKind;
  message: string;
  method: HttpMethod;
  url: string;
  status?: number;
  problem?: ProblemDetails;
  cause?: unknown;
}

export class ApiClientError extends Error {
  readonly kind: ApiErrorKind;
  readonly method: HttpMethod;
  readonly url: string;
  readonly status?: number;
  readonly problem?: ProblemDetails;

  constructor(options: ApiClientErrorOptions) {
    super(options.message);
    this.name = "ApiClientError";
    this.kind = options.kind;
    this.method = options.method;
    this.url = options.url;
    this.status = options.status;
    this.problem = options.problem;

    if ("cause" in Error.prototype) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

export type PathParams = Record<string, string | number | boolean>;

export type QueryScalar = string | number | boolean | null | undefined;

export type QueryValue = QueryScalar | readonly QueryScalar[];

export type QueryParams = Record<string, QueryValue>;

export interface RequestConfig<
  TBody = unknown,
  TPath extends PathParams = PathParams,
  TQuery extends QueryParams = QueryParams,
> {
  method: HttpMethod;
  path: string;
  pathParams?: TPath;
  query?: TQuery;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
  parseAs?: ParseAs;
  timeoutMs?: number;
  retry?: Partial<RetryOptions>;
  requiresAuth?: boolean;
}

export interface EndpointDefinition<
  TResponse,
  TPath extends PathParams = PathParams,
  TQuery extends QueryParams = QueryParams,
  TBody = unknown,
> {
  method: HttpMethod;
  path: string;
  parseAs?: ParseAs;
  timeoutMs?: number;
  retry?: Partial<RetryOptions>;
  requiresAuth?: boolean;
  _types?: {
    response?: TResponse;
    path?: TPath;
    query?: TQuery;
    body?: TBody;
  };
}

export interface EndpointRequest<
  TPath extends PathParams = PathParams,
  TQuery extends QueryParams = QueryParams,
  TBody = unknown,
> {
  pathParams?: TPath;
  query?: TQuery;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export interface RetryOptions {
  retries: number;
  baseDelayMs: number;
  jitterMs: number;
  maxDelayMs: number;
  retryMethods: readonly HttpMethod[];
}

interface RequestLifecycleContext {
  url: string;
  init: RequestInit;
  attempt: number;
}

interface ResponseLifecycleContext extends RequestLifecycleContext {
  response: Response;
}

interface ErrorLifecycleContext extends RequestLifecycleContext {
  error: ApiClientError;
}

export interface ApiClientOptions {
  baseUrl?: string;
  defaultHeaders?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  fetcher?: typeof fetch;
  timeoutMs?: number;
  retry?: Partial<RetryOptions>;
  getAuthToken?: () => string | null | undefined | Promise<string | null | undefined>;
  onAuthError?: (error: ApiClientError) => void | Promise<void>;
  traceContext?: () =>
    | { traceparent?: string; tracestate?: string }
    | Promise<{ traceparent?: string; tracestate?: string }>;
  beforeRequest?: (context: RequestLifecycleContext) => void | Promise<void>;
  afterResponse?: (context: ResponseLifecycleContext) => void | Promise<void>;
  onError?: (context: ErrorLifecycleContext) => void | Promise<void>;
  sleep?: (ms: number) => Promise<void>;
  random?: () => number;
  dedupe?: boolean;
}

export interface ApiClient {
  request<
    TResponse = unknown,
    TBody = unknown,
    TPath extends PathParams = PathParams,
    TQuery extends QueryParams = QueryParams,
  >(
    config: RequestConfig<TBody, TPath, TQuery>,
  ): Promise<TResponse>;
  endpoint<
    TResponse,
    TPath extends PathParams = PathParams,
    TQuery extends QueryParams = QueryParams,
    TBody = unknown,
  >(
    definition: EndpointDefinition<TResponse, TPath, TQuery, TBody>,
  ): (request?: EndpointRequest<TPath, TQuery, TBody>) => Promise<TResponse>;
}

const DEFAULT_TIMEOUT_MS = 15_000;
const ABOUT_BLANK_PROBLEM_TYPE = "about:blank";

const DEFAULT_RETRY: RetryOptions = {
  retries: 2,
  baseDelayMs: 150,
  jitterMs: 40,
  maxDelayMs: 2_000,
  retryMethods: ["GET", "HEAD"],
};

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const fetcher = options.fetcher ?? globalThis.fetch;
  if (!fetcher) {
    throw new Error("No fetch implementation available");
  }

  const sleep = options.sleep ?? defaultSleep;
  const random = options.random ?? Math.random;
  const inFlightGetRequests = new Map<string, Promise<unknown>>();

  async function request<
    TResponse = unknown,
    TBody = unknown,
    TPath extends PathParams = PathParams,
    TQuery extends QueryParams = QueryParams,
  >(
    config: RequestConfig<TBody, TPath, TQuery>,
  ): Promise<TResponse> {
    const mergedRetry = mergeRetryOptions(options.retry, config.retry);
    const timeoutMs = config.timeoutMs ?? options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const method = normalizeMethod(config.method);
    const url = buildRequestUrl(options.baseUrl, config.path, config.pathParams, config.query);
    const dedupeKey = buildDedupeKey({
      options,
      config,
      method,
      url,
      timeoutMs,
      retry: mergedRetry,
    });

    const executeRequest = async (): Promise<TResponse> => {
      let attempt = 0;
      while (attempt <= mergedRetry.retries) {

        const requestSignal = createRequestSignal(config.signal, timeoutMs);

        const headers = await buildRequestHeaders(options, config);
        const body = prepareBody(config.body, headers);

        const init: RequestInit = {
          method,
          headers,
          body,
          signal: requestSignal.signal,
        };

        try {
          await options.beforeRequest?.({ url, init, attempt });

          const response = await fetcher(url, init);

          await options.afterResponse?.({ url, init, response, attempt });

          if (!response.ok) {
            const parsedProblem = await parseProblemDetails(response);
            const problem = normalizeProblemDetails(parsedProblem, {
              type: ABOUT_BLANK_PROBLEM_TYPE,
              title: parsedProblem?.title ?? `HTTP ${response.status}`,
              status: response.status,
              instance: url,
            });
            const message = problem?.title ?? `HTTP ${response.status}`;
            const error = new ApiClientError({
              kind: "http",
              message,
              method,
              url,
              status: response.status,
              problem,
            });

            const shouldRetryStatus = shouldRetryHttpStatus(response.status);
            if (
              attempt < mergedRetry.retries &&
              shouldRetryRequest(method, mergedRetry) &&
              shouldRetryStatus
            ) {
              attempt += 1;
              const retryAfterMs = parseRetryAfterDelayMs(response.headers.get("retry-after"));
              await delayForRetry(mergedRetry, attempt, sleep, random, retryAfterMs);
              continue;
            }

            if (response.status === 401 || response.status === 403) {
              await options.onAuthError?.(error);
            }

            await options.onError?.({ url, init, error, attempt });
            throw error;
          }

          const parsed = await parseResponse<TResponse>(response, config.parseAs ?? "json", method, url);
          return parsed;
        } catch (caught) {
          const mapped = mapToApiClientError(caught, {
            method,
            url,
            timedOut: requestSignal.timedOut,
            aborted: requestSignal.aborted,
          });

          const retryableError = mapped.kind === "network" || mapped.kind === "timeout";
          if (
            attempt < mergedRetry.retries &&
            shouldRetryRequest(method, mergedRetry) &&
            retryableError
          ) {
            attempt += 1;
            await delayForRetry(mergedRetry, attempt, sleep, random);
            requestSignal.cleanup();
            continue;
          }

          await options.onError?.({ url, init, error: mapped, attempt });
          requestSignal.cleanup();
          throw mapped;
        } finally {
          requestSignal.cleanup();
        }
      }

      throw new Error("Unexpected retry state");
    };

    if (!dedupeKey) {
      return executeRequest();
    }

    const inFlight = inFlightGetRequests.get(dedupeKey);
    if (inFlight) {
      return inFlight as Promise<TResponse>;
    }

    const dedupedPromise = executeRequest().finally(() => {
      if (inFlightGetRequests.get(dedupeKey) === dedupedPromise) {
        inFlightGetRequests.delete(dedupeKey);
      }
    });

    inFlightGetRequests.set(dedupeKey, dedupedPromise as Promise<unknown>);
    return dedupedPromise;
  }

  function endpoint<
    TResponse,
    TPath extends PathParams = PathParams,
    TQuery extends QueryParams = QueryParams,
    TBody = unknown,
  >(
    definition: EndpointDefinition<TResponse, TPath, TQuery, TBody>,
  ): (requestOptions?: EndpointRequest<TPath, TQuery, TBody>) => Promise<TResponse> {
    return async (requestOptions = {}) => {
      return request<TResponse, TBody, TPath, TQuery>({
        method: definition.method,
        path: definition.path,
        parseAs: definition.parseAs,
        timeoutMs: definition.timeoutMs,
        retry: definition.retry,
        requiresAuth: definition.requiresAuth,
        pathParams: requestOptions.pathParams,
        query: requestOptions.query,
        body: requestOptions.body,
        headers: requestOptions.headers,
        signal: requestOptions.signal,
      });
    };
  }

  return {
    request,
    endpoint,
  };
}

function buildDedupeKey<
  TBody,
  TPath extends PathParams,
  TQuery extends QueryParams,
>(params: {
  options: ApiClientOptions;
  config: RequestConfig<TBody, TPath, TQuery>;
  method: HttpMethod;
  url: string;
  timeoutMs: number;
  retry: RetryOptions;
}): string | undefined {
  const { options, config, method, url, timeoutMs, retry } = params;

  if (!options.dedupe || method !== "GET") {
    return undefined;
  }

  if (config.signal) {
    return undefined;
  }

  if (config.body !== undefined && config.body !== null) {
    return undefined;
  }

  if (config.requiresAuth || options.getAuthToken || options.traceContext) {
    return undefined;
  }

  if (typeof options.defaultHeaders === "function") {
    return undefined;
  }

  const headersFingerprint = fingerprintHeaders(options.defaultHeaders, config.headers);
  const retryFingerprint = [
    retry.retries,
    retry.baseDelayMs,
    retry.jitterMs,
    retry.maxDelayMs,
    retry.retryMethods.join(","),
  ].join(":");
  const parseAs = config.parseAs ?? "json";

  return [
    method,
    url,
    `parse=${parseAs}`,
    `timeout=${timeoutMs}`,
    `retry=${retryFingerprint}`,
    `headers=${headersFingerprint}`,
  ].join("|");
}

function fingerprintHeaders(
  defaultHeaders: HeadersInit | undefined,
  requestHeaders: HeadersInit | undefined,
): string {
  const merged = new Headers();

  if (defaultHeaders) {
    mergeHeaders(merged, defaultHeaders);
  }

  if (requestHeaders) {
    mergeHeaders(merged, requestHeaders);
  }

  const normalized: Array<[string, string]> = [];
  merged.forEach((value, key) => {
    normalized.push([key.toLowerCase().trim(), value.trim()]);
  });

  normalized.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1].localeCompare(b[1]);
    }
    return a[0].localeCompare(b[0]);
  });

  return normalized.map(([key, value]) => `${key}:${value}`).join(";");
}

function normalizeMethod(method: HttpMethod): HttpMethod {
  return method.toUpperCase() as HttpMethod;
}

function mergeRetryOptions(
  globalRetry: Partial<RetryOptions> | undefined,
  localRetry: Partial<RetryOptions> | undefined,
): RetryOptions {
  return {
    retries: localRetry?.retries ?? globalRetry?.retries ?? DEFAULT_RETRY.retries,
    baseDelayMs: localRetry?.baseDelayMs ?? globalRetry?.baseDelayMs ?? DEFAULT_RETRY.baseDelayMs,
    jitterMs: localRetry?.jitterMs ?? globalRetry?.jitterMs ?? DEFAULT_RETRY.jitterMs,
    maxDelayMs: localRetry?.maxDelayMs ?? globalRetry?.maxDelayMs ?? DEFAULT_RETRY.maxDelayMs,
    retryMethods:
      localRetry?.retryMethods ?? globalRetry?.retryMethods ?? DEFAULT_RETRY.retryMethods,
  };
}

function buildRequestUrl(
  baseUrl: string | undefined,
  path: string,
  pathParams: PathParams | undefined,
  query: QueryParams | undefined,
): string {
  const interpolatedPath = interpolatePath(path, pathParams);
  const base = baseUrl
    ? new URL(interpolatedPath, resolveBaseUrl(baseUrl))
    : typeof globalThis.location !== "undefined"
      ? new URL(interpolatedPath, globalThis.location.origin)
      : (() => { throw new ApiClientError({
          kind: "network",
          message: `Cannot resolve relative path "${interpolatedPath}" without baseUrl (no browser context available)`,
          method: "GET",
          url: interpolatedPath,
        }); })();

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      appendQuery(base.searchParams, key, value);
    }
  }

  return base.toString();
}

function resolveBaseUrl(baseUrl: string): string {
  // If baseUrl is already absolute (has protocol), just ensure trailing slash
  if (/^https?:\/\//i.test(baseUrl)) {
    return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  }

  // If baseUrl is relative, resolve it against current location
  if (typeof globalThis.location !== "undefined") {
    const absolute = new URL(baseUrl, globalThis.location.origin);
    return absolute.href.endsWith("/") ? absolute.href : `${absolute.href}/`;
  }

  // Fallback: treat as absolute and add trailing slash
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

function interpolatePath(path: string, pathParams: PathParams | undefined): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, (_match, key: string) => {
    if (!pathParams || !(key in pathParams)) {
      throw new Error(`Missing path parameter: ${key}`);
    }

    return encodeURIComponent(String(pathParams[key]));
  });
}

function appendQuery(
  params: URLSearchParams,
  key: string,
  value: QueryValue,
): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (item === null || item === undefined) {
        continue;
      }

      params.append(key, String(item));
    }
    return;
  }

  if (value === null || value === undefined) {
    return;
  }

  params.append(key, String(value));
}

async function buildRequestHeaders<
  TBody,
  TPath extends PathParams,
  TQuery extends QueryParams,
>(
  options: ApiClientOptions,
  config: RequestConfig<TBody, TPath, TQuery>,
): Promise<Headers> {
  const headers = new Headers();

  const defaultHeaders = options.defaultHeaders;
  if (defaultHeaders) {
    const resolvedHeaders =
      typeof defaultHeaders === "function" ? await defaultHeaders() : defaultHeaders;
    mergeHeaders(headers, resolvedHeaders);
  }

  if (config.headers) {
    mergeHeaders(headers, config.headers);
  }

  if (config.requiresAuth && options.getAuthToken && !headers.has("authorization")) {
    const token = await options.getAuthToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
  }

  if (options.traceContext) {
    const trace = await options.traceContext();
    if (trace.traceparent && !headers.has("traceparent")) {
      headers.set("traceparent", trace.traceparent);
    }

    if (trace.tracestate && !headers.has("tracestate")) {
      headers.set("tracestate", trace.tracestate);
    }
  }

  return headers;
}

function mergeHeaders(target: Headers, source: HeadersInit): void {
  const headers = new Headers(source);
  headers.forEach((value, key) => {
    target.set(key, value);
  });
}

function prepareBody(body: unknown, headers: Headers): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer
  ) {
    return body;
  }

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return JSON.stringify(body);
}

function createRequestSignal(
  externalSignal: AbortSignal | undefined,
  timeoutMs: number,
): {
  signal: AbortSignal;
  cleanup: () => void;
  timedOut: () => boolean;
  aborted: () => boolean;
} {
  const controller = new AbortController();

  let timedOut = false;
  let aborted = false;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const onExternalAbort = (): void => {
    aborted = true;
    controller.abort(externalSignal?.reason ?? new DOMException("Aborted", "AbortError"));
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      onExternalAbort();
    } else {
      externalSignal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  if (timeoutMs >= 0) {
    timeout = setTimeout(() => {
      timedOut = true;
      controller.abort(new DOMException("Timed out", "TimeoutError"));
    }, timeoutMs);
  }

  const cleanup = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    if (externalSignal) {
      externalSignal.removeEventListener("abort", onExternalAbort);
    }
  };

  return {
    signal: controller.signal,
    cleanup,
    timedOut: () => timedOut,
    aborted: () => aborted || externalSignal?.aborted === true,
  };
}

async function parseResponse<TResponse>(
  response: Response,
  parseAs: ParseAs,
  method: HttpMethod,
  url: string,
): Promise<TResponse> {
  if (parseAs === "raw") {
    return response as unknown as TResponse;
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as TResponse;
  }

  if (parseAs === "text") {
    return (await response.text()) as TResponse;
  }

  if (parseAs === "blob") {
    return (await response.blob()) as TResponse;
  }

  const text = await response.text();
  if (!text.trim()) {
    return undefined as TResponse;
  }

  try {
    return JSON.parse(text) as TResponse;
  } catch (cause) {
    throw new ApiClientError({
      kind: "parse",
      message: "Failed to parse JSON response",
      method,
      url,
      status: response.status,
      problem: {
        type: "urn:infini:error:parse",
        title: "Response Parse Error",
        status: response.status,
        detail: "Failed to parse JSON response",
        instance: url,
      },
      cause,
    });
  }
}

async function parseProblemDetails(response: Response): Promise<ProblemDetails | undefined> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("json")) {
    const text = await response.text();
    if (!text.trim()) {
      return { status: response.status, title: `HTTP ${response.status}` };
    }

    return {
      status: response.status,
      title: `HTTP ${response.status}`,
      detail: text,
    };
  }

  try {
    const json = (await response.json()) as ProblemDetails;
    if (typeof json === "object" && json) {
      return json;
    }
  } catch {
    return {
      status: response.status,
      title: `HTTP ${response.status}`,
    };
  }

  return {
    status: response.status,
    title: `HTTP ${response.status}`,
  };
}

function mapToApiClientError(
  error: unknown,
  context: {
    method: HttpMethod;
    url: string;
    timedOut: () => boolean;
    aborted: () => boolean;
  },
): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (context.timedOut()) {
    return new ApiClientError({
      kind: "timeout",
      message: "Request timed out",
      method: context.method,
      url: context.url,
      status: 408,
      problem: {
        type: "urn:infini:error:timeout",
        title: "Request Timeout",
        status: 408,
        detail: "Request timed out",
        instance: context.url,
      },
      cause: error,
    });
  }

  if (context.aborted()) {
    return new ApiClientError({
      kind: "aborted",
      message: "Request aborted",
      method: context.method,
      url: context.url,
      status: 499,
      problem: {
        type: "urn:infini:error:aborted",
        title: "Request Aborted",
        status: 499,
        detail: "Request aborted",
        instance: context.url,
      },
      cause: error,
    });
  }

  return new ApiClientError({
    kind: "network",
    message: "Network request failed",
    method: context.method,
    url: context.url,
    status: 0,
    problem: {
      type: "urn:infini:error:network",
      title: "Network Error",
      status: 0,
      detail: "Network request failed",
      instance: context.url,
    },
    cause: error,
  });
}

function normalizeProblemDetails(
  value: ProblemDetails | undefined,
  fallback: {
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
  },
): ProblemDetails {
  const source = value && typeof value === "object" ? value : {};
  const detail = typeof source.detail === "string" ? source.detail : fallback.detail;

  return {
    ...source,
    type: typeof source.type === "string" ? source.type : fallback.type,
    title: typeof source.title === "string" ? source.title : fallback.title,
    status: typeof source.status === "number" ? source.status : fallback.status,
    instance: typeof source.instance === "string" ? source.instance : fallback.instance,
    ...(detail !== undefined ? { detail } : {}),
  };
}

function shouldRetryRequest(method: HttpMethod, retry: RetryOptions): boolean {
  return retry.retryMethods.includes(method);
}

function shouldRetryHttpStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

async function delayForRetry(
  retry: RetryOptions,
  attempt: number,
  sleep: (ms: number) => Promise<void>,
  random: () => number,
  overrideDelayMs?: number,
): Promise<void> {
  const delayMs = resolveRetryDelayMs(retry, attempt, random, overrideDelayMs);
  await sleep(delayMs);
}

function resolveRetryDelayMs(
  retry: RetryOptions,
  attempt: number,
  random: () => number,
  overrideDelayMs?: number,
): number {
  if (typeof overrideDelayMs === "number" && Number.isFinite(overrideDelayMs)) {
    return Math.max(0, Math.floor(overrideDelayMs));
  }

  const exponential = retry.baseDelayMs * Math.pow(2, attempt - 1);
  const jitter = Math.floor(random() * retry.jitterMs);
  return Math.min(retry.maxDelayMs, exponential + jitter);
}

function parseRetryAfterDelayMs(retryAfter: string | null | undefined): number | undefined {
  if (!retryAfter) {
    return undefined;
  }

  const normalized = retryAfter.trim();
  if (!normalized) {
    return undefined;
  }

  const seconds = Number(normalized);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.floor(seconds * 1000);
  }

  const absoluteTimestamp = Date.parse(normalized);
  if (Number.isNaN(absoluteTimestamp)) {
    return undefined;
  }

  return Math.max(0, absoluteTimestamp - Date.now());
}

async function defaultSleep(ms: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
