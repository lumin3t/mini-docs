import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ensure this path is correct
import { connectToDatabase } from "@/lib/mongodb";
import Document from "@/models/Document";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic';

// GET: List all documents
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    // Optional: Filter by ownerId if you want users to only see their own docs
    const docs = await Document.find().sort({ updatedAt: -1 });
    return NextResponse.json(docs);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

// POST: Create document
export async function POST(req: Request) {
  try {
    console.log("POST /api/documents HIT");
    await connectToDatabase();
    
    // 1. Get actual session
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    console.log("BODY RECEIVED:", body);

    // 2. Fix Content Logic
    // If your frontend sends a string "<p></p>", Object.keys().length logic fails.
    // We check if it's a string OR a non-empty object.
    let finalContent = body.content;
    const isObject = typeof body.content === 'object' && body.content !== null;
    const isEmptyObject = isObject && Object.keys(body.content).length === 0;

    if (!body.content || isEmptyObject) {
      finalContent = { type: "doc", content: [] };
    }

    const newDoc = await Document.create({
      title: body.title || "Untitled Document",
      content: finalContent,
      // 3. Assign real user email so your GET [id] route doesn't return 403
      ownerId: session?.user?.email || "test-user",
      roomId: uuidv4(),
      organizationId: body.organizationId || "",
    });

    console.log("CREATED DOC SUCCESS:", newDoc._id);

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create document", details: String(error) },
      { status: 500 }
    );
  }
}