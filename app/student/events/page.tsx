"use client";

import DueDateBadge from "@/app/components/DueDateBadge";
import ProfileCard from "@/app/components/ProfileCard";
import { Event } from "@/app/interfaces/EventInterface";
import StudentServices from "@/app/Services/StudentServices";
import { studentDetails } from "@/app/store/Store";
import {
  Badge,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaPlay, FaRegClock } from "react-icons/fa6";
import { TbCalendarPlus } from "react-icons/tb";

const EventPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();
  const colorFAFAFAGray900 = useColorModeValue("#fafafa", "gray.900");
  const [student] = useAtom(studentDetails);
  const toast = useToast();

  const getAllEvents = async () => {
    try {
      const res = await StudentServices.getAllEvents();

      if (res.data.status) {
        setEvents(res.data.data.events);
      }
    } catch (error) {
      console.error("Error in Get All Assigments", error);
    }
  };

  const getEventStatus = (event: Event) => {
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

  const getParticipationStatus = (event: Event) => {
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
        return <Badge className="bg-gray-500 hover:bg-gray-500">Closed</Badge>;
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

  const requestToParticipateInEvent = async (eventId: number) => {
    try {
      const res = await StudentServices.participateInEvent({ eventId });

      if (res.data.status) {
        toast({
          title: `Registered Successfully`,
          colorScheme: "green",
          isClosable: true,
        });
        getAllEvents();
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
    getAllEvents();
  }, []);

  return (
    <Flex direction={"column"} gap={"2"}>
      <Flex
        className="h-24 w-full rounded-xl"
        justifyContent={"center"}
        alignItems={"center"}
        bg={useColorModeValue("white", "gray.700")}
      >
        <Heading>Your Events</Heading>
      </Flex>
      <TableContainer className="rounded-xl">
        <Table size={"lg"} bg={useColorModeValue("white", "gray.800")}>
          <Thead bg={useColorModeValue("white", "gray.700")} className="border-white">
            <Tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Venue</Th>
              <Th>Date</Th>
              <Th>Event Head</Th>
              <Th>Participate</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {events.map((e, index) => (
              <Tr
                key={e.id}
                cursor={"pointer"}
                _hover={{ bg: colorFAFAFAGray900 }}
                onClick={() => router.push(`/student/events/${e.id}`)}
              >
                <Td>{index + 1}</Td>
                <Td>{e.name}</Td>
                <Td>{e.venue}</Td>
                <Td>
                  <DueDateBadge dueDate={e.datetime} isSubmitted={false} />
                </Td>
                <Td>
                  <ProfileCard
                    title={`${e.eventHead.firstName} ${e.eventHead.lastName}`}
                    img={e.eventHead.profileImg || ""}
                    subTitle={e.eventHead.role.name}
                  />
                </Td>
                <Td>{getParticipationStatus(e)}</Td>
                <Td>{getEventStatus(e)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default EventPage;
