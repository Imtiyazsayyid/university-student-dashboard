"use client";

import { Button, useColorModeValue } from "@chakra-ui/react";
import { CldUploadWidget } from "next-cloudinary";
import MyButton from "./MyButton";
import { FaUpload } from "react-icons/fa6";

interface CloudinaryResult {
  url: string;
  public_id: string;
}

interface Props {
  setLink: (link: string) => void;
  btnClasses?: string;
  buttonText?: string;
}

// bg={useColorModeValue("white", "gray.700")}

const UploadCloudinary = ({ setLink, btnClasses }: Props) => {
  return (
    <>
      <div className="hidden dark:block">
        <CldUploadWidget
          options={{
            sources: ["local", "url"],
            multiple: false,
            cropping: true,
            styles: {
              palette: {
                window: "#111111",
                sourceBg: "#111111",
                windowBorder: "#7C3AED",
                tabIcon: "#ffffff",
                inactiveTabIcon: "#555a5f",
                menuIcons: "#555a5f",
                link: "#7C3AED",
                action: "#339933",
                inProgress: "#7C3AED",
                complete: "#339933",
                error: "#cc0000",
                textDark: "#000000",
                textLight: "#fcfffd",
              },
              fonts: {
                default: null,
                "sans-serif": {
                  url: null,
                  active: true,
                },
              },
            },
          }}
          uploadPreset="oekh1dfb"
          onUpload={(result) => {
            console.log({ result });
            if (result.event !== "success") return;
            const info = result.info as CloudinaryResult;
            if (info.url) {
              setLink(info.url);
            }
          }}
        >
          {({ open }) => {
            if (!open) return <></>;
            return (
              <MyButton
                className={"w-fit h-12 flex" + btnClasses}
                action={(e) => {
                  open();
                }}
                colorScheme={"purple"}
              >
                <FaUpload className="min-h-4 min-w-4" />
                {/* <div>Upload Material</div> */}
              </MyButton>
            );
          }}
        </CldUploadWidget>
      </div>
      <div className="dark:hidden">
        <CldUploadWidget
          options={{
            sources: ["local", "url"],
            multiple: false,
            cropping: true,
            styles: {
              palette: {
                window: "#fff",
                sourceBg: "f4f4f5",
                windowBorder: "#7C3AED", // change to primary theme
                tabIcon: "#000000",
                inactiveTabIcon: "#555a5f",
                menuIcons: "#555a5f",
                link: "#7C3AED", // change to primary theme
                action: "#339933",
                inProgress: "#7C3AED", // change to primary theme
                complete: "#339933",
                error: "#cc0000",
                textDark: "#000000",
                textLight: "#fcfffd",
              },
              fonts: {
                default: null,
                "sans-serif": {
                  url: null,
                  active: true,
                },
              },
            },
          }}
          uploadPreset="oekh1dfb"
          onUpload={(result) => {
            console.log({ result });
            if (result.event !== "success") return;
            const info = result.info as CloudinaryResult;
            if (info.url) {
              setLink(info.url);
            }
          }}
        >
          {({ open }) => {
            if (!open) return <></>;
            return (
              <MyButton
                className={"w-fit" + btnClasses}
                action={(e) => {
                  open();
                }}
                colorScheme={"purple"}
              >
                <FaUpload className="mr-2 h-12 w-12" />
                {/* Upload Material */}
              </MyButton>
            );
          }}
        </CldUploadWidget>
      </div>
    </>
  );
};

export default UploadCloudinary;
