export type Brand<T, TBrand extends string> = T & {
  readonly __brand: TBrand;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};

export type Result<TValue, TError> =
  | { ok: true; value: TValue }
  | { ok: false; error: TError };

export type Option<TValue> = { kind: "some"; value: TValue } | { kind: "none" };

export function ok<TValue>(value: TValue): Result<TValue, never> {
  return { ok: true, value };
}

export function err<TError>(error: TError): Result<never, TError> {
  return { ok: false, error };
}

export function isOk<TValue, TError>(result: Result<TValue, TError>): result is { ok: true; value: TValue } {
  return result.ok;
}

export function isErr<TValue, TError>(result: Result<TValue, TError>): result is { ok: false; error: TError } {
  return !result.ok;
}

export function mapResult<TValue, TError, TMapped>(
  result: Result<TValue, TError>,
  mapper: (value: TValue) => TMapped,
): Result<TMapped, TError> {
  if (isOk(result)) {
    return ok(mapper(result.value));
  }

  return result;
}

export function unwrapOr<TValue, TError>(result: Result<TValue, TError>, fallback: TValue): TValue {
  if (isOk(result)) {
    return result.value;
  }

  return fallback;
}

export function some<TValue>(value: TValue): Option<TValue> {
  return { kind: "some", value };
}

export function none(): Option<never> {
  return { kind: "none" };
}

export function isSome<TValue>(option: Option<TValue>): option is { kind: "some"; value: TValue } {
  return option.kind === "some";
}

export function isNone<TValue>(option: Option<TValue>): option is { kind: "none" } {
  return option.kind === "none";
}
