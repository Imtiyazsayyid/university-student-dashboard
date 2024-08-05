import { Badge, Flex } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaCalendar, FaCircleXmark, FaClock, FaRegClock } from "react-icons/fa6";

interface Props {
  dueDate: Date;
  isSubmitted: boolean;
}

const AssignmentStatusBadge = ({ isSubmitted, dueDate }: Props) => {
  let colorScheme;
  const now = moment();
  const due = moment(dueDate);

  const isLate = now.isSameOrAfter(due);

  return (
    <Flex gap={"4"}>
      {isLate && !isSubmitted ? (
        <Badge
          colorScheme={"red"}
          rounded={"full"}
          py={2}
          pl={2}
          pr={5}
          className="w-fit"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
        >
          <FaCircleXmark className="mr-4 h-6 w-6" />
          Closed
        </Badge>
      ) : isSubmitted ? (
        <Badge
          colorScheme={"green"}
          rounded={"full"}
          py={2}
          pl={2}
          pr={5}
          className="w-fit"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
        >
          <FaCheckCircle className="mr-4 h-6 w-6" />
          Turned In
        </Badge>
      ) : (
        <Badge
          colorScheme={"blue"}
          rounded={"full"}
          py={2}
          pl={2}
          pr={5}
          className="w-fit"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
        >
          <FaClock className="mr-4 h-6 w-6" />
          Pending
        </Badge>
      )}
    </Flex>
  );
};

export default AssignmentStatusBadge;
