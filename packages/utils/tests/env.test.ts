import { describe, expect, it } from "vitest";

import { readEnv } from "../env";

describe("readEnv", () => {
  it("reads required and optional values with parsing", () => {
    const env = readEnv(
      {
        API_URL: "https://api.example.com",
        RETRY_COUNT: "3",
        FEATURE_X: "true",
      },
      {
        apiUrl: { key: "API_URL", required: true },
        retryCount: { key: "RETRY_COUNT", parse: (value) => Number(value), default: 1 },
        featureX: { key: "FEATURE_X", parse: (value) => value === "true", default: false },
      },
    );

    expect(env.apiUrl).toBe("https://api.example.com");
    expect(env.retryCount).toBe(3);
    expect(env.featureX).toBe(true);
  });

  it("uses default values when missing", () => {
    const env = readEnv(
      {},
      {
        appName: { key: "APP_NAME", default: "Infini" },
      },
    );

    expect(env.appName).toBe("Infini");
  });

  it("throws for missing required values", () => {
    expect(() =>
      readEnv(
        {},
        {
          apiKey: { key: "API_KEY", required: true },
        },
      ),
    ).toThrow("Missing required environment variable: API_KEY");
  });
});
