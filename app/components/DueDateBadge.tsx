import { Badge, Flex } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { FaCalendar, FaRegClock } from "react-icons/fa6";

interface Props {
  dueDate: Date;
  isSubmitted?: boolean;
}

const DueDateBadge = ({ dueDate, isSubmitted = false }: Props) => {
  let colorScheme;
  const now = moment();
  const due = moment(dueDate);

  if (now.isSameOrAfter(due) || now.isSameOrAfter(due.clone().subtract(1, "hour"))) {
    colorScheme = "red";
  } else if (now.isSameOrAfter(due.clone().subtract(1, "day"))) {
    colorScheme = "orange";
  } else {
    colorScheme = "purple";
  }

  if (isSubmitted) {
    colorScheme = "green";
  }

  return (
    <Flex gap={"4"}>
      <Flex gap={5}>
        <Badge
          colorScheme={colorScheme}
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
          <FaCalendar className="mr-2 h-4 w-4" />
          {moment(dueDate).format("DD MMM, YYYY")}
        </Badge>
        <Badge
          colorScheme={colorScheme}
          rounded={"full"}
          pl={2}
          pr={4}
          py={2}
          className="w-fit"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
        >
          <FaRegClock className="mr-2 h-6 w-6" />
          {moment(dueDate).format("hh:mm a")}
        </Badge>
      </Flex>
    </Flex>
  );
};

export default DueDateBadge;
