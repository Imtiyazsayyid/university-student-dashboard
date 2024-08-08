import { Button } from "@chakra-ui/react";
import Image from "next/image";
import Navbar from "./Navbar";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/student");
  return <main className="min-h-screen"></main>;
}
