"use client";
import ProfileCard from "@/app/components/ProfileCard";
import { Subject } from "@/app/interfaces/SubjectInterface";
import { Teacher } from "@/app/interfaces/TeacherInterface";
import StudentServices from "@/app/Services/StudentServices";
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
import { FaCheck, FaClock } from "react-icons/fa6";

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
              img={subjectTeacher?.profileImg || ""}
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
            <Badge colorScheme="red" rounded={"md"} px={4} py={2}>
              0% Complete
            </Badge>
          </Flex>

          <Grid
            bg={useColorModeValue("gray.100", "gray.800")}
            width={"full"}
            padding={2}
            rounded={"lg"}
            gap={2}
            gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          >
            {subject.units.map((u) => (
              <GridItem>
                <Card rounded={"lg"} shadow={"md"} bg={useColorModeValue("white", "gray.700")} cursor={"pointer"}>
                  <CardBody>
                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                      <Box>
                        <Heading size={"1"}>Unit {u.number}</Heading>
                        <Text fontSize={"xs"}>{u.name}</Text>
                      </Box>
                      <Flex gap={2}>
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
                        <Badge
                          colorScheme="orange"
                          rounded={"md"}
                          px={4}
                          py={2}
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <FaClock />
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
