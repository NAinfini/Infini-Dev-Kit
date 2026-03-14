/**
 * Ambient type stubs for optional peer dependencies.
 *
 * These declarations provide minimal type coverage so that Dev-Kit
 * compiles without requiring consumers to install every optional dep.
 * When a consumer installs the real package (e.g. @tanstack/react-table),
 * its types take precedence over these stubs.
 */

/* ---------- @tanstack/react-table ---------- */
declare module "@tanstack/react-table" {
  import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

  export type ColumnDef<T, V = unknown> = {
    id?: string;
    accessorKey?: keyof T & string;
    accessorFn?: (row: T) => V;
    header?: string | ((ctx: { column: Column<T> }) => ReactNode);
    cell?: (ctx: { row: Row<T>; getValue: () => V }) => ReactNode;
    size?: number;
    enableSorting?: boolean;
    [key: string]: unknown;
  };

  export type SortingState = { id: string; desc: boolean }[];
  export type RowSelectionState = Record<string, boolean>;

  export interface Column<T> {
    id: string;
    getCanSort(): boolean;
    getIsSorted(): false | "asc" | "desc";
    getToggleSortingHandler(): ((e: unknown) => void) | undefined;
    columnDef: ColumnDef<T>;
  }

  export interface Header<T> {
    id: string;
    colSpan: number;
    isPlaceholder: boolean;
    column: Column<T>;
    getContext(): Record<string, unknown>;
  }

  export interface HeaderGroup<T> {
    id: string;
    headers: Header<T>[];
  }

  export interface Cell<T> {
    id: string;
    column: Column<T>;
    getContext(): Record<string, unknown>;
  }

  export interface Row<T> {
    id: string;
    original: T;
    index: number;
    getVisibleCells(): Cell<T>[];
    getValue(columnId: string): unknown;
  }

  export interface Table<T> {
    getHeaderGroups(): HeaderGroup<T>[];
    getRowModel(): { rows: Row<T>[] };
  }

  export type TableOptions<T> = {
    data: T[];
    columns: ColumnDef<T, unknown>[];
    state?: { sorting?: SortingState; rowSelection?: RowSelectionState };
    onSortingChange?: (updater: SortingState | ((old: SortingState) => SortingState)) => void;
    getCoreRowModel: ReturnType<typeof getCoreRowModel>;
    getSortedRowModel?: ReturnType<typeof getSortedRowModel>;
    [key: string]: unknown;
  };

  export function useReactTable<T>(options: TableOptions<T>): Table<T>;
  export function flexRender(component: unknown, props: Record<string, unknown>): ReactNode;
  export function getCoreRowModel<T>(): () => void;
  export function getSortedRowModel<T>(): () => void;
}

/* ---------- react-hook-form ---------- */
declare module "react-hook-form" {
  import type { ComponentType, BaseSyntheticEvent } from "react";

  export type FieldValues = Record<string, unknown>;
  export type Path<T extends FieldValues> = string & keyof T;
  export type DefaultValues<T extends FieldValues> = Partial<T>;

  export type FieldError = { message?: string; type: string };
  export type FieldErrors<T extends FieldValues> = Partial<Record<keyof T, FieldError>>;

  export interface UseFormReturn<T extends FieldValues = FieldValues> {
    register(name: Path<T>): Record<string, unknown>;
    handleSubmit(
      onValid: (data: T) => void | Promise<void>,
      onInvalid?: (errors: FieldErrors<T>) => void,
    ): (e?: BaseSyntheticEvent) => Promise<void>;
    formState: {
      errors: FieldErrors<T>;
      isSubmitting: boolean;
      isDirty: boolean;
      isValid: boolean;
    };
    reset(values?: DefaultValues<T>): void;
    watch(): T;
    setValue(name: Path<T>, value: unknown): void;
    getValues(): T;
    control: unknown;
  }

  export interface UseFormProps<T extends FieldValues = FieldValues> {
    resolver?: unknown;
    defaultValues?: DefaultValues<T>;
    mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  }

  export function useForm<T extends FieldValues = FieldValues>(props?: UseFormProps<T>): UseFormReturn<T>;
}

