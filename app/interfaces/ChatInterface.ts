import { Student } from "./StudentInterface";

export type StudentConversation = {
  id: number;
  name: string | null; // Optional for named/group conversations
  isGroup: boolean | null;

  created_at: Date;
  updated_at: Date;
  lastMessageAt: Date;

  students: Student[];
  messages: StudentMessage[];
};

export type StudentMessage = {
  id: number;
  body: string | null;
  image: string | null;
  file: string | null;

  created_at: Date;
  updated_at: Date;

  conversationId: number;
  conversation: StudentConversation;

  senderId: number;
  sender: Student;

  seen: Student[];
};

export type FullMessageType = StudentMessage & {
  sender: Student;
  seen: Student[];
};

export type FullConversationType = StudentConversation & {
  users: Student[];
  messages: FullMessageType[];
};
