"use client";

import Link from "next/link";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function FFLDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="dark:text-stone-200">FFL</DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/ffl">
          <DropdownMenuItem>Home</DropdownMenuItem>
        </Link>
        <DropdownMenuLabel>Leagues</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/ffl/league/join">
          <DropdownMenuItem>Join</DropdownMenuItem>
        </Link>
        <Link href="/ffl/league/create">
          <DropdownMenuItem>Create</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="transition-all dark:text-stone-200">FFL</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-36 flex-col p-2">
              <li>
                <NavigationMenuLink asChild className="py-1 text-lg font-semibold">
                  <Link href={"/ffl"}>Home</Link>
                </NavigationMenuLink>
              </li>
              <hr className="py-1" />
              <li className="">
                <NavigationMenuLink asChild className={""}>
                  <Link href={"/ffl/league/create"}>Create a league</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href={"/ffl/league/join"}>Join a league</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu> */
