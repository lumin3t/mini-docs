"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation";
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
  /*Type,*/
  Bold,
  Italic,
  Underline,
  Share2,
} from "lucide-react"

import { useEditorStore } from "@/store/use-editor-store"

interface MenuBarProps {
  documentId: string;
}

const MenuBar = ({ documentId }: MenuBarProps) => {
  const { editor } = useEditorStore()
  const router = useRouter();

  const onShareToOrg = async () => {

  if (!documentId) {
      console.error("Document ID is missing");
      return;
    }

    const orgId = window.prompt("Enter Organization ID to share this document:");
    
    if (orgId) {
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          method: "PATCH",
          body: JSON.stringify({ organizationId: orgId }),
        });

        if (response.ok) {
          alert(`Document successfully shared with Organization: ${orgId}`);
          router.refresh();
        } else {
          alert("Failed to share document.");
        }
      } catch (error) {
        console.error("Sharing error:", error);
      }
    }
  };

  return (
    <div className="flex">
      <Menubar className="border-none bg-transparent shadow-none h-auto p-0 flex gap-1 print:hidden">
        {/* FILE */}
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 text-sm hover:bg-gray-100 rounded-sm transition">File</MenubarTrigger>
          <MenubarContent className="print:hidden bg-white border shadow-md min-w-[220px]">
            <MenubarItem onClick={() => window.location.reload()}>
              <FilePlus className="size-4 mr-2" />
              New
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem onClick={onShareToOrg}>
              <Share2 className="size-4 mr-2" />
              Share to Organization
            </MenubarItem>

            <MenubarSeparator />

            <MenubarSub>
              <MenubarSubTrigger className="flex items-center gap-2">
                <Save className="size-4" />
                Save
              </MenubarSubTrigger>
              <MenubarContent className="bg-white border shadow-md">
                <MenubarItem
                  onClick={() => {
                    if (!editor) return;
                    const content = editor.getText();
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "document.txt";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Save as TXT
                  <MenubarShortcut>⌘S</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={() => window.print()}>
                  Save as PDF
                  <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>

        {/* EDIT */}
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 text-sm">Edit</MenubarTrigger>
          <MenubarContent className="bg-white border shadow-md min-w-[220px]">
            <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
              <Undo2 className="size-4 mr-2" />
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
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
            <MenubarItem onClick={() => {
              const url = prompt("Enter image URL")
              if (url) editor?.chain().focus().setImage({ src: url }).run()
            }}>
              <ImageIcon className="size-4 mr-2" />
              Image
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger className="flex items-center gap-2">
                <TableIcon className="size-4" />
                Table
              </MenubarSubTrigger>
              <MenubarContent className="bg-white border shadow-md min-w-[200px]">
                <MenubarItem onClick={() => editor?.chain().focus().insertTable({ rows: 1, cols: 1 }).run()}>1 × 1</MenubarItem>
                <MenubarItem onClick={() => editor?.chain().focus().insertTable({ rows: 2, cols: 2 }).run()}>2 × 2</MenubarItem>
                <MenubarItem onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>3 × 3</MenubarItem>
              </MenubarContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>

        {/* FORMAT */}
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 text-sm">Format</MenubarTrigger>
          <MenubarContent className="bg-white border shadow-md min-w-[220px]">
            <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
              <Bold className="size-4 mr-2" />
              Bold
              <MenubarShortcut>⌘B</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
              <Italic className="size-4 mr-2" />
              Italic
              <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
              <Underline className="size-4 mr-2" />
              Underline
              <MenubarShortcut>⌘U</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export const Navbar = () => {
  const params = useParams();
  const documentId = params.documentId as string;

  
  return (
    <nav className="flex items-center justify-between px-4 py-2 border-b">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        </Link>
        <div className="flex flex-col">
          <DocumentInput />
          {/* Passed documentId here */}
          <MenuBar documentId={documentId} />
        </div>
      </div>
    </nav>
  )
}