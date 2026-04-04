import mongoose, { Schema, model, models } from "mongoose";

// 1. Define the Interface (Optional but highly recommended for TS)
export interface IDocument {
  title: string;
  content: Record<string, any>;
  ownerId: string;
  organizationId?: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Schema
const DocumentSchema = new Schema<IDocument>(
  {
    title: { 
      type: String, 
      default: "Untitled Document", 
      index: true 
    },
    content: { 
      type: Object, 
      default: {} 
    },
    ownerId: { 
      type: String, 
      required: true, 
      index: true 
    },
    organizationId: { 
      type: String, 
      default: "", 
      index: true 
    },
    roomId: { 
      type: String, 
      required: true 
    },
  },
  { 
    // This automatically handles createdAt and updatedAt for you!
    // No need for the .pre('save') hook anymore.
    timestamps: true 
  }
);

// 3. Add Indexes
DocumentSchema.index({ title: "text" });
DocumentSchema.index({ ownerId: 1, organizationId: 1 });

// 4. Export with the "Already exists" check
// This prevents the "OverwriteModelError" in Next.js development
const Document = models.Document || model<IDocument>("Document", DocumentSchema);

export default Document;