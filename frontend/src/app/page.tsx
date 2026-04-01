 import Link from 'next/link';
 
 const Home = () => {
  return (
    <div>
      <h1>Welcome to My GDocs</h1>
      <Link href="/documents/page">Go to Documents</Link>
    </div>
  );
};

export default Home;
