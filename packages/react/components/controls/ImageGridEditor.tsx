import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";

export interface ImageGridEditorItem {
  /** Unique key for this image (e.g. URL or storage key) */
  id: string;
  /** Display URL — if falsy, shows the id as a placeholder label */
  src?: string;
  /** Alt text */
  alt?: string;
  /** Optional: the converted File object for upload */
  file?: File;
}

export interface ImageGridEditorProps {
  /** Current list of images, in display order */
  items: ImageGridEditorItem[];
  /** Called when items are reordered via drag-drop */
  onReorder: (items: ImageGridEditorItem[]) => void;
  /** Called when the user clicks the delete button on an image */
  onDelete?: (item: ImageGridEditorItem) => void;
  /** Called when the user selects files to upload. */
  onFilesSelected?: (files: File[]) => void;
  /** Max number of images allowed. Upload slot hidden when reached. */
  maxImages?: number;
  /** Max file size in bytes. Files exceeding this are rejected. */
  maxFileSize?: number;
  /** Allowed MIME types (e.g. ["image/png", "image/jpeg"]). Files not matching are rejected. */
  allowedTypes?: string[];
  /** Called on validation or rendering errors */
  onError?: (error: Error) => void;
  /** Current error — renders errorContent or default error UI when set */
  error?: Error | string;
  /** Custom error UI */
  errorContent?: ReactNode;
  /** When true, renders skeleton instead of grid */
  loading?: boolean;
  /** Custom loading UI */
  loadingContent?: ReactNode;
  /** Size of each thumbnail cell in px (default: 80) */
  imageSize?: number;
  /** Border radius of each thumbnail in px (default: 8) */
  borderRadius?: number;
  /** Gap between grid cells in px (default: 8) */
  gap?: number;
  /** Accepted file types for the upload input (default: "image/*") */
  accept?: string;
  /** Custom label for the upload slot */
  uploadLabel?: ReactNode;
  /** Disable all interactions */
  disabled?: boolean;
  className?: string;
  /** Style overrides on the outer container */
  style?: CSSProperties;
  /** Aria label for the grid */
  "aria-label"?: string;
}

