"use client";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons";
import ColorModeSwitch from "./components/ColorModeSwitch";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Student } from "./interfaces/StudentInterface";
import StudentServices from "./Services/StudentServices";
import { TokenService } from "./Services/StorageService";
import { IoLibrary } from "react-icons/io5";

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
  key: string;
}

interface NavItemProps extends FlexProps {
  children: React.ReactNode;
  link: LinkItemProps;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, route: "/student", key: "admin" },
  { name: "Subjects", icon: IoLibrary, route: "/student/subjects", key: "subjects" },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", xl: 96 }}
      pos="fixed"
      h="full"
      pt={{ base: 0, xl: 10 }}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          VSIT Student
        </Text>
        <CloseButton display={{ base: "flex", xl: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} link={link} mb={"2"}>
          <Text>{link.name}</Text>
        </NavItem>
      ))}
    </Box>
  );
};

const isCurrentPath = (item: LinkItemProps) => {
  const currentPath = usePathname();
  if (item.route === "/student" && currentPath === "/student") {
    return true; // Exact match for home
  } else if (item.route !== "/student") {
    let items = currentPath.split("/");
    items.splice(0, 2);

    if (items.includes(item.key)) {
      return true;
    }

    return false;
  } else {
    return false;
  }
};

const NavItem = ({ link, children, ...rest }: NavItemProps) => {
  const router = useRouter();

  let options = {};
  if (isCurrentPath(link)) {
    options = {
      bg: useColorModeValue("gray.100", "gray.700"),
      // color: "white",
    };
  }

  return (
    <Box
      as="a"
      onClick={() => router.push(link.route)}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        alignItems="center"
        p="4"
        mx="4"
        borderRadius="xl"
        role="group"
        cursor="pointer"
        _hover={{
          bg: useColorModeValue("gray.100", "gray.700"),
          // color: "white",
        }}
        {...options}
        {...rest}
      >
        {link.icon && (
          <Icon
            mr="4"
            fontSize="20"
            _groupHover={
              {
                // color: "white",
              }
            }
            as={link.icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [studentDetails, setStudentDetails] = useState<Student>();

  const getStudentDetails = async () => {
    const res = await StudentServices.getStudentDetails();
    if (res.data.status) {
      setStudentDetails(res.data.data);
    }
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  const router = useRouter();

  const signOut = () => {
    TokenService.removeAccessToken();
    router.push("/auth/login");
  };
  return (
    <Flex
      ml={{ base: 0, xl: 96 }}
      px={{ base: 4, xl: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", xl: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", xl: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text display={{ base: "flex", xl: "none" }} fontSize="2xl" fontWeight="bold">
        VSIT Student
      </Text>

      <HStack spacing={{ base: "0", xl: "1" }}>
        <IconButton size="xl" variant="ghost" aria-label="open menu" icon={<FiBell />} className="mr-4" />
        <div className="mr-3">
          <ColorModeSwitch />
        </div>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=96&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a96ffc9636ba24f7a4a9"
                  }
                />
                <VStack display={{ base: "none", xl: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="sm">
                    {studentDetails?.firstName} {studentDetails?.lastName}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Student
                  </Text>
                </VStack>
                <Box display={{ base: "none", xl: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem onClick={signOut}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent onClose={() => onClose} display={{ base: "none", xl: "block" }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, xl: 96 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default Navbar;
