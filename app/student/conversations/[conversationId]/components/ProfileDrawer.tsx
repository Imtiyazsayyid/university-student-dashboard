"use client";

import useOtherUser from "@/app/student/hooks/useOtherUser";
import { format } from "date-fns";
import { useMemo, useState } from "react";

// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Box,
  Text,
  Divider,
} from "@chakra-ui/react";

import { Ellipsis } from "lucide-react";
import Avatar from "@/app/student/chats/components/Avatar";
import ConfirmDelete from "./ConfirmDelete";
import AvatarGroup from "@/app/student/chats/components/AvatarGroup";
import useActiveList from "@/app/student/hooks/useActiveList";
import { StudentConversation } from "@/app/interfaces/ChatInterface";
import { Student } from "@/app/interfaces/StudentInterface";

interface Props {
  conversation: StudentConversation & {
    students: Student[];
  };
}

const ProfileDrawer = ({ conversation }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const otherUser = useOtherUser(conversation);

  const { members } = useActiveList();

  const isActive = members.indexOf(otherUser.email) !== -1;

  const joinedDate = useMemo(() => {
    if (!otherUser?.created_at) return "N/A";
    return format(new Date(otherUser.created_at), "PP");
  }, [otherUser.created_at]);

  const title = useMemo(() => {
    return conversation.name || otherUser.firstName + " " + otherUser.lastName;
  }, [conversation.name, otherUser.firstName, otherUser.lastName]);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `Group has ${conversation.students.length} participants`;
    }
    return isActive ? "Available" : "Offline";
  }, [conversation, isActive]);

  const usersEmail = conversation.students.map((student) => student.email);

  // return (
  //   <>
  //     <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
  //       <SheetTrigger>
  //         <Ellipsis
  //           size={32}
  //           className="text-violet-500 cursor-pointer hover:text-violet-800 transition"
  //         />
  //       </SheetTrigger>

  //       <SheetContent>
  //           <div className="relative mt-14 flex-1 px-4 sm:px-6">
  //             <div className="flex flex-col items-center">
  //               <div className="mb-2">
  //                 {conversation.isGroup ? (
  //                   <AvatarGroup students={conversation.students} />
  //                 ) : (
  //                   <Avatar student={otherUser} />
  //                 )}
  //               </div>
  //               <div>{title}</div>
  //               <div className="text-sm text-gray-500">{statusText}</div>

  //               <div className="flex flex-col gap-4 my-8">
  //                 <div className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
  //                   <ConfirmDelete />
  //                 </div>

  //                 <div className="dark:text-white text-sm font-light text-neutral-600">
  //                   Delete {conversation.isGroup ? "Group" : "Chat"}
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
  //               <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
  //                 {conversation.isGroup && (
  //                   <div>
  //                     <dt className="dark:text-gray-400 text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
  //                       Emails
  //                     </dt>
  //                     <div className="flex flex-col">
  //                       {usersEmail.map((email) => (
  //                         <dd
  //                           key={email}
  //                           className="dark:text-white mt-1 text-sm text-gray-900 sm:col-span-2"
  //                         >
  //                           {email}
  //                         </dd>
  //                       ))}
  //                     </div>
  //                   </div>
  //                 )}
  //                 {!conversation.isGroup && (
  //                   <div>
  //                     <dt className="dark:text-gray-400 text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
  //                       Email
  //                     </dt>
  //                     <dd className="dark:text-white mt-1 text-sm text-gray-900 sm:col-span-2">
  //                       {otherUser.email}
  //                     </dd>
  //                   </div>
  //                 )}
  //                 {!conversation.isGroup && (
  //                   <>
  //                     <hr />
  //                     <div>
  //                       <dt className="dark:text-gray-400 text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
  //                         Joined
  //                       </dt>
  //                       <dd className="dark:text-white mt-1 text-sm text-gray-900 sm:col-span-2">
  //                         {joinedDate}
  //                       </dd>
  //                     </div>
  //                   </>
  //                 )}
  //               </dl>
  //             </div>
  //           </div>
  //       </SheetContent>
  //     </Sheet>
  //   </>
  // );


  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setDrawerOpen(true)}
        variant="ghost"
        w="auto"
        p="0"
      >
        <Ellipsis
          size={32}
          className="text-pink-500 cursor-pointer hover:text-pink-800 transition"
        />
      </Button>

      {/* Drawer Component */}
      <Drawer
        isOpen={drawerOpen}
        placement="right"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {/* <DrawerHeader>{title}</DrawerHeader> */}
          <DrawerBody>
            <Box className="relative mt-14 flex-1 px-4 sm:px-6">
              {/* Header Section */}
              <Box className="flex flex-col items-center">
                <Box className="mb-2">
                  {conversation.isGroup ? (
                    <AvatarGroup students={conversation.students} />
                  ) : (
                    <Avatar student={otherUser} />
                  )}
                </Box>
                <Text fontSize="lg" fontWeight="bold">
                  {title}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {statusText}
                </Text>

                {/* Actions */}
                <Box className="flex flex-col gap-4 my-8">
                  <Box
                    className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75"
                  >
                    <ConfirmDelete />
                  </Box>
                  <Text
                    fontSize="sm"
                    fontWeight="light"
                    color="gray.600"
                    _dark={{ color: "white" }}
                  >
                    Delete {conversation.isGroup ? "Group" : "Chat"}
                  </Text>
                </Box>
              </Box>

              {/* Details Section */}
              <Box className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                <Box as="dl" className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                  {conversation.isGroup && (
                    <Box>
                      <Text
                        as="dt"
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.500"
                        _dark={{ color: "gray.400" }}
                      >
                        Emails
                      </Text>
                      <Box className="flex flex-col">
                        {usersEmail.map((email) => (
                          <Text
                            as="dd"
                            key={email}
                            mt="1"
                            fontSize="sm"
                            color="gray.900"
                            _dark={{ color: "white" }}
                          >
                            {email}
                          </Text>
                        ))}
                      </Box>
                    </Box>
                  )}
                  {!conversation.isGroup && (
                    <Box>
                      <Text
                        as="dt"
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.500"
                        _dark={{ color: "gray.400" }}
                      >
                        Email
                      </Text>
                      <Text
                        as="dd"
                        mt="1"
                        fontSize="sm"
                        color="gray.900"
                        _dark={{ color: "white" }}
                      >
                        {otherUser.email}
                      </Text>
                    </Box>
                  )}
                  {!conversation.isGroup && (
                    <>
                      <Divider my="4" />
                      <Box>
                        <Text
                          as="dt"
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.500"
                          _dark={{ color: "gray.400" }}
                        >
                          Joined
                        </Text>
                        <Text
                          as="dd"
                          mt="1"
                          fontSize="sm"
                          color="gray.900"
                          _dark={{ color: "white" }}
                        >
                          {joinedDate}
                        </Text>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProfileDrawer;
