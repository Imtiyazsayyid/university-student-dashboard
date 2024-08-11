"use client";

import DueDateBadge from "@/app/components/DueDateBadge";
import MyPagination from "@/app/components/MyPagination";
import ProfileCard from "@/app/components/ProfileCard";
import { Event } from "@/app/interfaces/EventInterface";
import StudentServices from "@/app/Services/StudentServices";
import { studentDetails } from "@/app/store/Store";
import {
  Badge,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
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
import { Select } from "chakra-react-select";
import { useAtom } from "jotai";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaSearch } from "react-icons/fa";
import { FaPlay, FaRegClock } from "react-icons/fa6";
import { LuFilter, LuFilterX } from "react-icons/lu";
import { TbCalendarPlus, TbCalendarX } from "react-icons/tb";
import { SelectOption } from "../assignments/page";

const EventPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventCount, setEventCount] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: undefined as SelectOption | undefined | null,
    registrationStatus: undefined as SelectOption | undefined | null,
  });

  const router = useRouter();
  const colorFAFAFAGray900 = useColorModeValue("#fafafa", "gray.900");
  const [student] = useAtom(studentDetails);
  const toast = useToast();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });

  const registeredFilterOptions = [
    {
      label: "Registered",
      value: "registered",
    },
    {
      label: "Unregistered",
      value: "unregistered",
    },
  ];

  const statusFilterOptions = [
    {
      label: "Upcoming",
      value: "upcoming",
    },
    {
      label: "Ongoing",
      value: "ongoing",
    },
    {
      label: "Complete",
      value: "complete",
    },
  ];

  const getAllEvents = async () => {
    try {
      const status = filters.status?.value;
      const registrationStatus = filters.registrationStatus?.value;

      const res = await StudentServices.getAllEvents({
        ...pagination,
        ...filters,
        status,
        registrationStatus,
      });

      if (res.data.status) {
        setEvents(res.data.data.events);
        setEventCount(res.data.data.eventCount);
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
  }, [pagination, filters]);

  return (
    <Flex direction={"column"} gap={"2"} className="relative h-[90vh]">
      <Flex
        className="h-24 w-full rounded-xl"
        justifyContent={"center"}
        alignItems={"center"}
        bg={useColorModeValue("white", "gray.700")}
      >
        <Heading>Your Events</Heading>
      </Flex>
      {showFilters && (
        <Flex className="rounded-xl w-full gap-2 p-2" bg={"gray.700"} direction={{ base: "column", md: "row" }}>
          <Flex className="w-full lg:w-1/3">
            <InputGroup className="w-full">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search"
                variant="filled"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </InputGroup>
          </Flex>
          <Flex className="w-full lg:w-1/3">
            <Select
              value={filters.status as SelectOption | undefined}
              onChange={(val) => setFilters({ ...filters, status: val })}
              placeholder="Event Status"
              className="w-full"
              options={statusFilterOptions as any}
              isClearable
              selectedOptionColorScheme="purple"
              variant="filled"
              useBasicStyles
            />
          </Flex>
          <Flex className="w-full lg:w-1/3">
            <Select
              value={filters.registrationStatus as SelectOption | undefined}
              onChange={(val) => setFilters({ ...filters, registrationStatus: val })}
              placeholder="Registration Status"
              className="w-full"
              options={registeredFilterOptions as any}
              isClearable
              selectedOptionColorScheme="purple"
              variant="filled"
              useBasicStyles
            />
          </Flex>
        </Flex>
      )}
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
      <MyPagination show={true} itemCount={eventCount} pagination={pagination} setPagination={setPagination} />

      {!showFilters ? (
        <Badge
          colorScheme={"purple"}
          rounded={"full"}
          p={4}
          className="w-fit absolute bottom-5 right-5 hover:opacity-80"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
          onClick={() => setShowFilters(true)}
        >
          <LuFilter className="h-6 w-6" />
        </Badge>
      ) : (
        <Badge
          colorScheme={"red"}
          rounded={"full"}
          p={4}
          className="w-fit absolute bottom-5 right-5 hover:opacity-80"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
          onClick={() => setShowFilters(false)}
        >
          <LuFilterX className="h-6 w-6" />
        </Badge>
      )}
    </Flex>
  );
};

export default EventPage;
