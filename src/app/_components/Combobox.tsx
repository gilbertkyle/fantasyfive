"use client";

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const Combobox = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <Command>
      <CommandInput placeholder="search players..." />
      <CommandEmpty>No Players Found</CommandEmpty>
    </Command>
  );
};

export default Combobox;
