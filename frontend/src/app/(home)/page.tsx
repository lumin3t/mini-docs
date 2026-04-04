import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Document from "@/models/Document"; 
import { connectToDatabase } from "@/lib/mongodb";

import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
import { DocumentTable } from "./document-table";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let documents = [];

  if (session?.user?.email) {
    await connectToDatabase();
    
    // We query for documents where the user is the owner.
    // (If you want to see docs shared with your Org, you'd add the $or query here)
    const docs = await Document.find({ 
      ownerId: session.user.email 
    })
    .sort({ updatedAt: -1 })
    .lean();

    // Map MongoDB objects to plain JSON for the client
    documents = docs.map((doc: any) => ({
      _id: doc._id.toString(),
      title: doc.title,
      ownerId: doc.ownerId,
      // FIX: Passing the organizationId so DocumentTable can see it!
      organizationId: doc.organizationId ?? null, 
      updatedAt: doc.updatedAt.toISOString(),
    }));
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFD]">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b flex items-center px-4">
        <Navbar />
      </div>
      
      <main className="flex-grow mt-16">
        {/* Template Section */}
        <section className="bg-[#F1F3F4] border-b">
          <TemplatesGallery />
        </section>
        
        {/* Document List Section */}
        <section className="container mx-auto">
          <DocumentTable documents={documents} />
        </section>
      </main>
    </div>
  );
}