/* ---------- @hookform/resolvers/zod ---------- */
declare module "@hookform/resolvers/zod" {
  export function zodResolver(schema: unknown): unknown;
}

/* ---------- zod (minimal) ---------- */
declare module "zod" {
  export type ZodType<T = unknown> = {
    parse(data: unknown): T;
    safeParse(data: unknown): { success: boolean; data?: T; error?: unknown };
    _output: T;
  };

  interface ZodString { min(n: number, msg?: string): ZodString; max(n: number, msg?: string): ZodString; email(msg?: string): ZodString; url(msg?: string): ZodString; optional(): ZodString; [k: string]: unknown }
  interface ZodNumber { min(n: number, msg?: string): ZodNumber; max(n: number, msg?: string): ZodNumber; int(msg?: string): ZodNumber; positive(msg?: string): ZodNumber; optional(): ZodNumber; [k: string]: unknown }
  interface ZodBoolean { optional(): ZodBoolean; [k: string]: unknown }
  interface ZodDate { optional(): ZodDate; [k: string]: unknown }
  interface ZodArray<T = unknown> { min(n: number, msg?: string): ZodArray<T>; max(n: number, msg?: string): ZodArray<T>; optional(): ZodArray<T>; [k: string]: unknown }
  interface ZodObject<T = unknown> { extend(shape: Record<string, unknown>): ZodObject; pick(mask: Record<string, true>): ZodObject; omit(mask: Record<string, true>): ZodObject; partial(): ZodObject; optional(): ZodObject; merge(other: ZodObject): ZodObject; [k: string]: unknown }
  interface ZodEnum<T = unknown> { optional(): ZodEnum<T>; [k: string]: unknown }

  export const z: {
    string(params?: Record<string, unknown>): ZodString;
    number(params?: Record<string, unknown>): ZodNumber;
    boolean(params?: Record<string, unknown>): ZodBoolean;
    date(params?: Record<string, unknown>): ZodDate;
    array(schema: unknown): ZodArray;
    object(shape: Record<string, unknown>): ZodObject;
    enum(values: readonly [string, ...string[]]): ZodEnum;
    union(types: readonly unknown[]): unknown;
    literal(value: unknown): unknown;
    optional(schema: unknown): unknown;
    nullable(schema: unknown): unknown;
    infer: never;
    [k: string]: unknown;
  };

  export type infer<T extends ZodType> = T["_output"];
}

/* ---------- @tiptap/* ---------- */
declare module "@tiptap/core" {
  export type Content = string | Record<string, unknown> | null;
  export type Extensions = unknown[];
  export interface Extension { name: string }
}

declare module "@tiptap/react" {
  import type { FC, ReactNode } from "react";

  interface ChainedCommands {
    focus(): ChainedCommands;
    run(): void;
    toggleBold(): ChainedCommands;
    toggleItalic(): ChainedCommands;
    toggleUnderline(): ChainedCommands;
    toggleStrike(): ChainedCommands;
    toggleHeading(attrs: { level: number }): ChainedCommands;
    toggleBulletList(): ChainedCommands;
    toggleOrderedList(): ChainedCommands;
    toggleBlockquote(): ChainedCommands;
    toggleCodeBlock(): ChainedCommands;
    insertTable(attrs: { rows: number; cols: number }): ChainedCommands;
    addColumnAfter(): ChainedCommands;
    addRowAfter(): ChainedCommands;
    deleteTable(): ChainedCommands;
    setImage(attrs: { src: string; alt?: string }): ChainedCommands;
    setLink(attrs: { href: string }): ChainedCommands;
    unsetLink(): ChainedCommands;
    extendMarkRange(name: string): ChainedCommands;
    deleteRange(range: { from: number; to: number }): ChainedCommands;
    [key: string]: (...args: unknown[]) => ChainedCommands;
  }

