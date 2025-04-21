"use client";
import EmptyState from "../../chats/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import MessageForm from "./components/MessageForm";
import { useEffect, useState } from "react";
import {
  StudentConversation,
  FullMessageType,
} from "@/app/interfaces/ChatInterface";
import StudentServices from "@/app/Services/StudentServices";
import { Student } from "@/app/interfaces/StudentInterface";

interface Props {
  params: {
    conversationId: number;
  };
}

const ConversationIdPage = ({ params }: Props) => {
  const [conversation, setConversation] = useState<
    | (StudentConversation & {
        students: Student[];
      })
    | null
  >(null);
  const [messages, setMessages] = useState<FullMessageType[] | []>([]);

  const [lastMessageId, setLastMessageId] = useState<number | null>(
    messages.length > 0 ? messages[messages.length - 1].id : null
  );

  const getConversationById = async () => {
    try {
      const res = await StudentServices.getStudentConversationById(
        params.conversationId
      );

      if (!res.data?.status) {
        // StandardErrorToast();
        return null;
      }

      const { conversation, messages } = res.data.data;
      setConversation(conversation);
      setMessages(messages);
    } catch (error) {
      console.log("Error fetching conversation By id", error);
    }
  };

  useEffect(() => {
    getConversationById();
  }, []);

  const pollNewMessages = async () => {
    try {
      console.log("Polling with lastMessageId: ", lastMessageId);
      const res = await StudentServices.getNewStudentMessage(
        params.conversationId,
        lastMessageId
      );

      if (!res.data?.status) return;

      const newMessage: FullMessageType | null = res.data.data || null;

      console.log("Received messages: ", newMessage);

      if (newMessage) {
        if (newMessage) {
          setMessages((prev) => {
            // Prevent duplicate message appending
            const alreadyExists = prev.some((msg) => msg.id === newMessage.id);
            if (alreadyExists) return prev;
            return [...prev, newMessage];
          });

          setLastMessageId(newMessage.id);
        }
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  };

  useEffect(() => {
    if (!params.conversationId) return;

    const interval = setInterval(() => {
      pollNewMessages();
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, [params.conversationId, lastMessageId]);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-[750px] md:h-[933px] lg:h-[933px]">
      <div className="h-full flex flex-col dark:border-1 dark:rounded-sm">
        <Header conversation={conversation} />
        <Body initialMessages={messages!} />
        <MessageForm />
      </div>
    </div>
  );
};

export default ConversationIdPage;
