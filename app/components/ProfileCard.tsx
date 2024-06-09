import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  img: string;
  title: string;
  subTitle?: string;
}

const ProfileCard = ({ img, title, subTitle }: Props) => {
  return (
    <Flex gap={4} className="border w-fit" px={4} py={3} rounded={"xl"} justifyContent={"center"} alignItems={"center"}>
      <Box rounded={"full"} overflow={"hidden"} height={10} width={10}>
        <img src={img || ""} />
      </Box>
      <Box>
        <Heading size={"2"}>{title}</Heading>
        <Text fontSize={"xs"}>{subTitle}</Text>
      </Box>
    </Flex>
  );
};

export default ProfileCard;
