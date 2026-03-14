let requestCounter = 0;

export function createRequestId(prefix = "req"): string {
  requestCounter += 1;
  const timestamp = Date.now().toString(36);
  const counter = requestCounter.toString(36);
  const random = randomHex(6);

  return `${prefix}_${timestamp}${counter}${random}`;
}

export function createTraceId(): string {
  return randomHex(32);
}

export function createSpanId(): string {
  return randomHex(16);
}

function randomHex(length: number): string {
  const bytes = randomBytes(Math.ceil(length / 2));
  let hex = "";

  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }

  return hex.slice(0, length);
}

function randomBytes(length: number): Uint8Array {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
    const bytes = new Uint8Array(length);
    cryptoApi.getRandomValues(bytes);
    return bytes;
  }

  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    bytes[i] = Math.floor(Math.random() * 256);
  }

  return bytes;
}
