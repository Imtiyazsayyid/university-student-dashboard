"use client";

import AssignmentStatusBadge from "@/app/components/AssignmentStatusBadge";
import DueDateBadge from "@/app/components/DueDateBadge";
import ProfileCard from "@/app/components/ProfileCard";
import { Assignment } from "@/app/interfaces/AssignmentInterface";
import StudentServices from "@/app/Services/StudentServices";
import MyPagination from "@/app/components/MyPagination";
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
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Select } from "chakra-react-select";
import { Subject } from "@/app/interfaces/SubjectInterface";
import { LuFilter, LuFilterX } from "react-icons/lu";

export interface SelectOption {
  label: string;
  value: number | undefined | null;
}

const MyAssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [accessibleSubjects, setAccessibleSubjects] = useState<Subject[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();
  const colorFAFAFAGray900 = useColorModeValue("#fafafa", "gray.900");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const [filters, setFilters] = useState({
    search: "",
    subjectId: undefined as SelectOption | undefined | null,
    status: undefined as SelectOption | undefined | null,
  });

  const statusFilterOptions = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Complete",
      value: "complete",
    },
    {
      label: "Closed",
      value: "closed",
    },
  ];

  const getAllAssignments = async () => {
    try {
      // Modify Select Options
      const subjectId = filters.subjectId?.value;
      const status = filters.status?.value;

      const res = await StudentServices.getAllAssignments({ ...pagination, ...filters, subjectId, status });

      if (res.data.status) {
        setAssignments(res.data.data.assignments);
        setAssignmentsCount(res.data.data.assignmentCount);
      }
    } catch (error) {
      console.error("Error in Get All Assigments", error);
    }
  };

  const getAllAccessibleSubjects = async () => {
    try {
      const res = await StudentServices.getAccessibleSubjects();

      if (res.data.status) {
        setAccessibleSubjects(res.data.data);
      }
    } catch (error) {
      console.error("Error in getAllAccessibleSubjects", error);
    }
  };

  useEffect(() => {
    getAllAccessibleSubjects();
  }, []);

  useEffect(() => {
    getAllAssignments();
  }, [pagination, filters]);

  return (
    <Flex direction={"column"} gap={"2"} className="relative h-[90vh]">
      <Flex
        className="h-fit w-full rounded-xl p-7 gap-4"
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        bg={useColorModeValue("white", "gray.700")}
      >
        <Heading>Your Assignments</Heading>
      </Flex>

      {showFilters && (
        <Flex className="rounded-xl w-full gap-2 p-2" bg={"gray.700"} direction={{ base: "column", md: "row" }}>
          <Flex className="w-full lg:w-1/2">
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

          <Flex className="w-full lg:w-1/4">
            <Select
              value={filters.subjectId as SelectOption | undefined}
              onChange={(val) => setFilters({ ...filters, subjectId: val })}
              placeholder="Subject"
              className="w-full"
              options={accessibleSubjects.map((s) => ({ label: s.name, value: s.id }))}
              selectedOptionColorScheme="purple"
              isClearable
              variant="filled"
              useBasicStyles
            />
          </Flex>
          <Flex className="w-full lg:w-1/4">
            <Select
              value={filters.status as SelectOption | undefined}
              onChange={(val) => setFilters({ ...filters, status: val })}
              placeholder="Status"
              className="w-full"
              options={statusFilterOptions as any}
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
              <Th>Subject</Th>
              <Th>Name</Th>
              <Th>Teacher</Th>
              <Th>Due Date</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assignments.map((a, index) => (
              <Tr
                key={a.id}
                cursor={"pointer"}
                _hover={{ bg: colorFAFAFAGray900 }}
                onClick={() => router.push(`/student/assignments/${a.id}`)}
              >
                <Td>{index + 1}</Td>
                <Td>{a.subject.name}</Td>
                <Td>{a.name}</Td>
                <Td>
                  {a.teacher.firstName} {a.teacher.lastName}
                </Td>
                <Td>
                  <DueDateBadge dueDate={a.dueDate} isSubmitted={a.submittedAssignments.length > 0} />
                </Td>
                <Td>
                  <AssignmentStatusBadge dueDate={a.dueDate} isSubmitted={a.submittedAssignments.length > 0} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <MyPagination show={true} itemCount={assignmentsCount} pagination={pagination} setPagination={setPagination} />

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

export default MyAssignmentsPage;