  export interface Editor {
    commands: {
      setContent(content: unknown, emitUpdate?: boolean): boolean;
      [key: string]: (...args: unknown[]) => boolean;
    };
    chain(): ChainedCommands;
    isActive(name: string, attrs?: Record<string, unknown>): boolean;
    getJSON(): Record<string, unknown>;
    getHTML(): string;
    getAttributes(name: string): Record<string, unknown>;
    isEmpty: boolean;
    isDestroyed: boolean;
    state: {
      selection: { from: number; to: number; anchor: number; head: number };
      doc: {
        textBetween(from: number, to: number, blockSeparator?: string, leafText?: string): string;
      };
    };
    on(event: string, handler: (...args: unknown[]) => void): void;
  }

  export function useEditor(config: Record<string, unknown>): Editor | null;
  export const EditorContent: FC<{ editor: Editor | null; className?: string }>;
}

declare module "@tiptap/starter-kit" {
  const StarterKit: { configure(opts?: Record<string, unknown>): unknown };
  export default StarterKit;
}

declare module "@tiptap/extension-code-block-lowlight" {
  const CodeBlockLowlight: { configure(opts?: Record<string, unknown>): unknown };
  export default CodeBlockLowlight;
}

declare module "@tiptap/extension-image" {
  const Image: { configure(opts?: Record<string, unknown>): unknown };
  export default Image;
}

declare module "@tiptap/extension-link" {
  const Link: { configure(opts?: Record<string, unknown>): unknown };
  export default Link;
}

declare module "@tiptap/extension-placeholder" {
  const Placeholder: { configure(opts?: Record<string, unknown>): unknown };
  export default Placeholder;
}

declare module "@tiptap/extension-table" {
  const Table: { configure(opts?: Record<string, unknown>): unknown };
  export default Table;
}

declare module "@tiptap/extension-table-cell" {
  const TableCell: unknown;
  export default TableCell;
}

declare module "@tiptap/extension-table-header" {
  const TableHeader: unknown;
  export default TableHeader;
}

declare module "@tiptap/extension-table-row" {
  const TableRow: unknown;
  export default TableRow;
}

declare module "@tiptap/extension-underline" {
  const Underline: unknown;
  export default Underline;
}

/* ---------- dompurify ---------- */
declare module "dompurify" {
  const DOMPurify: {
    sanitize(html: string, config?: Record<string, unknown>): string;
  };
  export default DOMPurify;
}

/* ---------- lowlight ---------- */
declare module "lowlight" {
  export const lowlight: unknown;
}

/* ---------- cmdk ---------- */
declare module "cmdk" {
  import type { FC, ReactNode, ComponentProps } from "react";
  export interface CommandProps { children?: ReactNode; className?: string; [key: string]: unknown }
  const Command: FC<CommandProps> & {
    Input: FC<ComponentProps<"input"> & { [key: string]: unknown }>;
    List: FC<{ children?: ReactNode; className?: string; [key: string]: unknown }>;
    Empty: FC<{ children?: ReactNode; [key: string]: unknown }>;
    Group: FC<{ heading?: ReactNode; children?: ReactNode; [key: string]: unknown }>;
    Item: FC<{ value?: string; onSelect?: (value: string) => void; children?: ReactNode; [key: string]: unknown }>;
    Separator: FC<{ [key: string]: unknown }>;
  };
  export { Command };
}

/* ---------- @mantine/carousel ---------- */
declare module "@mantine/carousel" {
  import type { FC, ReactNode, CSSProperties } from "react";
  export interface CarouselProps {
    children?: ReactNode;
    slideSize?: string | number;
    slideGap?: string | number;
    align?: "start" | "center" | "end";
    withIndicators?: boolean;
    withControls?: boolean;
    loop?: boolean;
    height?: string | number;
    getEmblaApi?: (embla: unknown) => void;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
  }
  export interface CarouselSlideProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
  }
  export const Carousel: FC<CarouselProps> & {
    Slide: FC<CarouselSlideProps>;
  };
}

/* ---------- @mantine/dates ---------- */
declare module "@mantine/dates" {
  import type { FC, ReactNode, CSSProperties } from "react";

  export type DatesRangeValue = [Date | null, Date | null];

  export interface CalendarProps {
    getDayProps?: (date: Date) => Record<string, unknown>;
    renderDay?: (date: Date) => ReactNode;
    onPreviousMonth?: (date: Date) => void;
    onNextMonth?: (date: Date) => void;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
  }
  export const Calendar: FC<CalendarProps>;

