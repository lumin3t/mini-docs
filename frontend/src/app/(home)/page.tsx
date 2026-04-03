// import Link from 'next/link';
import { TemplatesGallery } from "./templates-gallery";
import { Navbar } from "./navbar";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="flex-grow mt-16"> {/* Added mt-16 for margin-top */}
        <TemplatesGallery />
      </div>
    </div>
  );
};

export default Home;
