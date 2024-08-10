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

const MyAssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsCount, setAssignmentsCount] = useState(0);

  const router = useRouter();
  const colorFAFAFAGray900 = useColorModeValue("#fafafa", "gray.900");
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const getAllAssignments = async () => {
    try {
      const res = await StudentServices.getAllAssignments({ ...pagination, });

      if (res.data.status) {
        setAssignments(res.data.data.assignments);
        setAssignmentsCount(res.data.data.assignmentCount);

      }
    } catch (error) {
      console.error("Error in Get All Assigments", error);
    }
  };

  useEffect(() => {
    getAllAssignments();
  }, [pagination]);

  return (
    <Flex direction={"column"} gap={"2"}>
      <Flex
        className="h-24 w-full rounded-xl"
        justifyContent={"center"}
        alignItems={"center"}
        bg={useColorModeValue("white", "gray.700")}
      >
        <Heading>Your Assignments</Heading>
      </Flex>
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
    </Flex>
  );
};

export default MyAssignmentsPage;
