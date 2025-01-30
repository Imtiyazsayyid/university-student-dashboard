"use client";

import clsx from "clsx";
import useConversation from "../hooks/useConversation";
import EmptyState from "../chats/components/EmptyState";

const ConversationsPage = () => {
  const { isOpen } = useConversation();

  return (
    <div
      className={clsx("dark:bg-[#111] dark:text-white h-full lg:pl-80  lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default ConversationsPage;
