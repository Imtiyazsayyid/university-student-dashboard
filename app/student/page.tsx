"use client";

import React, { useEffect, useState } from "react";
import { Batch } from "../interfaces/BatchInterface";
import StudentServices from "../Services/StudentServices";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Student } from "../interfaces/StudentInterface";
import { useRouter } from "next/navigation";

const StudentHomePage = () => {
  const [batch, setBatch] = useState<Batch>();
  const [student, setStudent] = useState<Student>();
  const toast = useToast();
  const router = useRouter();

  const getBatch = async () => {
    const res = await StudentServices.getStudentBatch();

    if (res.data.status) {
      setBatch(res.data.data);
    } else {
      toast({
        title: "Failed to Get Details",
      });
    }
  };

  const getStudent = async () => {
    const res = await StudentServices.getStudentDetails();

    if (res.data.status) {
      setStudent(res.data.data);
    } else {
      toast({
        title: "Failed to Get Details",
      });
    }
  };

  useEffect(() => {
    getBatch();
    getStudent();
  }, []);

  if (!batch || !student) return null;

  return (
    <Flex direction={"column"} gap={"3"}>
      <Box p={{ base: "4", md: "8" }} rounded="xl" bg={useColorModeValue("white", "gray.700")}>
        <Flex direction={"column"} p={10} gap={5} justifyContent={"center"} alignItems={"center"}>
          <Heading textAlign={"center"} size={{ base: "xl", md: "2xl" }}>
            Welcome {student?.firstName} {student?.lastName}
          </Heading>
          <Text textAlign={"center"} size="">
            {batch?.course.name} {batch?.year}
          </Text>
        </Flex>
      </Box>

      <Card rounded="xl">
        <CardBody>
          <Tabs colorScheme="gray" variant="soft-rounded" defaultIndex={batch.accessibleSemesters.length - 1}>
            <TabList
              className="overflow-hidden overflow-x-auto"
              justifyContent={{ base: "start", md: "center" }}
              pb={3}
              gap={"4"}
              mx={"1"}
            >
              {batch.accessibleSemesters.map((s) => (
                <Tab minWidth={"fit-content"}>Semester {s.semester.semNumber}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {batch.accessibleSemesters.map((s) => (
                <TabPanel
                  bg={useColorModeValue("gray.100", "gray.800")}
                  rounded={"xl"}
                  maxHeight={400}
                  mt={"2"}
                  overflowY={"auto"}
                  p={{ base: 2, md: 3 }}
                >
                  <Grid
                    gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap={"2"}
                  >
                    {s.semester.subjects.map((sub) => (
                      <GridItem>
                        <Card
                          rounded={"lg"}
                          shadow={"md"}
                          bg={useColorModeValue("white", "gray.700")}
                          cursor={"pointer"}
                          onClick={() => router.push(`/student/subjects/${sub.id}`)}
                        >
                          <CardBody>
                            <Heading size={"1"}>{sub.name}</Heading>
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
                  </Grid>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default StudentHomePage;