/** A single draggable image cell */
function DraggableImageCell({
  item,
  imageSize,
  borderRadius,
  onDelete,
  disabled,
  fullMotion,
  motionAllowed,
}: {
  item: ImageGridEditorItem;
  imageSize: number;
  borderRadius: number;
  onDelete?: (item: ImageGridEditorItem) => void;
  disabled: boolean;
  fullMotion: boolean;
  motionAllowed: boolean;
}) {
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  const cellStyle: CSSProperties = {
    position: "relative",
    width: imageSize,
    height: imageSize,
    borderRadius,
    overflow: "visible",
    cursor: disabled ? "default" : "grab",
    listStyle: "none",
  };

  const imgStyle: CSSProperties = {
    width: imageSize,
    height: imageSize,
    objectFit: "cover",
    borderRadius,
    display: "block",
    border: "var(--infini-border-width) var(--infini-border-style, solid) var(--infini-color-border)",
    pointerEvents: "none",
    userSelect: "none",
  };

  const placeholderStyle: CSSProperties = {
    width: imageSize,
    height: imageSize,
    borderRadius,
    border: "var(--infini-border-width) dashed var(--infini-color-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    textAlign: "center",
    fontSize: Math.max(9, imageSize * 0.12),
    color: "var(--infini-color-text-muted)",
    userSelect: "none",
    wordBreak: "break-all",
    overflow: "hidden",
  };

  const deleteButtonStyle: CSSProperties = {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "none",
    background: "var(--infini-color-danger, #ef4444)",
    color: "#fff",
    fontSize: 13,
    lineHeight: "20px",
    textAlign: "center",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    zIndex: 3,
  };

  // Subtle idle tilt animation — gentle rocking to hint draggability
  const idleTiltAnimate = fullMotion && !disabled && !isDragging
    ? {
        rotate: [0, 1.2, 0, -1.2, 0],
      }
    : { rotate: 0 };

  const idleTiltTransition = fullMotion && !disabled && !isDragging
    ? {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
        repeatDelay: 3,
      }
    : undefined;

  const hasUrl = item.src && (/^(https?|blob):\/\//i.test(item.src) || item.src.startsWith("/"));

  return (
    <Reorder.Item
      key={item.id}
      value={item}
      role="listitem"
      aria-label={item.alt ?? item.id}
      dragControls={dragControls}
      dragListener={!disabled}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      layout={motionAllowed ? "position" : undefined}
      style={{
        ...cellStyle,
        zIndex: isDragging ? 10 : 1,
      }}
      animate={idleTiltAnimate}
      transition={idleTiltTransition}
      whileDrag={motionAllowed ? {
        scale: 1.08,
        rotate: 0,
        boxShadow: "var(--infini-shadow-hover)",
        cursor: "grabbing",
      } : undefined}
    >
      {hasUrl ? (
        <img
          src={item.src!}
          alt={item.alt ?? ""}
          loading="lazy"
          decoding="async"
          style={imgStyle}
          draggable={false}
        />
      ) : (
        <div style={placeholderStyle}>
          {item.id.length > 20 ? `${item.id.slice(0, 18)}…` : item.id}
        </div>
      )}

      {onDelete && !disabled ? (
        <motion.button
          type="button"
          aria-label={`Delete ${item.alt ?? item.id}`}
          style={deleteButtonStyle}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          whileHover={motionAllowed ? { scale: 1.15 } : undefined}
          whileTap={motionAllowed ? { scale: 0.9 } : undefined}
        >
          ×
        </motion.button>
      ) : null}
    </Reorder.Item>
  );
}

/**
 * ImageGridEditor — a reusable image grid with drag-to-reorder, delete, and upload slot.
 *
 * Uses `motion/react` Reorder for drag-drop. Each cell has a subtle idle tilt
 * animation to hint draggability (gated behind full-motion preference).
 *
 * This is a controlled component — the consumer owns the `items` array and
 * handles upload/delete/reorder via callbacks.
 */
export const ImageGridEditor = forwardRef<HTMLDivElement, ImageGridEditorProps>(
  function ImageGridEditor(
    {
      items,
      onReorder,
      onDelete,
      onFilesSelected,
      maxImages = 10,
      maxFileSize,
      allowedTypes,
      onError,
      error,
      errorContent,
      loading,
      loadingContent,
      imageSize = 80,
      borderRadius = 8,
      gap = 8,
      accept = "image/*",
      uploadLabel,
      disabled = false,
      className,
      style: styleProp,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();

    if (loading) return <>{loadingContent}</>;

    if (error) {
      return <>{errorContent}</>;
    }

    const canUpload = !disabled && items.length < maxImages && onFilesSelected;

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0 || !onFilesSelected) return;
        const remaining = maxImages - items.length;
        let selected = Array.from(fileList).slice(0, Math.max(0, remaining));

        if (allowedTypes && allowedTypes.length > 0) {
          const rejected = selected.filter((f) => !allowedTypes.includes(f.type));
          if (rejected.length > 0) {
            const err = new Error(`File type not allowed: ${rejected.map((f) => f.name).join(", ")}`);
            console.error("[ImageGridEditor]", err);
            try { onError?.(err); } catch { /* swallow */ }
          }
          selected = selected.filter((f) => allowedTypes.includes(f.type));
        }

        if (maxFileSize) {
          const oversized = selected.filter((f) => f.size > maxFileSize);
          if (oversized.length > 0) {
            const err = new Error(`File too large: ${oversized.map((f) => f.name).join(", ")} (max ${maxFileSize} bytes)`);
            console.error("[ImageGridEditor]", err);
            try { onError?.(err); } catch { /* swallow */ }
          }
          selected = selected.filter((f) => f.size <= maxFileSize);
        }

        if (selected.length > 0) {
          onFilesSelected(selected);
        }

        e.target.value = "";
      },
      [items.length, maxImages, onFilesSelected, maxFileSize, allowedTypes, onError],
    );

    const uploadSlotStyle: CSSProperties = {
      width: imageSize,
      height: imageSize,
      borderRadius,
      border: "2px dashed var(--infini-color-border)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      background: "transparent",
      color: "var(--infini-color-text-muted)",
      fontSize: Math.max(10, imageSize * 0.14),
      transition: "border-color 150ms ease",
      padding: 4,
    };

    const containerStyle: CSSProperties = {
      display: "flex",
      flexWrap: "wrap",
      gap,
      alignItems: "flex-start",
      ...styleProp,
    };

    return (
      <div ref={ref} className={className} style={containerStyle} aria-label={ariaLabel} role="list" aria-live="polite" {...rest}>
        <Reorder.Group
          axis="x"
          values={items}
          onReorder={onReorder}
          layoutScroll
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap,
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <DraggableImageCell
                key={item.id}
                item={item}
                imageSize={imageSize}
                borderRadius={borderRadius}
                onDelete={onDelete}
                disabled={disabled}
                fullMotion={fullMotion}
                motionAllowed={motionAllowed}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {canUpload ? (
          <motion.label
            htmlFor={inputId}
            style={uploadSlotStyle}
            whileHover={motionAllowed ? {
              borderColor: "var(--infini-color-primary)",
              scale: 1.04,
            } : undefined}
            whileTap={motionAllowed ? { scale: 0.97 } : undefined}
          >
            {uploadLabel ?? (
              <>
                <span style={{ fontSize: Math.max(18, imageSize * 0.3), lineHeight: 1 }}>+</span>
                <span>{items.length}/{maxImages}</span>
              </>
            )}
            <input
              ref={fileInputRef}
              id={inputId}
              type="file"
              multiple
              accept={accept}
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={disabled}
            />
          </motion.label>
        ) : null}
      </div>
    );
  },
);
