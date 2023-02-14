import React, { useState, useEffect, useRef } from "react";
import extractSign from "./extractSign";
import { renderImageData } from "./utils";

import ImageModal from "./ui/ImageModal";

import cv from "@techstark/opencv-js";
import Tesseract from "tesseract.js";

import {
  Button,
  Flex,
  useToast,
  Text,
  Link,
  Box,
  Heading,
  Container,
} from "@chakra-ui/react";
import BoundingBoxes from "./components/BoundingBoxes";
import PerceptionPipeline from "./components/PerceptionPipeline";
import CropTool from "./components/CropTool";
import FeatureTabs from "./ui/FeatureTabs";
import GitHubIcon from "./ui/GitHubIcon";

const App = () => {
  const toast = useToast();

  const [currentImage, setCurrentImage] = useState(null);
  const [isOCR, setIsOCR] = useState(false);
  const [digitsText, setDigitsText] = useState("Recognizing...");
  const [result, setResult] = useState(null);
  const [boxes, setBoxes] = useState(null);
  const [cropBox, setCropBox] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageSource = useRef();
  const ocrRef = useRef();

  const features = [
    {
      title: "Bounding Boxes",
      component: (
        <BoundingBoxes
          currentImage={currentImage}
          boxes={boxes}
          digitsText={digitsText}
        />
      ),
    },
    {
      title: "Perception Pipeline",
      component: <PerceptionPipeline result={result} />,
    },
    {
      title: "Crop Tool",
      component: (
        <CropTool
          currentImage={currentImage}
          cropBox={cropBox}
          setCropBox={setCropBox}
        />
      ),
    },
  ];

  const clickImageHandler = (e) => {
    if (!currentImage || currentImage.src !== e.target.src) {
      setDigitsText("Recognizing...");
      let image = new Image();
      image.src = e.target.src;

      setCurrentImage(image);
      setIsOCR(true);
      setBoxes(null);
      toast({
        description: "Recognizing the digits...",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }

    setIsModalOpen(false);
  };

  const openModalHandler = () => {
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (currentImage) {
      const img = cv.imread(currentImage);
      const result = extractSign(img);

      renderImageData(ocrRef, result.digitsRoi);

      const ctx = ocrRef.current.getContext("2d");
      Tesseract.recognize(ctx.canvas.toDataURL("image/png"), "eng").then(
        (result) => {
          setDigitsText(result.data.text);
          setIsOCR(false);
          toast({
            description: "The digits have been successfully recognized!",
            duration: 5000,
            position: "top-right",
            isClosable: true,
          });
        }
      );

      setResult(result);
      setBoxes(result.boxes);
    }
  }, [currentImage]);

  return (
    <Flex m="20px" direction="column">
      <canvas ref={ocrRef} hidden />
      <ImageModal
        isModalOpen={isModalOpen}
        closeModalHandler={closeModalHandler}
        clickImageHandler={clickImageHandler}
      />
      <Link
        href="https://github.com/jsun-dev/building-sign-extractor-app"
        isExternal
        position="absolute"
      >
        <Button leftIcon={<GitHubIcon />} variant="outline">
          View on GitHub
        </Button>
      </Link>
      <Flex direction="column" alignItems="center">
        <Heading as="h1">Building Sign Extractor</Heading>
        <Text fontSize="sm" mt="10px">
          A building sign extractor developed with traditional computer vision
          algorithms.
        </Text>
        <Text fontSize="sm">
          Powered by OpenCV.js, Tesseract.js, Chakra UI, and React.
        </Text>
        <Button onClick={openModalHandler} isDisabled={isOCR} mt="10px">
          Choose an image
        </Button>
      </Flex>
      {currentImage && <FeatureTabs features={features} />}
    </Flex>
  );
};

export default App;
