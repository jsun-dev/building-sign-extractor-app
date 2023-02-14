import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Flex,
  Image,
} from "@chakra-ui/react";

import imagePaths from "../imagePaths";

const ImageModal = (props) => {
  const images = imagePaths.map((path) => (
    <Image
      key={path.id}
      src={path.source}
      w="100px"
      h="100px"
      objectFit="cover"
      onClick={props.clickImageHandler}
    />
  ));

  return (
    <Modal isOpen={props.isModalOpen} onClose={props.closeModalHandler}>
      <ModalOverlay>
        <ModalContent maxW="588px">
          <ModalHeader>Choose an image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex wrap="wrap" gap="10px">
              {images}
            </Flex>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ImageModal;
