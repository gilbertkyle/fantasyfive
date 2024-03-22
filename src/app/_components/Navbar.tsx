"use client";

import React from "react";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <header className="bg-neutral flex h-16 w-full items-center justify-between border">
      <div>
        <h2 className="">Fantasy Five</h2>
      </div>
      <nav className="flex items-center">
        <span className="p-2"><Link href={"/ffl"}>FFL</Link></span>
        <span className="p-2">{isSignedIn ? <UserButton /> : <SignInButton />}</span>
        
        </nav>
    </header>
  );
};

export default Navbar;
