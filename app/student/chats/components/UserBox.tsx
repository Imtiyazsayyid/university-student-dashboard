"use client";
import { Student } from "@/app/interfaces/StudentInterface";
import LoadingModal from "./LoadingModal";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import useActiveList from "../../hooks/useActiveList";
// import StandardErrorToast from "@/app/extras/StandardErrorToast";
import useStudentDetails from "../../hooks/useStudentDetails";
import StudentServices from "@/app/Services/StudentServices";

interface Props {
  student: Student;
}

const UserBox = ({ student }: Props) => {
  const { members } = useActiveList();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // const handleClick = useCallback(() => {
  //   setIsLoading(true);
  //   console.log("Inside the click handler");
  //   axios
  //     .post("http://localhost:8003/api/teacher/conversations", {
  //       otherUser: user,
  //     })
  //     .then((data) => {
  //       router.push(`/conversations/${data.data.id}`);
  //     })
  //     .catch((error) => console.log("Error creating conversations: ", error))
  //     .finally(() => setIsLoading(false));
  // }, [user, router]);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const conversationData = { userId: student.id };

      const res = await StudentServices.createStudentConversation(
        conversationData
      );

      if (!res.data) {
        // StandardErrorToast();
        return;
      }
      console.log("res:", res);
      router.push(`/student/conversations/${res.data.data.id}`);
    } catch (error) {
      console.log("Error Creating conversation: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [student, router]);

  return (
    // <>
    //   {isLoading && <LoadingModal />}
    //   <div
    //     onClick={handleClick}
    //     className="w-full relative flex items-center space-x-4 dark:hover:bg-stone-900 dark:bg-violet-800 bg-white p-3 hover:bg-neutral-100 rounded-lg cursor-pointer transition"
    //   >
    //     <Avatar user={user} />

    //     <div className="min-w-0 flex-1 ">
    //       <div className="focus:outline-none">
    //         <div className="flex justify-between items-center mb-1">
    //           <p className="text-sm font-medium text-gray-900">
    //             {user.firstName} {user.lastName}
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>

    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition dark:bg-[#151515] text-white hover:bg-pink-200 hover:text-pink-950 "
      >
        <Avatar student={student} />

        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">
                {student.firstName} {student.lastName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
