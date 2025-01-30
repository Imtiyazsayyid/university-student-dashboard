"use client";

import { FullConversationType } from "@/app/interfaces/ChatInterface";
import { useMemo } from "react";
import useStudentDetails from "./useStudentDetails";
import { Student } from "@/app/interfaces/StudentInterface";

const useOtherUser = (
  conversation:
    | FullConversationType
    | {
        students: Student[];
      }
) => {
  const currentStudent = useStudentDetails();

  const otherUser = useMemo(() => {
    const currentUserEmail = currentStudent?.email;

    const otherUser = conversation.students.filter(
      (student) => student.email !== currentUserEmail
    );

    return otherUser[0];
  }, [currentStudent?.email, conversation.students]);

  return otherUser;
};

export default useOtherUser;
