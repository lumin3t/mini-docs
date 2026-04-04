import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import Document from "@/models/Document";

interface UpdateRequestBody {
  title?: string;
  content?: Record<string, any>;
}

// PATCH: Update document
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const body: UpdateRequestBody = await req.json();

    const updateData: Partial<UpdateRequestBody> = {};

    if (body.title !== undefined) updateData.title = body.title;

    if (body.content !== undefined) {
      // Ensure content isn't just an empty object if your frontend expects a schema
      updateData.content = 
        Object.keys(body.content).length > 0 
          ? body.content 
          : { type: "doc", content: [] };
    }

    const updated = await Document.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } // runValidators ensures schema logic is followed
    );

    if (!updated) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { error: "Update failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET: Fetch document by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    const { id } = await params;

    const doc = await Document.findById(id);

    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // OWNER → full access
    if (doc.ownerId === session?.user?.email) {
      return NextResponse.json(doc);
    }

    // SHARED DOC → allow access
    if (doc.organizationId) {
      return NextResponse.json(doc);
    }

    // ❌ otherwise deny
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Delete document
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedDoc = await Document.findByIdAndDelete(id);

    if (!deletedDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}