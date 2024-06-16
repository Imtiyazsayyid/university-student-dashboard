import { Badge } from "@chakra-ui/react";
import React from "react";

interface Props {
  showPercentage?: boolean;
  total: number;
  outOf: number;
}

const ScoreBadge = ({ total, outOf, showPercentage }: Props) => {
  const percentage = isNaN((total / outOf) * 100) ? 0 : (total / outOf) * 100;
  let colorScheme;

  if (percentage < 50) {
    colorScheme = "red";
  } else if (percentage < 75) {
    colorScheme = "orange";
  } else {
    colorScheme = "green";
  }

  if (showPercentage) {
    return (
      <Badge
        colorScheme={colorScheme}
        rounded={"md"}
        px={4}
        py={2}
        className="w-fit"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
      >
        {percentage}%
      </Badge>
    );
  } else {
    return (
      <Badge
        colorScheme={colorScheme}
        rounded={"md"}
        px={4}
        py={2}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
        className="w-fit"
      >
        {total} of {outOf} Answered Correctly.
      </Badge>
    );
  }
};

export default ScoreBadge;
