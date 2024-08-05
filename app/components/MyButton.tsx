import { Badge } from "@chakra-ui/react";
import React from "react";

interface Props {
  colorScheme: string;
  action?: (val?: any) => void;
  className?: string;
  rounded?: string;
  children: React.ReactNode;
}

const MyButton = ({ colorScheme, action, children, className, rounded = "md" }: Props) => {
  return (
    <Badge
      display={"flex"}
      justifyContent={"center"}
      rounded={rounded}
      alignItems={"center"}
      colorScheme={colorScheme}
      px={4}
      py={2}
      onClick={action}
      cursor={"pointer"}
      className={"hover:opacity-80 " + className}
    >
      {children}
    </Badge>
  );
};

export default MyButton;
