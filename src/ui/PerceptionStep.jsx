import React from "react";
import { Flex, Text } from "@chakra-ui/react";

const PerceptionStep = (props) => {
  return (
    <Flex direction="column" gap="10px" hidden={props.isHidden}>
      <canvas ref={props.canvasRef} />
      <Text>{props.description}</Text>
    </Flex>
  );
};

export default PerceptionStep;
