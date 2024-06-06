"use client";

import React, { useState } from "react";
import { deleteOutgoingRequest, type fetchOutgoingRequests } from "~/app/_actions";
import { motion, AnimatePresence } from "framer-motion";

type Invite = Awaited<ReturnType<typeof fetchOutgoingRequests>>[number];

type PageProps = {
  invite: Invite;
};

const exitVariants = {
  hidden: { opacity: 0, scale: 0.9, x: -20, rotate: 10 },
  visible: { opacity: 1, scale: 1, x: 0, rotate: 0 },
};

export default function DeleteRequestButton({ invite }: PageProps) {
  const { league, id } = invite;
  const [isVisible, setIsVisible] = useState(true);

  const handleDelete = async () => {
    setIsVisible(!isVisible);
    //await deleteOutgoingRequest(id);
  };

  return (
    <AnimatePresence>
      <p>Your outstanding requests</p>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0.8,
            transition: { duration: 1, ease: "backOut" },
          }}
          /* exit={{ opacity: 0, y: -100 }}
          transition={{ ease: "easeOut", duration: 0.7 }} */
          key={id}
          className="flex w-72 justify-between"
        >
          <span>{league?.name ?? "no league name"}</span>
          <button onClick={handleDelete}>Delete</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