  export interface DatePickerProps {
    type?: "range" | "default";
    value?: DatesRangeValue | Date | null;
    onChange?: (value: DatesRangeValue) => void;
    minDate?: Date;
    maxDate?: Date;
    label?: string;
    placeholder?: string;
    clearable?: boolean;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
  }
  export const DatePicker: FC<DatePickerProps>;

  export interface DatePickerInputProps {
    type?: "range" | "default";
    value?: DatesRangeValue | Date | null;
    onChange?: (value: DatesRangeValue) => void;
    label?: string;
    placeholder?: string;
    clearable?: boolean;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
  }
  export const DatePickerInput: FC<DatePickerInputProps>;
}

/* ---------- swiper ---------- */
declare module "swiper/react" {
  import type { FC, ReactNode, CSSProperties } from "react";
  export interface SwiperProps {
    children?: ReactNode;
    modules?: unknown[];
    spaceBetween?: number;
    slidesPerView?: number | "auto";
    navigation?: boolean | Record<string, unknown>;
    pagination?: boolean | Record<string, unknown>;
    zoom?: boolean | Record<string, unknown>;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
  }
  export const Swiper: FC<SwiperProps>;
  export const SwiperSlide: FC<{ children?: ReactNode; className?: string; [key: string]: unknown }>;
}

declare module "swiper/modules" {
  export const Navigation: unknown;
  export const Pagination: unknown;
  export const Zoom: unknown;
}

declare module "swiper/css" {}
declare module "swiper/css/navigation" {}
declare module "swiper/css/pagination" {}
declare module "swiper/css/zoom" {}

/* ---------- @dnd-kit/* ---------- */
declare module "@dnd-kit/core" {
  import type { FC, ReactNode } from "react";
  export interface DndContextProps { children?: ReactNode; onDragEnd?: (event: DragEndEvent) => void; onDragStart?: (event: DragStartEvent) => void; onDragOver?: (event: DragOverEvent) => void; sensors?: unknown[]; collisionDetection?: unknown; [key: string]: unknown }
  export interface DragEndEvent { active: { id: string | number; data?: { current?: unknown } }; over: { id: string | number; data?: { current?: unknown } } | null }
  export interface DragStartEvent { active: { id: string | number; data?: { current?: unknown } } }
  export interface DragOverEvent { active: { id: string | number }; over: { id: string | number } | null }
  export const DndContext: FC<DndContextProps>;
  export const DragOverlay: FC<{ children?: ReactNode; [key: string]: unknown }>;
  export function closestCenter(args: unknown): unknown;
  export function useDroppable(opts: { id: string | number; disabled?: boolean }): { setNodeRef: (el: HTMLElement | null) => void; isOver: boolean; [key: string]: unknown };
  export function useSensor(sensor: unknown, opts?: Record<string, unknown>): unknown;
  export function useSensors(...sensors: unknown[]): unknown[];
  export const PointerSensor: unknown;
  export const KeyboardSensor: unknown;
  export const MouseSensor: unknown;
  export const TouchSensor: unknown;
}

declare module "@dnd-kit/sortable" {
  import type { FC, ReactNode } from "react";
  export interface SortableContextProps { items: (string | number)[]; children?: ReactNode; strategy?: unknown; [key: string]: unknown }
  export const SortableContext: FC<SortableContextProps>;
  export function useSortable(opts: { id: string | number; disabled?: boolean }): {
    attributes: Record<string, unknown>;
    listeners: Record<string, unknown>;
    setNodeRef: (el: HTMLElement | null) => void;
    transform: { x: number; y: number } | null;
    transition: string | undefined;
    isDragging: boolean;
  };
  export function verticalListSortingStrategy(args: unknown): unknown;
  export function horizontalListSortingStrategy(args: unknown): unknown;
  export function arrayMove<T>(arr: T[], from: number, to: number): T[];
  export function sortableKeyboardCoordinates(event: unknown): unknown;
}

declare module "@dnd-kit/utilities" {
  export function CSS_transform(transform: { x: number; y: number } | null): string | undefined;
  export const CSS: { Transform: { toString(transform: { x: number; y: number } | null): string | undefined } };
}
