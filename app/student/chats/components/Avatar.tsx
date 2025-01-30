"use client";

// import {
//   Avatar as AvatarShadcn,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";

import { Avatar as ChakraAvatar } from "@chakra-ui/react";

import useActiveList from "../../hooks/useActiveList";
import { Student } from "@/app/interfaces/StudentInterface";

interface Props {
  student: Student;
}

const Avatar = ({ student }: Props) => {
  const { members } = useActiveList();

  const isActive = members.indexOf(student.email) !== -1;

  // to display the initials as avatar
  const getInitials = () => {
    if (!student?.firstName || !student?.lastName) {
      return "";
    }

    const firstName = student.firstName;
    const lastName = student.lastName;
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  return (
    <div className="relative">
      <div className="relative inline-block rounded-full h-9 w-9 md:h-11 md:w-11">
        <ChakraAvatar
          name={`${student?.firstName} ${student?.lastName}`} // Automatically generates initials from the name
          src={student?.profileImg ?? undefined} // Fallback to placeholder image if no profile image
          bg="gray.200" // Fallback background color
          color="gray.500" // Fallback text color for initials
        />

        {isActive && (
          <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-3 w-3 md:h-3 md:w-3" />
        )}
      </div>
    </div>
  );
};

export default Avatar;
