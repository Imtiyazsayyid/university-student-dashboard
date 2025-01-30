// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import Image from "next/image";

// interface Props {
//   src?: string | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const ImageModal = ({ src, isOpen, onClose }: Props) => {
//   if (!src) {
//     return null;
//   }
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogTitle></DialogTitle>
//         <div className="dialog-description">
//           <div className="w-96 h-96">
//             <Image
//               src={src}
//               alt="Image"
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust this value based on how large the image should be in the dialog
//             />
//           </div>
//         </div>
//         <DialogDescription></DialogDescription>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ImageModal;


"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Image from "next/image";

interface Props {
  src?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ src, isOpen, onClose }: Props) => {
  if (!src || typeof src !== "string") {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalCloseButton />
        <ModalBody>
          <div className="w-[700px] h-[700px] mx-auto relative">
            <Image
              src={src}
              alt="Image"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
