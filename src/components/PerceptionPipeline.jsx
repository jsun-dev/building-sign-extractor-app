import React, { useState, useEffect, useRef } from "react";
import { Button, Flex } from "@chakra-ui/react";

import PerceptionStep from "../ui/PerceptionStep";
import { renderImageData } from "../utils";

const PerceptionPipeline = (props) => {
  const [currentStep, setCurrentStep] = useState(0);

  const grayRef = useRef();
  const blurRef = useRef();
  const threshRef = useRef();
  const digitsRef = useRef();

  const steps = [
    {
      id: "step1",
      canvasRef: grayRef,
      description: "1. Convert the image to a grayscaled version.",
    },
    {
      id: "step2",
      canvasRef: blurRef,
      description: "2. Blur the image to smooth out any noise.",
    },
    {
      id: "step3",
      canvasRef: threshRef,
      description: "3. Apply thresholding to get a binary image.",
    },
    {
      id: "step4",
      canvasRef: digitsRef,
      description: "4. Analyse white blobs to extract the digits.",
    },
  ];

  useEffect(() => {
    setCurrentStep(0);

    const result = props.extractResult;
    if (result !== null) {
      renderImageData(grayRef, result.gray);
      renderImageData(blurRef, result.blur);
      renderImageData(threshRef, result.thresh);
      renderImageData(digitsRef, result.digits);
    }
  }, [props.extractResult]);

  const previousStepHandler = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const nextStepHandler = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <>
      {props.extractResult && (
        <Flex alignItems="center" justifyContent="center" gap="30px">
          <Button isDisabled={currentStep === 0} onClick={previousStepHandler}>
            {"<"}
          </Button>
          {steps.map((step, index) => (
            <PerceptionStep
              key={step.id}
              canvasRef={step.canvasRef}
              description={step.description}
              isHidden={currentStep !== index}
            />
          ))}
          <Button isDisabled={currentStep === 3} onClick={nextStepHandler}>
            {">"}
          </Button>
        </Flex>
      )}
    </>
  );
};

export default PerceptionPipeline;
