import { forwardRef } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useState } from "react";
import clsx from "clsx";

import "./InfiniTagInput.css";

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
      <div ref={ref} className={clsx("infini-tag-input", className)} style={style} {...rest}>
        <div className="infini-tag-input-field">
          {label && <label className="infini-tag-input-label">{label}</label>}
          <input
            type="text"
            className="infini-tag-input-control"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(input)}
          />
        </div>
        {tags.length > 0 ? (
          <div className="infini-tag-input-tags">
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="infini-tag-input-tag">
                {tag}
                <button
                  type="button"
                  className="infini-tag-input-remove"
                  onClick={() => removeTag(index)}
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);
