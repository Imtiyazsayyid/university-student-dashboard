"use client";

import ScoreBadge from "@/app/components/ScoreBadge";
import { Unit } from "@/app/interfaces/UnitInterface";
import { UnitQuiz } from "@/app/interfaces/UnitQuizInterface";
import StudentServices from "@/app/Services/StudentServices";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  Text,
  useToast,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiCheck, BiCross, BiX } from "react-icons/bi";
import ResponseHistoryModal from "./ResponseHistoryModal";

interface Props {
  params: {
    unitId: number;
  };
}

interface QuizResponse {
  questionId: number;
  optionId: number | null;
}

const UnitQuizesPage = ({ params }: Props) => {
  const router = useRouter();
  const [unit, setUnit] = useState<Unit>();
  const [quizResponseForm, setQuizResponseForm] = useState<QuizResponse[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [result, setResult] = useState({
    total: 0,
    outOf: 0,
  });

  const toast = useToast();

  const getSingleUnit = async () => {
    const res = await StudentServices.getSingleUnit(params.unitId);
    if (res.data.status) {
      setUnit(res.data.data);
    }
  };

  const setNewQuestion = (index: number) => {
    setCurrentQuizIndex(index);
    setShowResults(false);

    let quizForm: QuizResponse[] = [];
    // setQuizResponseForm(quizForm);

    unit?.unitQuizes[index].questions.forEach((q) => quizForm.push({ questionId: q.id, optionId: null }));
    setQuizResponseForm(quizForm);
  };

  const selectOption = (index: number, optionId: string) => {
    const updatedQuizForm = quizResponseForm.map((qrf, qrfi) =>
      index === qrfi ? { ...qrf, optionId: parseInt(optionId) } : qrf
    );
    setQuizResponseForm(updatedQuizForm);
  };

  const validateQuiz = () => {
    if (quizResponseForm.find((qrf) => !qrf.optionId))
      return { success: false, message: "Please Attempt All Questions" };
    return { success: true, message: "Successfully Attempted Quiz" };
  };

  const calculateResult = () => {
    if (!unit?.unitQuizes[currentQuizIndex]) return;
    const totalQuestions = unit?.unitQuizes[currentQuizIndex].questions.length;
    let allCorrectOptions = [];

    for (let question of unit?.unitQuizes[currentQuizIndex].questions) {
      for (let option of question.options) {
        if (option.isCorrect) {
          allCorrectOptions.push(option.id);
        }
      }
    }

    const correctAnswers = quizResponseForm.reduce(
      (acc, cv) => (allCorrectOptions.includes(cv.optionId!) ? acc + 1 : acc + 0),
      0
    );

    setResult({
      total: correctAnswers,
      outOf: totalQuestions,
    });
  };

  const submitQuiz = async () => {
    const validateAttempt = validateQuiz();

    if (!validateAttempt.success) {
      toast({
        colorScheme: "red",
        title: "Failed to Submit Quiz",
        description: validateAttempt.message,
        status: "error",
        variant: "subtle",
        isClosable: true,
      });
      return;
    }

    const res = await StudentServices.submitUnitQuiz({
      responses: quizResponseForm,
      quizId: unit?.unitQuizes[currentQuizIndex].id,
    });

    if (res.data.status) {
      calculateResult();
      setShowResults(true);
      toast({
        colorScheme: "green",
        title: "Quiz Attemted Successfully",
        description: "You Quiz Attempt has been recorded successfully",
        status: "success",
        variant: "subtle",
        isClosable: true,
      });
    } else {
      toast({
        colorScheme: "red",
        title: "Failed to Submit Quiz",
        description: "Your Quiz was not recorded due to some error.",
        status: "error",
        variant: "subtle",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (unit && unit?.unitQuizes && unit?.unitQuizes.length > 0 && !showResults) {
      setNewQuestion(currentQuizIndex);
    }
  }, [unit, showResults]);

  useEffect(() => {
    getSingleUnit();
  }, []);

  if (!unit?.unitQuizes || unit?.unitQuizes.length === 0) {
    return (
      <Card>
        <CardBody>
          <Flex direction={"column"} gap={"5"} alignItems={"center"} py={9}>
            <Heading size={"md"}>No Quizes Available For this Unit.</Heading>
            <Button colorScheme={"purple"} onClick={() => router.back()}>
              Go Back
            </Button>
          </Flex>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <ResponseHistoryModal
        quizId={unit?.unitQuizes[currentQuizIndex].id}
        isOpen={showHistoryModal}
        setOpen={(val) => setShowHistoryModal(val)}
        showResults={showResults}
      />

      <Card rounded="xl">
        <CardBody>
          <Tabs
            colorScheme="gray"
            variant="soft-rounded"
            defaultIndex={currentQuizIndex}
            onChange={(index) => setNewQuestion(index)}
          >
            <TabList
              className="overflow-hidden overflow-x-auto"
              justifyContent={{ base: "start", md: "center" }}
              pb={3}
              gap={"4"}
              mx={"1"}
            >
              {unit?.unitQuizes.map((uq) => (
                <Tab minWidth={"fit-content"} key={uq.id}>
                  {uq.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {unit?.unitQuizes.map((uq) => (
                <TabPanel
                  key={uq.id}
                  bg={useColorModeValue("gray.100", "gray.800")}
                  rounded={"xl"}
                  mt={"2"}
                  overflowY={"auto"}
                  p={{ base: 2, md: 3 }}
                >
                  <Flex direction={"column"} gap={3}>
                    <Card rounded="lg">
                      <CardBody>
                        <Heading textAlign={"center"}>{uq.name}</Heading>
                        <Text textAlign={"center"} mt={3}>
                          These quizes are only for practise and self evaluation. Your Results will not be shared.
                        </Text>
                        <Text textAlign={"center"}>Please Attempt all questions.</Text>

                        {showResults && (
                          <Flex direction={"row"} justifyContent={"center"} gap={"2"} mt={5}>
                            <ScoreBadge total={result.total} outOf={result.outOf} />
                            <ScoreBadge total={result.total} outOf={result.outOf} showPercentage={true} />
                          </Flex>
                        )}
                      </CardBody>
                    </Card>
                    {uq.questions.map((q, index) => (
                      <Card rounded="lg" key={q.id}>
                        <CardBody>
                          <Heading size={"md"} mb={2}>
                            {q.question}
                          </Heading>
                          {quizResponseForm[index] && (
                            <RadioGroup
                              value={quizResponseForm[index].optionId?.toString() || ""}
                              onChange={(val) => selectOption(index, val)}
                              isDisabled={showResults}
                            >
                              <Grid
                                py={3}
                                gap={3}
                                gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
                              >
                                {q.options.map((o) => (
                                  <GridItem
                                    key={o.id}
                                    className="border overflow-hidden rounded-xl max-w-full"
                                    onClick={() => !showResults && selectOption(index, o.id.toString())}
                                  >
                                    <Flex
                                      alignItems={"center"}
                                      justifyContent={"center"}
                                      className="py-8 lg:py-4 lg:px-3"
                                      direction={{ sm: "column", lg: "row" }}
                                    >
                                      <Radio
                                        size={"lg"}
                                        colorScheme="purple"
                                        mb={{ sm: 4, lg: 0 }}
                                        value={o.id.toString()}
                                      ></Radio>
                                      <Flex
                                        rounded={"xl"}
                                        className="cursor-pointer w-full"
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        mb={{ sm: 4, lg: 0 }}
                                      >
                                        <Text className="w-full px-5" textAlign={{ sm: "center", lg: "start" }}>
                                          {o.value}
                                        </Text>
                                      </Flex>
                                      <Flex>
                                        {showResults &&
                                          (o.isCorrect ? (
                                            <Badge
                                              colorScheme="green"
                                              rounded={"md"}
                                              px={4}
                                              py={2}
                                              display={{ base: "hidden", lg: "flex" }}
                                              justifyContent={"center"}
                                              alignItems={"center"}
                                              cursor={"pointer"}
                                            >
                                              <BiCheck />
                                            </Badge>
                                          ) : (
                                            <Badge
                                              colorScheme="red"
                                              rounded={"md"}
                                              px={4}
                                              py={2}
                                              display={{ base: "hidden", lg: "flex" }}
                                              justifyContent={"center"}
                                              alignItems={"center"}
                                              cursor={"pointer"}
                                            >
                                              <BiX />
                                            </Badge>
                                          ))}
                                      </Flex>
                                    </Flex>
                                  </GridItem>
                                ))}
                              </Grid>
                            </RadioGroup>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </Flex>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
          <Flex justifyContent={"end"} gap={2} mt={5}>
            <Badge
              onClick={() => setShowHistoryModal(true)}
              colorScheme="purple"
              rounded={"md"}
              px={4}
              py={2}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              cursor={"pointer"}
            >
              View Attempts
            </Badge>

            {showResults ? (
              <Badge
                onClick={() => setShowResults(false)}
                colorScheme="red"
                rounded={"md"}
                px={4}
                py={2}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                cursor={"pointer"}
              >
                Done
              </Badge>
            ) : (
              <Badge
                onClick={submitQuiz}
                colorScheme="green"
                rounded={"md"}
                px={4}
                py={2}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                cursor={"pointer"}
              >
                Submit
              </Badge>
            )}
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default UnitQuizesPage;
