"use client";

import useConversation from "../../hooks/useConversation";
import { FullConversationType } from "@/app/interfaces/ChatInterface";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ConversationBox from "./ConversationBox";
import { Loader, UserPlus } from "lucide-react";
import GroupChatModal from "./GroupChatModal";
// import { useSession } from "next-auth/react";
// import { pusherClient } from "@/app/libs/pusher";

// import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Input } from "@chakra-ui/react";
import { Student } from "@/app/interfaces/StudentInterface";
import StudentServices from "@/app/Services/StudentServices";
import { Tooltip } from "@chakra-ui/react";
import useStudentDetails from "../../hooks/useStudentDetails";
import { find } from "lodash";

const ConversationList = () => {
  const [conversations, setConversations] = useState<FullConversationType[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();
  const [filters, setFilters] = useState({
    searchText: "",
  });
  const currentStudent = useStudentDetails();

  const getAllStudents = async () => {
    try {
      setLoading(true);
      const res = await StudentServices.getStudentsList();

      if (!res.data?.status) {
        // StandardErrorToast();
        return [];
      }

      setStudents(res.data.data || []);
    } catch (error) {
      console.log("Error fetching Teachers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  const getConversations = async () => {
    try {
      setLoading(true);
      const res = await StudentServices.getStudentConversations({ ...filters });

      if (!res.data?.status) {
        // StandardErrorToast();
        return;
      }

      setConversations(res.data.data || []);
    } catch (error) {
      console.log("Error fetching getTeacherConversations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConversations();
  }, [filters]);

  // Pusher

  // const pusherKey = useMemo(() => {
  //   return currentStudent?.email;
  // }, [currentStudent?.email]);

  // useEffect(() => {
  //   if (!pusherKey) {
  //     return;
  //   }

  //   pusherClient.subscribe(pusherKey);

  //   // this adds new conversation in real time
  //   const newConversationHandler = (newConversation: FullConversationType) => {
  //     setConversations((current) => {
  //       if (find(current, { id: newConversation.id })) {
  //         return current;
  //       }

  //       return [newConversation, ...current];
  //     });
  //   };

  //   // this updates the lastmessage in real time
  //   const updateConversationHandler = (conversation: FullConversationType) => {
  //     setConversations((current) =>
  //       current.map((currentConversation) => {
  //         if (currentConversation.id === conversation.id) {
  //           return {
  //             ...currentConversation,
  //             messages: conversation.messages,
  //           };
  //         }

  //         return currentConversation;
  //       })
  //     );
  //   };

  //   const removeConversationHandler = (conversation: FullConversationType) => {
  //     setConversations((current) => {
  //       return [...current.filter((convo) => convo.id !== conversation.id)];
  //     });

  //     if (conversationId === conversation.id) {
  //       router.push("/student/conversations");
  //     }
  //   };

  //   pusherClient.bind("student:conversation:new", newConversationHandler);
  //   pusherClient.bind("student:conversation:update", updateConversationHandler);
  //   pusherClient.bind("student:conversation:remove", removeConversationHandler);

  //   return () => {
  //     pusherClient.unsubscribe(pusherKey);
  //     pusherClient.unbind("student:conversation:new", newConversationHandler);
  //     pusherClient.unbind("student:conversation:update", updateConversationHandler);
  //     pusherClient.unbind("student:conversation:remove", removeConversationHandler);
  //   };
  // }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        students={students}
      />
      {/* for responsive mobile */}
      {/* fixed inset-y-0 pb-20 lg:pb-0 lg:left-24 lg:pl-0 lg:top-[98px] lg:w-80 lg:h-[720px] lg:block overflow-y-auto border-r border-gray-200 dark:border-gray-800 */}
      {/* for computer */}
      {/* fixed w-[320px] lg:h-[700px] overflow-y-auto border-r */}
      <aside
        className={clsx(
          "fixed h-full w-full p-2 lg:w-[325px] xl:w-[335px] xl:left-96 overflow-y-auto border-r dark:bg-[#111] bg-white",
          isOpen ? "hidden lg:block" : "block left-0"
          // isOpen ? "hidden" : "block left-0" // for mobile responsive (uncomment)
          // isOpen ? "hidden" : "fixed md:w-[420px] md:right-0 overflow-y-auto border-r md:h-full"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between items-center mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800 dark:text-white">
              Messages
            </div>
            <Tooltip label="Create Group Chat" hasArrow placement="end">
              <div
                onClick={() => setIsModalOpen(true)}
                className="dark:text-stone-600 rounded-full p-3 bg-gray-200 hover:bg-pink-100 cursor-pointer hover:opacity-90"
              >
                <UserPlus size={20} className="text-pink-500" />
              </div>
            </Tooltip>
          </div>
          <div className="flex items-center w-full border mb-5 p-1 rounded-lg">
            {/* <Input
              type="text"
              placeholder="Search group chats"
              className="flex-1 border-none"
              value={filters.searchText}
              onChange={(e) =>
                setFilters({ ...filters, searchText: e.target.value })
              }
            /> */}

            <Input
              type="text"
              placeholder="Search group chats"
              value={filters.searchText}
              onChange={(e) =>
                setFilters({ ...filters, searchText: e.target.value })
              }
              variant="styled" // Removes the border to match the className "border-none"
              width="100%" // Makes it fill the parent container, similar to "flex-1"
              className="focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
          {loading ? (
            <div className="flex justify-center items-center text-lg font-bold gap-4">
              <Loader size={20} className="animate-spin" /> Loading Users...
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationBox
                key={conversation.id}
                conversation={conversation}
                selected={conversationId === conversation.id}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
