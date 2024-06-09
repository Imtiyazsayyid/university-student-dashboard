import { Box, Button, HStack, Switch, Text, useColorMode } from "@chakra-ui/react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <HStack>
      <Box
        className="h-10 w-10 border flex justify-center items-center rounded-full cursor-pointer"
        bg={colorMode === "dark" ? "gray.700" : "gray.100"}
        onClick={toggleColorMode}
      >
        {colorMode === "dark" ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
      </Box>
      {/* <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} colorScheme="green" /> */}
      {/* <Text whiteSpace={"nowrap"}>Dark Mode</Text> */}
    </HStack>
  );
};

export default ColorModeSwitch;
