import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { IconChevronDown, IconX, IconCheck } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group"

// ── Context ───────────────────────────────────────────────────────────────────

interface ComboboxContextValue {
	value: string | string[]
	onValueChange: (value: string | string[] | null) => void
	multiple: boolean
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	chipsRef: React.RefObject<HTMLDivElement | null>
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null)

function useComboboxContext() {
	const ctx = React.useContext(ComboboxContext)
	if (!ctx) throw new Error("Combobox components must be used within <Combobox>")
	return ctx
}

// ── Root ──────────────────────────────────────────────────────────────────────

function Combobox({
	value,
	onValueChange,
	multiple = false,
	items: _items,
	open: openProp,
	onOpenChange,
	children,
}: {
	value: string | string[]
	onValueChange: (value: string | string[] | null) => void
	multiple?: boolean
	items?: unknown[]
	open?: boolean
	onOpenChange?: (open: boolean) => void
	children: React.ReactNode
}) {
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
	const chipsRef = React.useRef<HTMLDivElement | null>(null)
	const isControlled = openProp !== undefined
	const open = isControlled ? openProp : uncontrolledOpen
	const openRef = React.useRef(open)
	openRef.current = open

	const setOpen = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
		(action) => {
			const next = typeof action === "function" ? action(openRef.current) : action
			if (!isControlled) setUncontrolledOpen(next)
			onOpenChange?.(next)
		},
		[isControlled, onOpenChange],
	)

	return (
		<ComboboxContext.Provider value={{ value, onValueChange, multiple, open, setOpen, chipsRef }}>
			<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
				{children}
			</PopoverPrimitive.Root>
		</ComboboxContext.Provider>
	)
}

// ── Value ─────────────────────────────────────────────────────────────────────

function ComboboxValue({
	placeholder,
	className,
	children,
	...props
}: React.ComponentProps<"span"> & { placeholder?: string }) {
	const { value } = useComboboxContext()
	const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value)
	const fallback = Array.isArray(value) ? value.join(", ") : (value as string)
	return (
		<span data-slot="combobox-value" className={className} {...props}>
			{hasValue ? (children ?? fallback) : placeholder}
		</span>
	)
}

// ── Trigger ───────────────────────────────────────────────────────────────────

function ComboboxTrigger({
	className,
	children,
	render,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger> & {
	render?: React.ReactElement
}) {
	if (render) {
		return (
			<PopoverPrimitive.Trigger asChild data-slot="combobox-trigger">
				{React.cloneElement(render, props as React.HTMLAttributes<HTMLElement>)}
			</PopoverPrimitive.Trigger>
		)
	}
	return (
		<PopoverPrimitive.Trigger
			data-slot="combobox-trigger"
			className={cn("flex items-center gap-2 [&_svg:not([class*='size-'])]:size-4", className)}
			{...props}
		>
			{children}
			<IconChevronDown className="pointer-events-none size-4 text-muted-foreground" />
		</PopoverPrimitive.Trigger>
	)
}

// ── Input (inside content, for single-select search) ─────────────────────────

function ComboboxInput({
	className,
	children,
	disabled = false,
	showTrigger = true,
	showClear: _showClear = false,
	...props
}: React.ComponentProps<"input"> & {
	showTrigger?: boolean
	showClear?: boolean
}) {
	return (
		<InputGroup className={cn("w-auto", className)}>
			<InputGroupInput disabled={disabled} {...props} />
			{showTrigger && (
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						size="icon-xs"
						variant="ghost"
						data-slot="input-group-button"
						disabled={disabled}
						asChild
					>
						<PopoverPrimitive.Trigger>
							<IconChevronDown className="size-4" />
						</PopoverPrimitive.Trigger>
					</InputGroupButton>
				</InputGroupAddon>
			)}
			{children}
		</InputGroup>
	)
}

// ── Content ───────────────────────────────────────────────────────────────────

function ComboboxContent({
	className,
	align = "start",
	sideOffset = 6,
	anchor: _anchor,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
	anchor?: React.RefObject<HTMLElement | null>
}) {
	const { chipsRef } = useComboboxContext()

	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				data-slot="combobox-content"
				align={align}
				sideOffset={sideOffset}
				onInteractOutside={(e) => {
					if (chipsRef.current?.contains(e.target as Node)) {
						e.preventDefault()
					}
				}}
				className={cn(
					"group/combobox-content relative z-50 max-h-(--radix-popover-content-available-height) w-(--radix-popover-trigger-width) min-w-32 overflow-hidden rounded-lg bg-popover text-popover-foreground ring-1 ring-foreground/10 duration-100 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
					className,
				)}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	)
}

// ── List ──────────────────────────────────────────────────────────────────────

function ComboboxList({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			role="listbox"
			data-slot="combobox-list"
			className={cn(
				"no-scrollbar max-h-72 scroll-py-1 overflow-y-auto overscroll-contain p-1",
				className,
			)}
			{...props}
		/>
	)
}

