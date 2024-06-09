import axios from "axios";
import fileDownload from "js-file-download";

function getExtension(url) {
  if (url.includes("//www.youtube.com/")) return "";

  const lastIndex = url.lastIndexOf(".");
  if (lastIndex === -1) {
    return "";
  }
  return url.substring(lastIndex);
}

const downloadFile = async (url, filename) => {
  const type = getExtension(url);

  try {
    const res = await axios.get(url, {
      responseType: "blob",
    });

    if (res.data) {
      fileDownload(res.data, filename + type);
    }

    return true;
  } catch (error) {
    return false;
  }

  //   axios
  //     .get(url, {
  //       responseType: "blob",
  //     })
  //     .then((res) => {
  //       fileDownload(res.data, filename + type);
  //       return true;
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
};
export default downloadFile;
