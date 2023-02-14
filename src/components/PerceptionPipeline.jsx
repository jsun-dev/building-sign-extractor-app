import { Button, Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import PerceptionStep from "../ui/PerceptionStep";
import { renderImageData } from "../utils";

const PerceptionPipeline = (props) => {
  const [currentStep, setCurrentStep] = useState(0);

  const grayRef = useRef();
  const blurRef = useRef();
  const threshRef = useRef();
  const digitsRef = useRef();

  useEffect(() => {
    setCurrentStep(0);

    if (props.result) {
      renderImageData(grayRef, props.result.gray);
      renderImageData(blurRef, props.result.blur);
      renderImageData(threshRef, props.result.thresh);
      renderImageData(digitsRef, props.result.digits);
    }
  }, [props.result]);

  const previousStepHandler = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const nextStepHandler = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <>
      {props.result && (
        <Flex alignItems="center" justifyContent="center" gap="30px">
          <Button isDisabled={currentStep === 0} onClick={previousStepHandler}>
            {"<"}
          </Button>
          <PerceptionStep
            canvasRef={grayRef}
            description="1. Convert the image to a grayscaled version."
            isHidden={currentStep !== 0}
          />
          <PerceptionStep
            canvasRef={blurRef}
            description="2. Blur the image to smooth out any noise."
            isHidden={currentStep !== 1}
          />
          <PerceptionStep
            canvasRef={threshRef}
            description="3. Apply thresholding to get a binary image."
            isHidden={currentStep !== 2}
          />
          <PerceptionStep
            canvasRef={digitsRef}
            description="4. Analyse white blobs to extract the digits."
            isHidden={currentStep !== 3}
          />
          <Button isDisabled={currentStep === 3} onClick={nextStepHandler}>
            {">"}
          </Button>
        </Flex>
      )}
    </>
  );
};

export default PerceptionPipeline;
