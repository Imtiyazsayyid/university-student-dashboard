"use client";

import AssignmentStatusBadge from "@/app/components/AssignmentStatusBadge";
import DueDateBadge from "@/app/components/DueDateBadge";
import MiniPreviewAnything from "@/app/components/MiniPreviewAnything";
import MyButton from "@/app/components/MyButton";
import MyQuill from "@/app/components/MyQuill";
import UploadCloudinary from "@/app/components/UploadCloudinary";
import {
  Assignment,
  AssignmentQuestion,
  AssignmentQuestionResponses,
  AssignmentUploads,
} from "@/app/interfaces/AssignmentInterface";
import StudentServices from "@/app/Services/StudentServices";
import { Button, Divider, Flex, Heading, Text, Textarea, useColorModeValue, useToast } from "@chakra-ui/react";
import { truncateSync } from "fs";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaChevronCircleDown } from "react-icons/fa";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa6";
import { RxOpenInNewWindow } from "react-icons/rx";

interface Props {
  params: {
    assignmentId: string;
  };
}

interface AssignmentAnswers {
  questionId: number;
  answer: string;
}

const AssignmentPage = ({ params }: Props) => {
  const [assignment, setAssignment] = useState<Assignment>();
  const router = useRouter();
  const toast = useToast();

  const [assignmentAnswers, setAssignmentAnswers] = useState<AssignmentAnswers[]>([]);
  const [assignmentUploads, setAssignmentUploads] = useState<string[]>([]);
  const [isSubmitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showProvidedMaterial, setShowProvidedMaterial] = useState(false);
  const [showUploadedMaterial, setShowUploadedMaterial] = useState(true);
  const [pastDueDate, setPastDueDate] = useState(false);

  const getSingleAssignment = async () => {
    try {
      const res = await StudentServices.getSingleAssignment(params.assignmentId);

      if (res.data.status) {
        setAssignment(res.data.data);
      }

      const dueDate = res.data.data.dueDate;
      if (moment(moment()).isAfter(dueDate)) {
        setPastDueDate(true);
      }

      let questions = res.data.data.questions;
      let responses = res.data.data.responses;

      if (questions && questions.length) {
        let answers = questions.map((q: AssignmentQuestion) => {
          const currentResponse = responses.find((r: AssignmentQuestionResponses) => r.assignmentQuestionId === q.id);

          return {
            db_id: currentResponse?.id || null,
            questionId: q.id,
            answer: currentResponse?.answer || "",
          };
        });

        setAssignmentAnswers(answers);
      }

      let uploads = res.data.data.assignmentUploads;

      if (uploads && uploads.length) {
        setAssignmentUploads(uploads.map((u: AssignmentUploads) => u.material_url));
      }

      if (res.data.data.isSubmitted) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error in Get All Assigments", error);
    }
  };

  useEffect(() => {
    getSingleAssignment();
  }, []);

  const addAssignmentAnswer = (questionId: number, val: string) => {
    const checkChangedValue = assignmentAnswers.find((aa) => aa.questionId === questionId)?.answer;

    if (checkChangedValue === val) return;

    const newAssignmentAnswers = assignmentAnswers.map((aa) =>
      aa.questionId === questionId ? { ...aa, answer: val } : aa
    );

    setAssignmentAnswers(newAssignmentAnswers);
  };

  const submitAssignment = async (action: string) => {
    const payload = {
      assignmentId: assignment?.id,
      assignmentAnswers,
      assignmentUploads,
      action,
    };

    try {
      setLoading(true);
      const res = await StudentServices.submitAssignment(payload);

      if (res.data.status) {
        if (action != "save_progress") setSubmitted(true);

        toast({
          title: `Assignment ${
            action === "updated" ? "Updated" : action === "submit" ? "Turned In" : "Progress Saved"
          } Successfully`,
          colorScheme: action === "save_progress" ? "purple" : "green",
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to Submit Assignment",
          colorScheme: "green",
          isClosable: true,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Submit Assignment", error);
    }
  };

  if (!assignment) return null;

  return (
    <Flex direction={"column"} gap={"2"}>
      <Flex
        className="p-8 w-full rounded-xl h-full"
        bg={useColorModeValue("white", "gray.700")}
        justify={"space-between"}
        align={"start"}
        gap={3}
        direction={{ base: "column", lg: "row" }}
      >
        <Flex direction={"column"} alignItems={{ base: "center", md: "start" }} className="w-full h-full">
          <Heading mb={3}>{assignment.name}</Heading>
          <Text mb={6} color={useColorModeValue("gray.500", "gray.400")} className="w-full lg:w-2/3">
            {assignment.description}
          </Text>

          <Flex gap={5}>
            <DueDateBadge dueDate={assignment.dueDate} isSubmitted={isSubmitted} />
            <AssignmentStatusBadge dueDate={assignment.dueDate} isSubmitted={isSubmitted} />
          </Flex>
        </Flex>
        {!pastDueDate && !loading && (
          <Flex
            direction={"column"}
            alignItems={"end"}
            justifyContent={"start"}
            gap={"5"}
            className="w-full sm:w-40 mt-10 md:mt-0 h-full"
          >
            <MyButton
              colorScheme="green"
              className="w-full sm:w-40 h-12"
              action={() => submitAssignment(isSubmitted ? "update" : "submit")}
            >
              {isSubmitted ? "Update" : "Turn In"}
            </MyButton>

            {!isSubmitted && (
              <MyButton
                colorScheme="purple"
                className="w-full sm:w-40 h-12"
                action={() => submitAssignment("save_progress")}
              >
                Save Progress
              </MyButton>
            )}
          </Flex>
        )}
      </Flex>

      {assignment.material.length > 0 && (
        <Flex
          className="p-8 w-full rounded-xl overflow-hidden overflow-y-auto"
          direction={"column"}
          bg={useColorModeValue("white", "gray.700")}
        >
          <Flex justifyContent={"space-between"} alignItems={"start"}>
            <Flex direction={"column"} className="w-full">
              <Flex alignItems={"center"} justifyContent={"space-between"} className="w-full">
                <Heading fontSize={{ base: 19, md: 25 }}>Provided Material</Heading>
                <MyButton
                  colorScheme="purple"
                  rounded="full"
                  action={() => setShowProvidedMaterial(!showProvidedMaterial)}
                >
                  {showProvidedMaterial ? (
                    <FaChevronUp className="min-h-7 min-w-1 mx-0" />
                  ) : (
                    <FaChevronDown className="min-h-7 min-w-1 mx-0" />
                  )}
                </MyButton>
              </Flex>
              {showProvidedMaterial && (
                <Flex
                  className="border w-full h-96 rounded-xl overflow-x-auto p-5 mt-5"
                  gap={"5"}
                  bg={useColorModeValue("gray.100", "gray.800")}
                >
                  {assignment.material.map((m) => (
                    <div className="min-w-fit relative">
                      <MiniPreviewAnything link={m.material_url} extraClassName="min-w-fit max-h-[21.5rem]" />
                      <a
                        className="h-10 w-10 bg-violet-300 rounded-full absolute top-5 right-5 cursor-pointer"
                        href={m.material_url}
                        target="_blank"
                      >
                        <div className="flex w-full h-full justify-center items-center">
                          <RxOpenInNewWindow color="#322659" />
                        </div>
                      </a>
                    </div>
                  ))}
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}

      {!pastDueDate && (
        <Flex
          className="p-8 w-full rounded-xl overflow-hidden overflow-y-auto"
          direction={"column"}
          bg={useColorModeValue("white", "gray.700")}
        >
          <Flex justifyContent={"space-between"} alignItems={"start"}>
            <Flex direction={"column"} className="w-full">
              <Flex alignItems={"center"} justifyContent={"space-between"} className="w-full">
                <Heading fontSize={{ base: 19, md: 25 }}>Your Uploads</Heading>
                <Flex gap={5}>
                  <UploadCloudinary
                    setLink={(val) => {
                      setAssignmentUploads([...assignmentUploads, val]);
                    }}
                  />
                  {assignmentUploads.length > 0 && (
                    <MyButton
                      colorScheme="purple"
                      rounded="full"
                      className="w-12 h-12 max-h-12 max-w-12"
                      action={() => setShowUploadedMaterial(!showUploadedMaterial)}
                    >
                      {showUploadedMaterial ? (
                        <FaChevronUp className="min-h-7 min-w-1 mx-0" />
                      ) : (
                        <FaChevronDown className="min-h-7 min-w-1 mx-0" />
                      )}
                    </MyButton>
                  )}
                </Flex>
              </Flex>
              {showUploadedMaterial && assignmentUploads.length > 0 && (
                <Flex
                  className="border w-full h-96 rounded-xl overflow-x-auto p-5 mt-5"
                  gap={"5"}
                  bg={useColorModeValue("gray.100", "gray.800")}
                >
                  {assignmentUploads.map((u, index) => (
                    <div className="min-w-fit relative">
                      <MiniPreviewAnything link={u} extraClassName="min-w-fit max-h-[21.5rem]" />

                      <div
                        onClick={() => {
                          const newUploads = assignmentUploads.filter((u, i) => index !== i);
                          setAssignmentUploads(newUploads);
                        }}
                        className="h-10 w-10 bg-red-300 rounded-full absolute top-[4.5rem] right-5 cursor-pointer hover:opacity-80"
                      >
                        <div className="flex w-full h-full justify-center items-center">
                          <FaTrash color="#63171B" />
                        </div>
                      </div>

                      <a
                        className="h-10 w-10 bg-violet-300 rounded-full absolute top-5 right-5 cursor-pointer hover:opacity-80"
                        href={u}
                        target="_blank"
                      >
                        <div className="flex w-full h-full justify-center items-center">
                          <RxOpenInNewWindow color="#322659" />
                        </div>
                      </a>
                    </div>
                  ))}
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}

      {assignmentAnswers.length > 0 && (
        <Flex
          className="p-8 w-full min-h-screen rounded-xl overflow-hidden overflow-y-auto"
          direction={"column"}
          bg={useColorModeValue("white", "gray.700")}
        >
          <Flex justifyContent={"space-between"} alignItems={"start"}>
            <Flex direction={"column"}>
              <Heading fontSize={{ base: 19, md: 25 }}>Please Attempt All The Questions.</Heading>
              <Text className="mb-10 mt-2">There are {assignment.questions.length} Questions in this assignment.</Text>
            </Flex>
          </Flex>

          {assignmentAnswers.map((a) => (
            <>
              <Flex direction={"column"} className="min-h-fit w-full mb-20">
                <Heading fontSize={15} mb={4}>
                  {assignment.questions.find((q) => q.id === a.questionId)?.question}
                </Heading>
                <MyQuill
                  disabled={pastDueDate}
                  value={a.answer}
                  setValue={(val) => addAssignmentAnswer(a.questionId, val)}
                />
              </Flex>
              <Divider className="my-10 lg:mb-16" />
            </>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default AssignmentPage;
