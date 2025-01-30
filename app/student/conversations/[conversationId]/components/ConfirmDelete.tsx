// "use client";

// import { useState, useCallback } from "react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import Button from "@/app/teacher/chats/components/Button";
// import useConversation from "@/app/teacher/hooks/useConversation";
// import { useRouter } from "next/navigation";
// // import toast from "react-hot-toast";

// import { Trash2, TriangleAlert } from "lucide-react";
// import StandardErrorToast from "@/app/extras/StandardErrorToast";
// import TeacherServices from "@/app/Services/TeacherServices";

// const ConfirmDelete = () => {
//   const { conversationId } = useConversation();

//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const onDelete = useCallback(() => {
//     // setIsLoading(true);
//     // axios
//     //   .delete(`/chats/conversations/${conversationId}`)
//     //   .then(() => {
//     //     router.push("/chats/conversations");
//     //     router.refresh();
//     //   })
//     //   .catch(() => {
//     //     StandardErrorToast("Something went wrong while deleting conversation");
//     //   });
//     // setIsLoading(false);

//     const deleteConversation = async () => {
//       try {
//         setIsLoading(true);
//         const res = await TeacherServices.deleteTeacherConversation(
//           conversationId
//         );

//         if (!res.status) {
//           return null;
//         }

//         router.push("/teacher/chats");
//         router.refresh();
//       } catch (error) {
//         StandardErrorToast("Something went wrong while deleting conversation");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     deleteConversation();
//   }, [conversationId, router, StandardErrorToast]);

//   return (
//     <div>
//       <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <DialogTrigger asChild>
//           <button
//             onClick={() => setIsDeleteOpen(true)}
//             className="w-10 h-10 bg-neutral-100 dark:bg-violet-800 rounded-full flex items-center justify-center"
//           >
//             <Trash2 size={20} />
//           </button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               <div className="flex gap-1 items-center">
//                 <div className="mx-auto flex justify-center items-center h-12 w-12 flex-shrink-0 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                   <TriangleAlert className="h-6 w-6 text-red-600" />
//                 </div>
//                 <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
//                   Delete conversation?
//                 </div>
//               </div>
//             </DialogTitle>

//             <div className="ml-14">
//               Are you sure you want to delete this conversation? This action
//               cannot be undone.
//             </div>
//             <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
//               <Button danger disabled={isLoading} onClick={onDelete}>
//                 Delete
//               </Button>
//               <Button
//                 secondary
//                 disabled={isLoading}
//                 onClick={() => setIsDeleteOpen(false)}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ConfirmDelete;

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Trash2, TriangleAlert } from "lucide-react";
// import StandardErrorToast from "@/app/extras/StandardErrorToast";

import useConversation from "@/app/student/hooks/useConversation";
import StudentServices from "@/app/Services/StudentServices";

const ConfirmDelete = () => {
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDelete = useCallback(() => {
    const deleteConversation = async () => {
      try {
        setIsLoading(true);
        const res = await StudentServices.deleteStudentConversation(
          conversationId
        );

        if (!res.status) {
          return null;
        }

        router.push("/student/chats");
        router.refresh();
      } catch (error) {
        // StandardErrorToast("Something went wrong while deleting conversation");
      } finally {
        setIsLoading(false);
      }
    };

    deleteConversation();
  }, [conversationId, router]);

  return (
    <div>
      <Button
        onClick={onOpen}
        w="14" // Increase width
        h="14" // Increase height
        bg="neutral.100"
        _dark={{ bg: "violet.800" }}
        rounded="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Trash2 size={20} /> {/* Adjust the icon size if necessary */}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="flex gap-1 items-center">
              <div className="mx-auto flex justify-center items-center h-12 w-12 flex-shrink-0 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <TriangleAlert className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                Delete conversation?
              </div>
            </div>
          </ModalHeader>

          <ModalBody>
            <div className="ml-14 ">
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </div>
          </ModalBody>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse mb-2 p-5">
            <Button
              colorScheme="red"
              isLoading={isLoading}
              onClick={onDelete}
              mr={3}
            >
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
          </div>

          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ConfirmDelete;
