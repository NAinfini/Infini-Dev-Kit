import { Stack } from "@mantine/core";
import type { ComponentType, CSSProperties, ForwardedRef, FormEvent, ReactElement, ReactNode, Ref } from "react";
import { createContext, forwardRef, useContext } from "react";
import { useForm, type DefaultValues, type FieldErrors, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { DepthButton } from "../buttons/DepthButton";

type InfiniFormContextValue<T extends FieldValues = FieldValues> = UseFormReturn<T>;

const FormContext = createContext<InfiniFormContextValue | null>(null);

function useInfiniFormContext<T extends FieldValues = FieldValues>(): InfiniFormContextValue<T> {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("InfiniForm.Field must be used inside <InfiniForm>");
  return ctx as unknown as InfiniFormContextValue<T>;
}

type InfiniFormProps<T extends FieldValues> = {
  schema: ZodType<T>;
  onSubmit: (values: T) => void | Promise<void>;
  onError?: (errors: FieldErrors<T>) => void;
  defaultValues?: DefaultValues<T>;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type FieldProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  component: ComponentType<Record<string, unknown>>;
  [key: string]: unknown;
};

function Field<T extends FieldValues>({ name, label, component: Component, ...rest }: FieldProps<T>) {
  const { register, formState: { errors } } = useInfiniFormContext<T>();
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <Component
      {...rest}
      {...register(name)}
      label={label}
      error={errorMessage}
    />
  );
}

type SubmitProps = {
  label?: string;
  [key: string]: unknown;
};

function Submit({ label = "Submit", ...rest }: SubmitProps) {
  const { formState: { isSubmitting } } = useInfiniFormContext();
  return (
    <DepthButton htmlType="submit" disabled={isSubmitting} {...rest}>
      {label}
    </DepthButton>
  );
}

function InfiniFormInner<T extends FieldValues>(
  {
    schema,
    onSubmit,
    onError,
    defaultValues,
    children,
    className,
    style,
    ...rest
  }: InfiniFormProps<T>,
  ref: ForwardedRef<HTMLFormElement>,
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void form.handleSubmit(onSubmit, onError)(event);
  };

  return (
    <FormContext.Provider value={form as unknown as InfiniFormContextValue}>
      <form ref={ref} onSubmit={handleSubmit} className={className} style={style} {...rest}>
        <Stack gap="md">
          {children}
        </Stack>
      </form>
    </FormContext.Provider>
  );
}

export const InfiniForm = forwardRef(InfiniFormInner) as <T extends FieldValues>(
  props: InfiniFormProps<T> & { ref?: Ref<HTMLFormElement> }
) => ReactElement;

(InfiniForm as unknown as { Field: typeof Field; Submit: typeof Submit }).Field = Field;
(InfiniForm as unknown as { Field: typeof Field; Submit: typeof Submit }).Submit = Submit;
