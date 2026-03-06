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

import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";

export interface ImageGridEditorItem {
  /** Unique key for this image (e.g. URL or storage key) */
  id: string;
  /** Display URL — if falsy, shows the id as a placeholder label */
  src?: string;
  /** Alt text */
  alt?: string;
}

export interface ImageGridEditorProps {
  /** Current list of images, in display order */
  items: ImageGridEditorItem[];
  /** Called when items are reordered via drag-drop */
  onReorder: (items: ImageGridEditorItem[]) => void;
  /** Called when the user clicks the delete button on an image */
  onDelete?: (item: ImageGridEditorItem) => void;
  /** Called when the user selects files to upload.
   *  The consumer is responsible for actual upload logic. */
  onSelectFiles?: (files: File[]) => void;
  /** Max number of images allowed. Upload slot hidden when reached. */
  maxImages?: number;
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
  theme,
}: {
  item: ImageGridEditorItem;
  imageSize: number;
  borderRadius: number;
  onDelete?: (item: ImageGridEditorItem) => void;
  disabled: boolean;
  fullMotion: boolean;
  motionAllowed: boolean;
  theme: ReturnType<typeof useThemeSnapshot>["theme"];
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
    border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
    pointerEvents: "none",
    userSelect: "none",
  };

  const placeholderStyle: CSSProperties = {
    width: imageSize,
    height: imageSize,
    borderRadius,
    border: `${theme.foundation.borderWidth}px dashed ${theme.foundation.borderColor}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    textAlign: "center",
    fontSize: Math.max(9, imageSize * 0.12),
    color: theme.palette.textMuted,
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
    background: theme.palette.danger,
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

  const hasUrl = item.src && /^https?:\/\//i.test(item.src);

  return (
    <Reorder.Item
      key={item.id}
      value={item}
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
        boxShadow: theme.foundation.shadowLg,
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
      onSelectFiles,
      maxImages = 10,
      imageSize = 80,
      borderRadius = 8,
      gap = 8,
      accept = "image/*",
      uploadLabel,
      disabled = false,
      style: styleProp,
      "aria-label": ariaLabel,
    },
    ref,
  ) {
    const { theme } = useThemeSnapshot();
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();

    const canUpload = !disabled && items.length < maxImages && onSelectFiles;

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0 || !onSelectFiles) return;
        const remaining = maxImages - items.length;
        const selected = Array.from(fileList).slice(0, Math.max(0, remaining));
        if (selected.length > 0) {
          onSelectFiles(selected);
        }
        // reset so re-selecting the same file triggers onChange
        e.target.value = "";
      },
      [items.length, maxImages, onSelectFiles],
    );

    const uploadSlotStyle: CSSProperties = {
      width: imageSize,
      height: imageSize,
      borderRadius,
      border: `2px dashed ${theme.foundation.borderColor}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      background: "transparent",
      color: theme.palette.textMuted,
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
      <div ref={ref} style={containerStyle} aria-label={ariaLabel}>
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
                theme={theme}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {canUpload ? (
          <motion.label
            htmlFor={inputId}
            style={uploadSlotStyle}
            whileHover={motionAllowed ? {
              borderColor: theme.palette.primary,
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
