import React from "react";
import imagePaths from "../imagePaths";

import {
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const ImageModal = (props) => {
  return (
    <Modal isOpen={props.isModalOpen} onClose={props.closeModalHandler}>
      <ModalOverlay>
        <ModalContent maxW="588px">
          <ModalHeader>Choose an image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex wrap="wrap" gap="10px">
              {imagePaths.map((path) => (
                <Image
                  key={path.id}
                  src={path.source}
                  w="100px"
                  h="100px"
                  objectFit="cover"
                  onClick={props.clickImageHandler}
                />
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ImageModal;
