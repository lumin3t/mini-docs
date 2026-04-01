import { Editor } from "./editor";

interface DocumentIdPageProps {
    params: Promise<{ documentId: string }>;
};

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;

  return (
    <div>
      <h1>Document ID:</h1>
      <p>{documentId}</p>
      <Editor />
    </div>
  );
};

export default DocumentIdPage;
