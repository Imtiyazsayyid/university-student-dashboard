"use client";

import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Heading,
  Text,
  useToast,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";
import { Event } from "@/app/interfaces/EventInterface";
import StudentServices from "@/app/Services/StudentServices";
import { useRouter } from "next/navigation";
import DueDateBadge from "@/app/components/DueDateBadge";
import { FaCheckCircle, FaPlay, FaRegClock } from "react-icons/fa";
import moment from "moment";
import { TbCalendarPlus, TbCalendarX } from "react-icons/tb";
import { useAtom } from "jotai";
import { studentDetails } from "@/app/store/Store";
import ProfileCard from "@/app/components/ProfileCard";
import { FaTrash } from "react-icons/fa6";

interface Props {
  params: {
    eventId: string;
  };
}

const EventDetailsPage = ({ params }: Props) => {
  const [event, setEvent] = useState<Event>();
  const [student] = useAtom(studentDetails);
  const router = useRouter();
  const toast = useToast();

  const getSingleEvent = async () => {
    try {
      const res = await StudentServices.getSingleEvent(params.eventId);
      if (res.data.status) {
        setEvent(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getParticipationStatus = () => {
    if (!event) return;

    const isStudentParticipating = event.eventParticipants.find((eo) => eo.studentId === student?.id);

    if (event.isCompleted) {
      return <></>;
    }

    if (isStudentParticipating) {
      return (
        <Badge
          colorScheme={"green"}
          rounded={"full"}
          pl={4}
          pr={4}
          py={2}
          className="w-fit"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
        >
          <FaCheckCircle className="mr-2 h-4 w-4" /> Registered
        </Badge>
      );
    } else {
      const now = moment();
      if (now.isAfter(moment(event.finalRegistrationDate))) {
        return (
          <Badge
            colorScheme={"red"}
            rounded={"full"}
            pl={4}
            py={2}
            pr={4}
            display={"flex"}
            alignItems={"center"}
            className="w-fit"
            cursor={"pointer"}
            onClick={(e) => {
              e.stopPropagation();
              requestToParticipateInEvent(event.id);
            }}
          >
            <TbCalendarX className="mr-2 h-4 w-4" /> Closed
          </Badge>
        );
      } else {
        return (
          <Badge
            colorScheme={"purple"}
            rounded={"full"}
            pl={4}
            pr={4}
            py={2}
            className="w-fit hover:bg-violet-900"
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            cursor={"pointer"}
            onClick={(e) => {
              e.stopPropagation();
              requestToParticipateInEvent(event.id);
            }}
          >
            <TbCalendarPlus className="mr-2 h-4 w-4" /> Register
          </Badge>
        );
      }
    }
  };

  const getEventStatus = () => {
    if (!event) return;

    if (event.isCompleted) {
      return (
        <Badge
          colorScheme={"green"}
          rounded={"full"}
          pl={4}
          pr={4}
          py={2}
          className="w-fit"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <FaCheckCircle className="mr-2 h-4 w-4" />
          Complete
        </Badge>
      );
    }

    let now = moment();

    if (now.isSameOrAfter(moment(event.datetime))) {
      return (
        <Badge
          colorScheme={"purple"}
          rounded={"full"}
          pl={4}
          pr={4}
          py={2}
          className="w-fit"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
        >
          <FaPlay className="mr-2 h-4 w-4" /> Ongoing
        </Badge>
      );
    } else {
      return (
        <Badge
          colorScheme={"blue"}
          rounded={"full"}
          pl={4}
          pr={4}
          py={2}
          className="w-fit"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
        >
          <FaRegClock className="mr-2 h-4 w-4" /> Upcoming
        </Badge>
      );
    }
  };

  const requestToParticipateInEvent = async (eventId: number) => {
    try {
      const res = await StudentServices.participateInEvent({ eventId });

      if (res.data.status) {
        toast({
          title: `Registered Successfully`,
          colorScheme: "green",
          isClosable: true,
        });
        getSingleEvent();
        return;
      }

      toast({
        title: `Failed to Register`,
        description: res.data.message,
        colorScheme: "red",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `Failed to Register`,
        colorScheme: "red",
        isClosable: true,
      });
      console.error(error);
    }
  };

  useEffect(() => {
    getSingleEvent();
  }, []);

  if (!event) {
    return;
  }

  return (
    <div className="py-20">
      <Flex alignItems={"center"} direction={"column"} gap={2}>
        <ProfileCard
          title={`${event.eventHead.firstName} ${event.eventHead.lastName}`}
          img={event.eventHead.profileImg || ""}
          subTitle={event.eventHead.role.name}
        />
        <Heading mt={5}>{event?.name}</Heading>
        <Text className="text-center">{event?.description}</Text>
        <Flex className="my-10" gap={5}>
          <DueDateBadge dueDate={event?.datetime!} />
          {getEventStatus()}
          {getParticipationStatus()}
        </Flex>
      </Flex>

      <Flex px={40} mt={1} mb={10}>
        <Divider />
      </Flex>

      <Flex justifyContent={"center"}>
        <Tabs colorScheme="purple" variant="soft-rounded" className="w-full mf:w-2/3 lg:w-1/2">
          <TabList justifyContent={"center"} gap={"5px"} mb={5}>
            <Tab>Participants</Tab>
            <Tab>Organisers</Tab>
          </TabList>

          <TabPanels className="rounded-lg min-h-96">
            <TabPanel>
              <TableContainer className="rounded-xl shadow-xl" bg={"gray.800"}>
                <Table size={"md"}>
                  <Thead className="border-white" bg={"gray.700"}>
                    <Tr>
                      <Th className="w-3">#</Th>
                      <Th>Name</Th>
                      <Th className="w-10">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {event?.eventParticipants?.map((p, index) => (
                      <Tr key={p.id}>
                        <Td>{index + 1}</Td>
                        <Td>
                          {p.teacherId
                            ? `${p.teacher.firstName} ${p.teacher.lastName}`
                            : `${p.student.firstName} ${p.student.lastName}`}
                        </Td>
                        <Td>
                          {p.studentId === student?.id && (
                            <div className="flex justify-center">
                              <Badge
                                rounded={"full"}
                                colorScheme="red"
                                p={1}
                                px={3}
                                cursor={"pointer"}
                                onClick={async () => {
                                  await StudentServices.leaveEvent(p.eventId);
                                  await getSingleEvent();
                                  toast({
                                    title: "You have left from event",
                                    colorScheme: "green",
                                    isClosable: true,
                                  });
                                }}
                              >
                                Leave
                              </Badge>
                            </div>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel>
              <TableContainer className="rounded-xl shadow-xl" bg={"gray.800"}>
                <Table size={"md"}>
                  <Thead className="border-white" bg={"gray.700"}>
                    <Tr>
                      <Th className="w-3">#</Th>
                      <Th>Name</Th>
                      <Th className="w-10">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {event?.eventOrganisers?.map((p, index) => (
                      <Tr key={p.id}>
                        <Td>{index + 1}</Td>
                        <Td>{`${p.teacher.firstName} ${p.teacher.lastName}`}</Td>
                        <Td></Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </div>
  );
};

export default EventDetailsPage;
