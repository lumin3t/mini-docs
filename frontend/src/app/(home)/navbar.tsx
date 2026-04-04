"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, User, Mail } from "lucide-react"; // Modern icons

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between h-full w-full px-4 bg-white">
      {/* Left: Logo and title */}
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} className="hover:opacity-80 transition" />
        </Link>
        <h3 className="text-xl font-medium text-gray-700">Docs</h3>
      </div>

      {/* Center: Search bar */}
      <SearchInput />

      {/* Right: Profile / Auth buttons */}
      <div className="flex items-center gap-3 ml-4">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-gray-200 transition p-0.5 outline-none">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover border border-gray-100"
                  />
                ) : (
                  <div className="h-full w-full bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {session.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut()} 
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center whitespace-nowrap min-w-[100px] px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 hover:shadow-sm transition-all duration-200 active:scale-95"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};