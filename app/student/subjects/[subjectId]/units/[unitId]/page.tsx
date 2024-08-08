"use client";

import {
  Card,
  CardBody,
  Flex,
  Heading,
  useToast,
  Text,
  useColorModeValue,
  Box,
  Button,
  Grid,
  GridItem,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Unit } from "@/app/interfaces/UnitInterface";
import StudentServices from "@/app/Services/StudentServices";
import PreviewAnything from "@/app/components/PreviewAnything";
import { UnitMaterial } from "@/app/interfaces/UnitMaterialInterface";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { TbDownload } from "react-icons/tb";
import downloadFile from "@/app/helpers/downloadFile";

interface Props {
  params: {
    subjectId: string;
    unitId: string;
  };
}

const SingleUnitPage = ({ params }: Props) => {
  const [unit, setUnit] = useState<Unit>();
  const [currentMaterial, setCurrentMaterial] = useState<UnitMaterial>();
  const [currentMaterialNumber, setCurrentMaterialNumber] = useState(0);

  const toast = useToast();

  const getSingleUnit = async () => {
    const res = await StudentServices.getSingleUnit(params.unitId);

    if (res.data.status) {
      setUnit(res.data.data);
    } else {
      toast({
        title: "Failed to Get Details",
      });
    }
  };

  const getCurrentUnitMaterial = () => {
    if (unit) {
      setCurrentMaterial(unit.unitMaterial[currentMaterialNumber]);
    }
  };

  useEffect(() => {
    if (unit) {
      setCurrentMaterial(unit.unitMaterial[currentMaterialNumber]);
    }
  }, [unit, currentMaterialNumber]);

  const next = () => {
    setCurrentMaterialNumber(currentMaterialNumber + 1);
  };

  const back = () => {
    setCurrentMaterialNumber(currentMaterialNumber - 1);
  };

  const downloadMaterial = async (currentMaterial: UnitMaterial | undefined) => {
    if (!currentMaterial) return;

    const loadingToast = toast({
      colorScheme: "blue",
      title: "Downloading Material",
      status: "loading",
      variant: "subtle",
    });

    const isDownloaded = await downloadFile(currentMaterial.link, currentMaterial.name);

    toast.close(loadingToast);

    if (!isDownloaded)
      toast({
        colorScheme: "red",
        title: "Failed to Download Resource.",
        description: "Content May Be From External Source.",
        status: "error",
        variant: "subtle",
        isClosable: true,
      });
  };

  useEffect(() => {
    getSingleUnit();
  }, []);

  const colorWhiteGray700 = useColorModeValue("white", "gray.700");
  const colorGray100Gray800 = useColorModeValue("gray.100", "gray.800");
  const colorBlackWhite = useColorModeValue("black", "white");

  if (!unit) return;

  return (
    <Flex direction={"column"} gap={"2"}>
      <Card rounded={"xl"} padding={"1"}>
        <CardBody display={"flex"} alignItems={{ base: "start", md: "center" }} flexDirection={"column"}>
          <Heading size={"lg"} mb={"2"} textAlign={{ base: "start", md: "center" }}>
            Unit {unit?.number}
          </Heading>
          <Text fontSize={"md"}>{unit?.name}</Text>
        </CardBody>
      </Card>

      <Card rounded={"xl"} bg={"black"}>
        <CardBody rounded={"xl"} p="0">
          <PreviewAnything link={currentMaterial?.link || ""} />
        </CardBody>
      </Card>

      <Card rounded={"xl"}>
        <CardBody rounded={"xl"}>
          <Flex justifyContent={"space-between"} alignItems={"center"} width={"full"}>
            <Box className="w-24">
              {currentMaterialNumber != 0 && (
                <Button leftIcon={<FaChevronLeft />} onClick={back}>
                  Back
                </Button>
              )}
            </Box>
            <Box>
              <Heading size={"xs"} textAlign={"center"}>
                {currentMaterialNumber + 1}. {currentMaterial?.name}
              </Heading>
            </Box>
            <Box className="w-24 flex justify-end">
              {unit.unitMaterial.length !== currentMaterialNumber + 1 && (
                <Button rightIcon={<FaChevronRight />} onClick={next}>
                  Next
                </Button>
              )}
            </Box>
          </Flex>
        </CardBody>
      </Card>

      {/* <Divider my={"5"} /> */}

      <Flex className="h-fit" flexDirection={"column"} pt={"5"} alignItems={"center"} gap={"5"}>
        {currentMaterial?.description && <Text className="text-center italic">{currentMaterial?.description}</Text>}
        <Button
          variant={"ghost"}
          colorScheme={"green"}
          className="w-fit"
          leftIcon={<TbDownload />}
          onClick={() => downloadMaterial(currentMaterial)}
        >
          Download
        </Button>
      </Flex>

      <Divider my={"5"} />
      <Heading size={"lg"} textAlign={"center"} mb={"4"}>
        Unit Materials
      </Heading>
      <Grid
        bg={colorGray100Gray800}
        width={"full"}
        padding={2}
        rounded={"lg"}
        gap={2}
        gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
      >
        {unit.unitMaterial.map((um, index) => (
          <GridItem key={um.id}>
            <Card
              rounded={"lg"}
              shadow={"md"}
              bg={currentMaterialNumber === index ? "purple.700" : colorWhiteGray700}
              color={currentMaterialNumber === index ? "white" : colorBlackWhite}
              cursor={"pointer"}
              onClick={() => setCurrentMaterialNumber(index)}
            >
              <CardBody>
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Box>
                    <Heading size={"1"}>
                      {index + 1}. {um.name}
                    </Heading>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>

      <Box className="h-20"></Box>
    </Flex>
  );
};

export default SingleUnitPage;