// ── Item ──────────────────────────────────────────────────────────────────────

function ComboboxItem({
	className,
	children,
	value: itemValue,
	...props
}: React.ComponentProps<"div"> & { value: string }) {
	const { value, onValueChange, multiple, setOpen } = useComboboxContext()
	const isSelected = multiple
		? (value as string[]).includes(itemValue)
		: value === itemValue

	const handleSelect = () => {
		if (multiple) {
			const current = value as string[]
			onValueChange(
				current.includes(itemValue)
					? current.filter((v) => v !== itemValue)
					: [...current, itemValue],
			)
		} else {
			onValueChange(isSelected ? null : itemValue)
			setOpen(false)
		}
	}

	return (
		<div
			data-slot="combobox-item"
			role="option"
			aria-selected={isSelected}
			data-selected={isSelected || undefined}
			onClick={handleSelect}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault()
					handleSelect()
				}
			}}
			tabIndex={0}
			className={cn(
				"relative flex w-full cursor-pointer items-center gap-2 rounded-md py-1 pe-8 ps-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-selected:bg-accent/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			{children}
			{isSelected && (
				<span className="pointer-events-none absolute inset-e-2 flex size-4 items-center justify-center">
					<IconCheck />
				</span>
			)}
		</div>
	)
}

// ── Group ─────────────────────────────────────────────────────────────────────

function ComboboxGroup({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="combobox-group" className={cn(className)} {...props} />
}

// ── Label ─────────────────────────────────────────────────────────────────────

function ComboboxLabel({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="combobox-label"
			className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
			{...props}
		/>
	)
}

// ── Collection (pass-through for API compat) ──────────────────────────────────

function ComboboxCollection({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}

// ── Empty ─────────────────────────────────────────────────────────────────────

function ComboboxEmpty({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="combobox-empty"
			className={cn("py-2 text-center text-sm text-muted-foreground", className)}
			{...props}
		/>
	)
}

// ── Separator ─────────────────────────────────────────────────────────────────

function ComboboxSeparator({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="combobox-separator"
			className={cn("-mx-1 my-1 h-px bg-border", className)}
			{...props}
		/>
	)
}

// ── Chips container ───────────────────────────────────────────────────────────

const ComboboxChips = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
	function ComboboxChips({ className, ...props }, outerRef) {
		const { chipsRef } = useComboboxContext()

		return (
			<PopoverPrimitive.Anchor asChild>
				<div
					ref={(el) => {
						;(chipsRef as React.MutableRefObject<HTMLDivElement | null>).current = el
						if (typeof outerRef === "function") outerRef(el)
						else if (outerRef) outerRef.current = el
					}}
					data-slot="combobox-chips"
					className={cn(
						"flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
						className,
					)}
					{...props}
				/>
			</PopoverPrimitive.Anchor>
		)
	},
)

// ── Individual chip ───────────────────────────────────────────────────────────

function ComboboxChip({
	className,
	children,
	value: chipValue,
	showRemove = true,
	...props
}: React.ComponentProps<"div"> & {
	value: string
	showRemove?: boolean
}) {
	const { value, onValueChange } = useComboboxContext()

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation()
		const current = value as string[]
		onValueChange(current.filter((v) => v !== chipValue))
	}

	return (
		<div
			data-slot="combobox-chip"
			className={cn(
				"flex h-5.25 w-fit items-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground",
				showRemove && "pe-0",
				className,
			)}
			{...props}
		>
			{children}
			{showRemove && (
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					className="-ms-1 opacity-50 hover:opacity-100"
					data-slot="combobox-chip-remove"
					onClick={handleRemove}
				>
					<IconX className="pointer-events-none" />
				</Button>
			)}
		</div>
	)
}

// ── Input inside chips ────────────────────────────────────────────────────────

function ComboboxChipsInput({ className, onFocus, ...props }: React.ComponentProps<"input">) {
	const { setOpen } = useComboboxContext()

	return (
		<input
			data-slot="combobox-chip-input"
			className={cn("min-w-16 flex-1 bg-transparent outline-none", className)}
			onFocus={(e) => {
				setOpen(true)
				onFocus?.(e)
			}}
			{...props}
		/>
	)
}

// ── Anchor hook (legacy compat) ───────────────────────────────────────────────

function useComboboxAnchor() {
	return React.useRef<HTMLDivElement | null>(null)
}

export {
	Combobox,
	ComboboxInput,
	ComboboxContent,
	ComboboxList,
	ComboboxItem,
	ComboboxGroup,
	ComboboxLabel,
	ComboboxCollection,
	ComboboxEmpty,
	ComboboxSeparator,
	ComboboxChips,
	ComboboxChip,
	ComboboxChipsInput,
	ComboboxTrigger,
	ComboboxValue,
	useComboboxAnchor,
}
