"use client";
import Avatar from "@/app/student/chats/components/Avatar";
import useOtherUser from "@/app/student/hooks/useOtherUser"; 
import Link from "next/link";
import React, { useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/student/chats/components/AvatarGroup";
import useActiveList from "@/app/student/hooks/useActiveList";
import { StudentConversation } from "@/app/interfaces/ChatInterface";
import { Student } from "@/app/interfaces/StudentInterface";

interface Props {
  conversation: StudentConversation & {
    students: Student[];
  };
}

const Header = ({ conversation }: Props) => {
  const otherUser = useOtherUser(conversation);
  const { members } = useActiveList();

  const isActive = members.indexOf(otherUser.email) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.students.length} participants`;
    }

    return isActive ? "Available" : "Offline";
  }, [conversation.isGroup, isActive, conversation.students.length]);

  return (
    <>
      <div className="dark:bg-[#151515] dark:border-x dark:border-t dark:rounded-sm bg-white w-full flex sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center text-pink-500 hover:text-pink-800">
          <Link
            href="/student/conversations"
            className="lg:hidden  cursor-pointer block transition"
          >
            <ChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup students={conversation.students} />
          ) : (
            <Avatar student={otherUser} />
          )}

          <div className="flex flex-col">
            <div className="dark:text-white text-black font-semibold">
              {conversation.name ||
                `${otherUser.firstName} ${otherUser.lastName}`}
            </div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <ProfileDrawer conversation={conversation} />
      </div>
    </>
  );
};

export default Header;
