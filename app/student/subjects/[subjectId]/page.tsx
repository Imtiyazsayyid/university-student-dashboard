"use client";
import ProfileCard from "@/app/components/ProfileCard";
import { Subject } from "@/app/interfaces/SubjectInterface";
import { Teacher } from "@/app/interfaces/TeacherInterface";
import StudentServices from "@/app/Services/StudentServices";
import { LuNewspaper } from "react-icons/lu";
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import { FaCheck, FaClock } from "react-icons/fa6";
import { PiQuestionBold } from "react-icons/pi";

interface Props {
  params: {
    subjectId: string;
  };
}

const SubjectDetailPage = ({ params }: Props) => {
  const [subject, setSubject] = useState<Subject>();
  const [subjectTeacher, setSubjectTeacher] = useState<Teacher>();
  const toast = useToast();
  const router = useRouter();

  const getSingleSubject = async () => {
    const res = await StudentServices.getSingleSubject(params.subjectId);

    if (res.data.status) {
      let subject = res.data.data;
      let teacher = subject?.divisionTeachers[0]?.teacher;
      if (teacher) {
        setSubjectTeacher(teacher);
      }

      setSubject(subject);
      return;
    }

    toast({
      title: "Failed To Get Subject",
      colorScheme: "red",
      isClosable: true,
    });
  };

  useEffect(() => {
    getSingleSubject();
  }, []);

  const colorWhiteGray700 = useColorModeValue("white", "gray.700");
  const colorGray100Gray800 = useColorModeValue("gray.100", "gray.800");

  if (!subject) return;

  return (
    <Flex direction={"column"} gap={"2"}>
      <Card rounded={"xl"} padding={"5"}>
        <CardBody display={"flex"} alignItems={{ base: "start", md: "center" }} flexDirection={"column"}>
          <Heading mb={"5"} textAlign={{ base: "start", md: "center" }} px={"2"}>
            {subject?.name}
          </Heading>
          {subjectTeacher && (
            <ProfileCard
              img={
                subjectTeacher?.profileImg ||
                "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
              }
              title={"Proffessor " + subjectTeacher?.firstName + " " + subjectTeacher?.lastName}
              subTitle={subjectTeacher?.role.name || ""}
            />
          )}
        </CardBody>
      </Card>

      <Card rounded={"xl"}>
        <CardBody display={"flex"} padding={"8"} gap={4} flexDirection={"column"}>
          <Flex justifyContent={"space-between"} alignItems={"end"}>
            <Heading size={"lg"}>Units</Heading>
            {/* <Badge colorScheme="red" rounded={"md"} px={4} py={2}>
              0% Complete
            </Badge> */}
          </Flex>

          <Grid
            bg={colorGray100Gray800}
            width={"full"}
            padding={2}
            rounded={"lg"}
            gap={2}
            gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          >
            {subject.units.map((u) => (
              <GridItem key={u.id}>
                <Card rounded={"lg"} className="h-full" shadow={"md"} bg={colorWhiteGray700} cursor={"pointer"}>
                  <CardBody>
                    <Flex justifyContent={"space-between"} alignItems={"center"} className="h-full">
                      <Box>
                        <Heading size={"1"}>Unit {u.number}</Heading>
                        <Text fontSize={"xs"}>{u.name}</Text>
                      </Box>
                      <Flex gap={2} alignItems={"center"}>
                        <Badge
                          colorScheme="purple"
                          rounded={"md"}
                          px={4}
                          py={2}
                          onClick={() => router.push(`/student/subjects/${params.subjectId}/units/${u.id}`)}
                        >
                          Study
                        </Badge>
                        {/* <Badge
                          colorScheme="green"
                          rounded={"md"}
                          px={4}
                          py={2}
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <FaCheck />
                        </Badge> */}
                        {/* <Badge
                          colorScheme="orange"
                          rounded={"md"}
                          px={4}
                          py={2}
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <FaClock />
                        </Badge> */}
                        <Badge
                          colorScheme="blue"
                          rounded={"md"}
                          px={4}
                          py={2}
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          onClick={() => router.push(`/student/subjects/${params.subjectId}/units/${u.id}/quiz`)}
                        >
                          QUIZ
                        </Badge>
                      </Flex>
                    </Flex>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default SubjectDetailPage;
