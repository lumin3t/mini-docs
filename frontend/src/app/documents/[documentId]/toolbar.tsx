"use client"

import { useEditorStore } from "@/store/use-editor-store"

import {
  Bold,
  Italic,
  Underline,
  Undo2,
  Redo2,
  /*MessageSquarePlus,*/
  SpellCheck,
  Printer,
  List,
  ListOrdered,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  Palette,
  /*Highlighter,*/
  /*Link2,*/
} from "lucide-react"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

//////////////////////////////////////////
// FONT FAMILY (unchanged)
//////////////////////////////////////////

const FrontFamilyButton = () => {
  const { editor } = useEditorStore()

  const fonts = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Courier New", value: '"Courier New", monospace' },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Times New Roman", value: '"Times New Roman", serif' },
    { label: "Verdana", value: "Verdana, sans-serif" },
  ]

  const currentFont =
    editor?.getAttributes("textStyle")?.fontFamily || "Arial, sans-serif"

  const currentLabel =
    fonts.find((f) => f.value === currentFont)?.label || "Arial"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-x-1 px-2 h-7 rounded-sm hover:bg-neutral-200/80 text-sm min-w-[100px] justify-between">
          <span className="truncate" style={{ fontFamily: currentFont }}>
            {currentLabel}
          </span>
          <span className="text-xs opacity-60">▾</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="bg-white border shadow-md p-1 w-[180px]"
      >
        {fonts.map((font) => {
          const isActive = currentFont === font.value

          return (
            <DropdownMenuItem
              key={font.value}
              onClick={() => {
                editor
                  ?.chain()
                  .focus()
                  .setMark("textStyle", { fontFamily: font.value })
                  .run()
              }}
              className={cn(
                "flex items-center justify-between px-2 py-1.5 rounded-sm cursor-pointer",
                "hover:bg-neutral-100",
                isActive && "bg-neutral-100"
              )}
            >
              <span style={{ fontFamily: font.value }}>
                {font.label}
              </span>

              {isActive && (
                <span className="text-xs text-neutral-500">✓</span>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

//////////////////////////////////////////
// FONT SIZE // currently not working ADD CUSTOM EXTENSION
//////////////////////////////////////////

const FontSizeButton = () => {
  const { editor } = useEditorStore()

  const sizes = ["12px", "14px", "16px", "18px", "24px"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-2 h-7 rounded-sm hover:bg-neutral-200/80 text-sm">
          16 ▾
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white border shadow-md p-1">
        {sizes.map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .setMark("textStyle", { fontSize: size })
                .run()
            }
          >
            {size}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

//////////////////////////////////////////
// HEADING BUTTONS
//////////////////////////////////////////

const HeadingButtons = () => {
  const { editor } = useEditorStore()

  return (
    <div className="flex items-center gap-x-0.5">
      <ToolbarButton
        icon={Heading1}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        icon={Heading2}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={Heading3}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
      />
    </div>
  )
}

//////////////////////////////////////////
// COLOR
//////////////////////////////////////////

const ColorButtons = () => {
  const { editor } = useEditorStore()

  const colors = ["#000000", "#ef4444", "#22c55e", "#3b82f6", "#eab308"]

  return (
    <div className="flex items-center gap-x-0.5">
      {/* Text Color */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80">
            <Palette className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-2 flex gap-1 bg-white border shadow-md">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() =>
                editor?.chain().focus().setColor(color).run()
              }
              className="w-5 h-5 rounded-sm border"
              style={{ backgroundColor: color }}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
       {/* Highlight 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80">
            <Highlighter className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-2 flex gap-1 bg-white border shadow-md">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .setHighlight({ color })
                  .run()
              }
              className="w-5 h-5 rounded-sm border"
              style={{ backgroundColor: color }}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>*/}
    </div>
  )
}

//////////////////////////////////////////
// BASE BUTTON
//////////////////////////////////////////

interface ToolbarButtonProps {
  onClick?: () => void
  isActive?: boolean
  icon: LucideIcon
  disabled?: boolean
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
  disabled,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm transition-colors",
        "hover:bg-neutral-200/80",
        isActive && "bg-neutral-200/80",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
      )}
    >
      <Icon className="size-4" />
    </button>
  )
}

//////////////////////////////////////////
// MAIN
//////////////////////////////////////////

export const Toolbar = () => {
  const { editor } = useEditorStore()

  const sections: {
    label: string
    icon: LucideIcon
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
  }[][] = [
    // System
    [
      {
        label: "Undo",
        icon: Undo2,
        onClick: () => editor?.chain().focus().undo().run(),
        disabled: !editor?.can().undo(),
      },
      {
        label: "Redo",
        icon: Redo2,
        onClick: () => editor?.chain().focus().redo().run(),
        disabled: !editor?.can().redo(),
      },
      {
        label: "Spellcheck",
        icon: SpellCheck,
        onClick: () => {
          const el = document.querySelector(".tiptap")
          const current = el?.getAttribute("spellcheck") === "true"
          el?.setAttribute("spellcheck", (!current).toString())
        },
      },
      {
        label: "Print",
        icon: Printer,
        onClick: () => window.print(),
      },
    ],

    // Inline
    [
      {
        label: "Bold",
        icon: Bold,
        onClick: () => editor?.chain().focus().toggleBold().run(),
        isActive: editor?.isActive("bold"),
      },
      {
        label: "Italic",
        icon: Italic,
        onClick: () => editor?.chain().focus().toggleItalic().run(),
        isActive: editor?.isActive("italic"),
      },
      {
        label: "Underline",
        icon: Underline,
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
        isActive: editor?.isActive("underline"),
      },
      {
        label: "Bullet",
        icon: List,
        onClick: () => editor?.chain().focus().toggleBulletList().run(),
      },
      {
        label: "Ordered",
        icon: ListOrdered,
        onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      },
      {
        label: "Task",
        icon: CheckSquare,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
      },
    ],

    /* Collaboration
    [
      {
        label: "Comment",
        icon: MessageSquarePlus,
        onClick: () => console.log("Comment clicked"),
      },
      {
        label: "Link",
        icon: Link2,
        onClick: () => {
          const url = prompt("Enter URL")
          if (url) editor?.chain().focus().setLink({ href: url }).run()
        },
      },
    ],*/
  ]

  return (
    <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-1 overflow-x-auto">
      {sections.map((group, i) => (
        <div key={i} className="flex items-center gap-x-0.5">
          {group.map((item) => (
            <ToolbarButton key={item.label} {...item} />
          ))}

          {i !== sections.length - 1 && (
            <Separator orientation="vertical" className="h-6 bg-neutral-300 mx-1" />
          )}
        </div>
      ))}

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FrontFamilyButton />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontSizeButton />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <HeadingButtons />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <ColorButtons />
    </div>
  )
}