import { Button, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TbDownload } from "react-icons/tb";

interface Props {
  link: string;
}

const PreviewAnything = ({ link }: Props) => {
  const [linkType, setLinkType] = useState("");
  const [formattedLink, setFormattedLink] = useState("");

  function convertToEmbeddableLink(youtubeLink: string) {
    var regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    var match = youtubeLink.match(regExp);
    if (match) {
      var videoId = match[1];
      var embeddableLink = "https://www.youtube.com/embed/" + videoId;
      return embeddableLink;
    } else {
      return "";
    }
  }

  useEffect(() => {
    if (link) {
      setFormattedLink(link);
      if (link.startsWith("https://www.youtube.com/")) {
        setLinkType("embed");
        setFormattedLink(convertToEmbeddableLink(link));
      } else if (link.endsWith(".pdf")) {
        setLinkType("pdf");
      } else if (
        link.endsWith(".xlsx") ||
        link.endsWith(".xls") || // Excel files
        link.endsWith(".docx") ||
        link.endsWith(".doc") || // Word files
        link.endsWith(".pptx") ||
        link.endsWith(".ppt") || // PowerPoint files
        link.endsWith(".xlsm") ||
        link.endsWith(".xltx") || // Excel macro-enabled/template files
        link.endsWith(".docm") ||
        link.endsWith(".dotx") || // Word macro-enabled/template files
        link.endsWith(".pptm") ||
        link.endsWith(".potx") // PowerPoint macro-enabled/template files
      ) {
        setLinkType("msoffice");
      } else if (
        link.endsWith(".jpg") ||
        link.endsWith(".jpeg") ||
        link.endsWith(".png") ||
        link.endsWith(".gif") ||
        link.endsWith(".bmp") ||
        link.endsWith(".svg") ||
        link.endsWith(".webp") ||
        link.endsWith(".tiff")
      ) {
        setLinkType("img");
      } else {
        setLinkType("unknown");
      }
    }
  }, [link]);

  if (!linkType) return;

  // const className = "min-h-[400px] md:min-h-[500px] lg:min-h-[700px] w-full";
  const className = "min-h-[50vh] md:min-h-[60vh] w-full";

  return (
    <div className="min-h-fit rounded-lg overflow-hidden flex flex-col justify-center items-center">
      {linkType === "embed" && <iframe allowFullScreen className={className} src={formattedLink}></iframe>}

      {linkType === "pdf" && <object className={className} data={formattedLink}></object>}

      {linkType === "img" && (
        <div>
          <img className={className + " max-h-[400px] object-contain"} src={formattedLink}></img>
        </div>
      )}

      {linkType === "msoffice" && (
        <iframe
          src={`https://view.officeapps.live.com/op/view.aspx?src=${formattedLink}`}
          className={className}
        ></iframe>
      )}

      {linkType === "unknown" && (
        <div className="min-h-[400px] md:min-h-[500px] lg:md:min-h-[700px] w-full flex flex-col justify-center items-center gap-5">
          <Text color={"white"}>Could Not Load Material</Text>
          <a href={link} target="_blank">
            <Button colorScheme="red">View In Browser</Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default PreviewAnything;
