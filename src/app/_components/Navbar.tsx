"use client";

import React from "react";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <header className="bg-neutral flex h-16 w-full items-center justify-between border">
      <div>
        <h2 className="">Fantasy Five</h2>
      </div>
      <nav>{isSignedIn ? <UserButton /> : <SignInButton />}</nav>
    </header>
  );
};

export default Navbar;
