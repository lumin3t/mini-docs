import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";

export const Navbar = () => {
  return (
    <nav className="flex iterms-center justify-between h-full w-full">
        <div className="flex gap-3 iterms-center shrink-0 pr-6">
            <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            </Link>
            <h3 className="text-xl">Docs</h3>
        </div>
        <SearchInput />
    </nav>
  );
};
