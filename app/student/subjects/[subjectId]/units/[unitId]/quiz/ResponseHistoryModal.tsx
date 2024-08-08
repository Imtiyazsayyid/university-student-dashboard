import ScoreBadge from "@/app/components/ScoreBadge";
import { UnitQuiz, unitQuizQuestionResponses } from "@/app/interfaces/UnitQuizInterface";
import StudentServices from "@/app/Services/StudentServices";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import moment from "moment";

import React, { useEffect, useState } from "react";
import { BiCheck, BiX } from "react-icons/bi";

interface Props {
  quizId?: number;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  showResults: boolean;
}

interface QuizResponse {
  attemptId: number;
  date: Date;
  responses: unitQuizQuestionResponses[];
}

const ResponseHistoryModal = ({ quizId, isOpen, setOpen, showResults }: Props) => {
  const [quizResponses, setQuizResponses] = useState<QuizResponse[]>([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [quizDetails, setQuizDetails] = useState<UnitQuiz>();
  const [result, setResult] = useState({
    total: 0,
    outOf: 0,
  });

  const onClose = () => {
    setCurrentResponseIndex(0);
    setOpen(false);
  };

  const getQuizResponse = async () => {
    try {
      const res = await StudentServices.getAllQuizResponses({
        quizId,
      });
      if (res.data.status) {
        setQuizResponses(res.data.data);

        console.log(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleQuiz = async () => {
    try {
      const res = await StudentServices.getSingleUnitQuiz(quizId);
      if (res.data.status) {
        setQuizDetails(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const next = () => {
    setCurrentResponseIndex(currentResponseIndex + 1);
  };

  const prev = () => {
    setCurrentResponseIndex(currentResponseIndex - 1);
  };

  const calculateResult = () => {
    if (!quizDetails || !quizResponses) return;

    const totalQuestions = quizDetails.questions.length;
    let allCorrectOptions = [];

    for (let question of quizDetails.questions) {
      for (let option of question.options) {
        if (option.isCorrect) {
          allCorrectOptions.push(option.id);
        }
      }
    }

    const correctAnswers = quizResponses[currentResponseIndex]?.responses.reduce(
      (acc, r) => (allCorrectOptions.includes(r.selectedOptionId) ? acc + 1 : acc + 0),
      0
    );

    setResult({
      total: correctAnswers,
      outOf: totalQuestions,
    });
  };

  useEffect(() => {
    if (quizId) {
      getQuizResponse();
      getSingleQuiz();
    }
  }, [quizId, showResults]);

  useEffect(() => {
    if (quizDetails && quizResponses) {
      calculateResult();
    }
  }, [quizDetails, quizResponses, currentResponseIndex]);

  const colorGray100Gray800 = useColorModeValue("gray.100", "gray.800");

  if (!quizId) return;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"md"} isCentered scrollBehavior={"inside"}>
      <ModalOverlay />
      <ModalContent bg={colorGray100Gray800} className={`md:min-w-[600px] lg:min-w-[900px]`}>
        <ModalHeader>{quizDetails?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {quizResponses.length > 0 ? (
            <Flex gap={"2"} flexDirection={"column"}>
              <Card>
                <CardBody>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    flexDirection={{ sm: "column", md: "row" }}
                    gap={5}
                  >
                    <Heading size={"md"}>
                      Attempt {currentResponseIndex + 1} &#40;
                      {moment(quizResponses[currentResponseIndex]?.date).format("DD MMM, YYYY")}
                      &#41;
                    </Heading>
                    <Flex gap={2}>
                      <ScoreBadge total={result.total} outOf={result.outOf} />
                      <ScoreBadge total={result.total} outOf={result.outOf} showPercentage={true} />
                    </Flex>
                  </Flex>
                </CardBody>
              </Card>
              {quizDetails?.questions.map((q) => (
                <Card key={q.id}>
                  <CardBody>
                    <Heading size={"md"}>{q.question}</Heading>
                    <Grid py={3} gap={3} gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}>
                      {q.options.map((o) => (
                        <GridItem className="border overflow-hidden rounded-xl max-w-full" key={o.id}>
                          <Flex
                            className="py-8"
                            alignItems={"center"}
                            justifyContent={"center"}
                            gap={3}
                            direction={{ sm: "column" }}
                          >
                            <Flex
                              className="min-h-6 min-w-6 border rounded-full"
                              justifyContent={"center"}
                              alignItems={"center"}
                            >
                              {quizResponses[currentResponseIndex]?.responses
                                .map((r) => r.selectedOptionId)
                                .includes(o.id) && <Box className="h-3 w-3 rounded-full" bgColor={"purple.300"}></Box>}
                            </Flex>

                            <Flex
                              rounded={"xl"}
                              className="cursor-pointer w-full"
                              justifyContent={"center"}
                              alignItems={"center"}
                              mb={{ sm: 4, lg: 0 }}
                            >
                              <Text className="w-full px-5" textAlign={{ sm: "center" }}>
                                {o.value}
                              </Text>
                            </Flex>
                            <Flex>
                              {o.isCorrect ? (
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
                              )}
                            </Flex>
                          </Flex>
                        </GridItem>
                      ))}
                    </Grid>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          ) : (
            <Flex>
              <Card className="w-full" py={5} px={2}>
                <CardBody>
                  <Flex className="w-full" justifyContent={"center"}>
                    <Heading size={"sm"}>No Attempts Yet.</Heading>
                  </Flex>
                </CardBody>
              </Card>
            </Flex>
          )}
        </ModalBody>

        <ModalFooter>
          {quizResponses.length > 0 && (
            <Flex justifyContent={"space-between"} className="w-full">
              <Flex>
                {currentResponseIndex !== 0 && (
                  <Button colorScheme="purple" onClick={prev}>
                    Prev
                  </Button>
                )}
              </Flex>
              <Flex>
                {currentResponseIndex !== quizResponses?.length - 1 && (
                  <Button colorScheme="purple" onClick={next}>
                    Next
                  </Button>
                )}
              </Flex>
            </Flex>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResponseHistoryModal;
