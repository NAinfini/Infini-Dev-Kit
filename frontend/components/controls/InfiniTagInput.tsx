import { forwardRef } from "react";
import { Badge, CloseButton, Group, TextInput } from "@mantine/core";
import type { CSSProperties, KeyboardEvent } from "react";
import { useState } from "react";
import clsx from "clsx";

export type InfiniTagInputProps = {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  separator?: string;
  className?: string;
  style?: CSSProperties;
};

export const InfiniTagInput = forwardRef<HTMLDivElement, InfiniTagInputProps>(
  function InfiniTagInput({
    value: controlledValue,
    onChange,
    placeholder = "Add tag...",
    label,
    maxTags,
    allowDuplicates = false,
    separator = ",",
    className,
    style,
    ...rest
  }, ref) {
    const [internal, setInternal] = useState<string[]>(controlledValue ?? []);
    const [input, setInput] = useState("");
    const tags = controlledValue ?? internal;

    const setTags = (next: string[]) => {
      setInternal(next);
      onChange?.(next);
    };

    const addTag = (raw: string) => {
      const tag = raw.trim();
      if (!tag) return;
      if (!allowDuplicates && tags.includes(tag)) return;
      if (maxTags && tags.length >= maxTags) return;
      setTags([...tags, tag]);
      setInput("");
    };

    const removeTag = (index: number) => {
      setTags(tags.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === separator) {
        e.preventDefault();
        addTag(input);
      } else if (e.key === "Backspace" && !input && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    };

    return (
      <div ref={ref} className={clsx(className)} style={style} {...rest}>
        <TextInput
          label={label}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(input)}
        />
        {tags.length > 0 ? (
          <Group gap={6} mt={8} wrap="wrap">
            {tags.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="light"
                rightSection={
                  <CloseButton
                    size="xs"
                    onClick={() => removeTag(index)}
                    aria-label={`Remove ${tag}`}
                  />
                }
              >
                {tag}
              </Badge>
            ))}
          </Group>
        ) : null}
      </div>
    );
  }
);
