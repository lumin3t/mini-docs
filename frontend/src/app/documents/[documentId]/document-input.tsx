"use client";

import { useState, useEffect } from "react";
import { BsCloudCheck } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { useParams } from "next/navigation";

export const DocumentInput = () => {
  const params = useParams();
  const documentId = params.documentId as string;
  
  // 1. Get the title from your store (or local state if store isn't ready)
  // Assuming your store has { title, setTitle }
  const { editor } = useEditorStore();
  const [title, setTitle] = useState("Untitled Document");
  const [isEditing, setIsEditing] = useState(false);

  // 2. Fetch the initial title from the DB when the page loads
  useEffect(() => {
    const fetchTitle = async () => {
      if (!documentId) return;
      const response = await fetch(`/api/documents/${documentId}`);
      const data = await response.json();
      if (data.title) setTitle(data.title);
    };
    fetchTitle();
  }, [documentId]);

  const handleUpdate = async (newTitle: string) => {
    setTitle(newTitle);
    setIsEditing(false);

    // 3. Sync the new name to MongoDB
    await fetch(`/api/documents/${documentId}`, {
      method: "PATCH",
      body: JSON.stringify({ title: newTitle }),
    });
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleUpdate(title)}
          onKeyDown={(e) => e.key === "Enter" && handleUpdate(title)}
          autoFocus
          className="text-lg px-1.5 bg-transparent border-none outline-none focus:bg-white rounded-sm"
        />
      ) : (
        <span 
          onClick={() => setIsEditing(true)}
          className="text-lg px-1.5 cursor-pointer truncate hover:bg-gray-100 rounded-sm transition"
        >
          {title}
        </span>
      )}
      <BsCloudCheck className="text-gray-500 size-4" />
    </div>
  );
};