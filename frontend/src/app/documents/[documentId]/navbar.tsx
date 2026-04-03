"use client"

import Image from "next/image"
import Link from "next/link"
import { DocumentInput } from "./document-input"

import {
  Menubar,
  MenubarMenu,
  MenubarContent,
  MenubarItem,
  MenubarTrigger,
  MenubarShortcut,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
} from "@/components/ui/menubar"

import {
  FilePlus,
  Save,
  Undo2,
  Redo2,
  ImageIcon,
  TableIcon,
  Type,
  Bold,
  Italic,
  Underline,
} from "lucide-react"

import { useEditorStore } from "@/store/use-editor-store"

//////////////////////////////////////////
// MENUBAR
//////////////////////////////////////////

const MenuBar = () => {
  const { editor } = useEditorStore()

  return (
    <div className="flex">
      <Menubar className="border-none bg-transparent shadow-none h-auto p-0 flex gap-1 print:hidden">

        {/* FILE */}
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 text-sm">File</MenubarTrigger>

          <MenubarContent className="print:hidden bg-white border shadow-md min-w-[220px]">

            <MenubarItem className="print:hidden" onClick={() => window.location.reload()}>
              <FilePlus className="size-4 mr-2" />
              New
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>

            {/* SAVE SUBMENU */}
            <MenubarSub>
              <MenubarSubTrigger className="print:hidden flex items-center gap-2">
                <Save className="size-4" />
                Save
              </MenubarSubTrigger>

              <MenubarContent className="print:hidden bg-white border shadow-md">

                <MenubarItem className="print:hidden"
                  onClick={() => {
                    const { editor } = useEditorStore.getState()
                    if (!editor) return

                    const content = editor.getText()
                    const blob = new Blob([content], {
                      type: "text/plain",
                    })

                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "document.txt"
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  Save as TXT
                  <MenubarShortcut>⌘S</MenubarShortcut>
                </MenubarItem>

                <MenubarItem className="print:hidden" onClick={() => window.print()}>
                  Save as PDF
                  <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>

              </MenubarContent>
            </MenubarSub>

            <MenubarSeparator />

          </MenubarContent>
        </MenubarMenu>

        {/* EDIT */}
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 text-sm">Edit</MenubarTrigger>

          <MenubarContent className="bg-white border shadow-md min-w-[220px]">

            <MenubarItem
              onClick={() => editor?.chain().focus().undo().run()}
            >
              <Undo2 className="size-4 mr-2" />
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>

            <MenubarItem
              onClick={() => editor?.chain().focus().redo().run()}
            >
              <Redo2 className="size-4 mr-2" />
              Redo
              <MenubarShortcut>⌘Y</MenubarShortcut>
            </MenubarItem>

          </MenubarContent>
        </MenubarMenu>

        {/* INSERT */}
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 text-sm">Insert</MenubarTrigger>

          <MenubarContent className="bg-white border shadow-md min-w-[220px]">

            <MenubarItem
              onClick={() => {
                const url = prompt("Enter image URL")
                if (url) editor?.chain().focus().setImage({ src: url }).run()
              }}
            >
              <ImageIcon className="size-4 mr-2" />
              Image
            </MenubarItem>

            {/* TABLE */}
            <MenubarSub>
              <MenubarSubTrigger className="flex items-center gap-2">
                <TableIcon className="size-4" />
                Table
              </MenubarSubTrigger>

              <MenubarContent className="bg-white border shadow-md min-w-[200px]">

                <MenubarItem
                  onClick={() =>
                    editor?.chain().focus().insertTable({ rows: 1, cols: 1, withHeaderRow: false }).run()
                  }
                >
                  1 × 1
                </MenubarItem>

                <MenubarItem
                  onClick={() =>
                    editor?.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: false }).run()
                  }
                >
                  2 × 2
                </MenubarItem>

                <MenubarItem
                  onClick={() =>
                    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                  }
                >
                  3 × 3
                </MenubarItem>

                <MenubarSeparator />

                <MenubarItem
                  onClick={() => {
                    const rows = Number(prompt("Enter number of rows"))
                    const cols = Number(prompt("Enter number of columns"))

                    if (!rows || !cols || rows <= 0 || cols <= 0) {
                      alert("Invalid size")
                      return
                    }

                    editor?.chain().focus().insertTable({
                      rows,
                      cols,
                      withHeaderRow: true,
                    }).run()
                  }}
                >
                  Custom size...
                </MenubarItem>

              </MenubarContent>
            </MenubarSub>

            {/* TEXT */}
            <MenubarSub>
              <MenubarSubTrigger className="flex items-center gap-2">
                <Type className="size-4" />
                Text
              </MenubarSubTrigger>

              <MenubarContent className="bg-white border shadow-md">

                <MenubarItem
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                >
                  Heading 1
                  <MenubarShortcut>⌘⌥1</MenubarShortcut>
                </MenubarItem>

                <MenubarItem
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                >
                  Heading 2
                  <MenubarShortcut>⌘⌥2</MenubarShortcut>
                </MenubarItem>

                <MenubarItem
                  onClick={() =>
                    editor?.chain().focus().setParagraph().run()
                  }
                >
                  Paragraph
                  <MenubarShortcut>⌘⌥0</MenubarShortcut>
                </MenubarItem>

              </MenubarContent>
            </MenubarSub>

          </MenubarContent>
        </MenubarMenu>

        {/* FORMAT */}
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 text-sm">Format</MenubarTrigger>

          <MenubarContent className="bg-white border shadow-md min-w-[220px]">

            <MenubarItem
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold className="size-4 mr-2" />
              Bold
              <MenubarShortcut>⌘B</MenubarShortcut>
            </MenubarItem>

            <MenubarItem
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic className="size-4 mr-2" />
              Italic
              <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>

            <MenubarItem
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
            >
              <Underline className="size-4 mr-2" />
              Underline
              <MenubarShortcut>⌘U</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

          </MenubarContent>
        </MenubarMenu>

      </Menubar>
    </div>
  )
}

//////////////////////////////////////////
// NAVBAR
//////////////////////////////////////////

export const Navbar = () => {
  //const { editor } = useEditorStore()

  /*const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const onSaveText = () => {
    if (!editor) return
    const content = editor.getText()
    const blob = new Blob([content], {
      type: "text/plain",
    })
    onDownload(blob, "document.txt")
  }*/

  return (
    <nav className="flex items-center justify-between px-4 py-2">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        </Link>

        <div className="flex flex-col">
          <DocumentInput />
          <MenuBar />
        </div>
      </div>
    </nav>
  )
}