"use client";

import React from "react";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import FFLDropdownMenu from "./FFLDropdownMenu";

const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <header className="bg-neutral flex h-16 w-full items-center justify-between border">
      <div>
        <h2 className="">Fantasy Five</h2>
      </div>
      <nav className="flex items-center">
        <FFLDropdownMenu />
        <DropdownMenu>
          <DropdownMenuTrigger>FFL</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My League</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item</DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/"}>test</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="p-2">
          {isSignedIn ? (
            <span data-testid="user-button">
              <UserButton />
            </span>
          ) : (
            <span data-testid="signin-button">
              <SignInButton />
            </span>
          )}
        </span>
      </nav>
    </header>
  );
};

export default Navbar;
