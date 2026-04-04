"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { 
  FileText,     
  MoreVertical, 
  ExternalLink, 
  Trash2, 
  Pencil,
  User2,
  Users2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export interface Document {
  _id: string;
  title: string;
  ownerId: string;
  organizationId?: string | null;
  updatedAt: string;
}

interface DocumentTableProps {
  documents: Document[];
}

export const DocumentTable = ({ documents }: DocumentTableProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const filteredDocuments = documents;

  const onDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this document?");
    if (confirmed) {
      await fetch(`/api/documents/${id}`, { method: "DELETE" });
      router.refresh();
    }
  };

  const onRename = async (id: string, currentTitle: string) => {
    const newTitle = prompt("Enter new title:", currentTitle);
    if (newTitle && newTitle !== currentTitle) {
      await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: newTitle }),
      });
      router.refresh();
    }
  };

  if (filteredDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-sm">No documents yet. Start by creating one!</p>
      </div>
    );
  }

  const isShared = (doc: Document): boolean => {
    return !!(doc.organizationId && doc.organizationId !== "null" && doc.organizationId !== "");
  };

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-xl font-medium mb-6 text-gray-900">Recent documents</h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3">Name</TableHead>
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3">Shared Status</TableHead>
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3">Last Opened</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map(doc => (
              <TableRow 
                key={doc._id} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <TableCell className="max-w-[400px] py-3">
                  <Link 
                    href={`/documents/${doc._id}`} 
                    className="flex items-center gap-3 text-gray-900 hover:text-blue-600 no-underline"
                  >
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium truncate hover:underline">{doc.title}</span>
                  </Link>
                </TableCell>

                <TableCell className="py-3">
                  {isShared(doc) ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium">
                      <Users2 className="h-3.5 w-3.5" />
                      <span>Shared</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium">
                      <User2 className="h-3.5 w-3.5" />
                      <span>Personal</span>
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-sm text-gray-500 py-3">
                  {format(new Date(doc.updatedAt), "MMM d, yyyy")}
                </TableCell>

                <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all outline-none">
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => window.open(`/documents/${doc._id}`, "_blank")}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>Open in new tab</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRename(doc._id, doc.title)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(doc._id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};