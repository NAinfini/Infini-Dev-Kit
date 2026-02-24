export interface EnvVarSpec<TValue = string> {
  key: string;
  required?: boolean;
  default?: TValue;
  parse?: (value: string) => TValue;
}

export type EnvSchema = Record<string, EnvVarSpec<unknown>>;

export type EnvOutput<TSchema extends EnvSchema> = {
  [TKey in keyof TSchema]: TSchema[TKey] extends EnvVarSpec<infer TValue>
    ? TValue
    : string;
};

export function readEnv<TSchema extends EnvSchema>(
  source: Record<string, string | undefined>,
  schema: TSchema,
): EnvOutput<TSchema> {
  const output: Partial<EnvOutput<TSchema>> = {};

  const entries = Object.entries(schema) as [keyof TSchema, TSchema[keyof TSchema]][];
  for (const [outputKey, spec] of entries) {
    const raw = source[spec.key];

    if (raw === undefined || raw === "") {
      if (spec.default !== undefined) {
        output[outputKey] = spec.default as EnvOutput<TSchema>[typeof outputKey];
        continue;
      }

      if (spec.required) {
        throw new Error(`Missing required environment variable: ${spec.key}`);
      }

      output[outputKey] = undefined as EnvOutput<TSchema>[typeof outputKey];
      continue;
    }

    if (spec.parse) {
      output[outputKey] = spec.parse(raw) as EnvOutput<TSchema>[typeof outputKey];
      continue;
    }

    output[outputKey] = raw as EnvOutput<TSchema>[typeof outputKey];
  }

  return output as EnvOutput<TSchema>;
}
