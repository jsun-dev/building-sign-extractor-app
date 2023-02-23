import React, { useState, useEffect, useRef } from "react";
import { useToast, Button, Flex, Text, Link } from "@chakra-ui/react";
import Tesseract from "tesseract.js";

import BoundingBoxes from "./components/BoundingBoxes";
import PerceptionPipeline from "./components/PerceptionPipeline";
import CropTool from "./components/CropTool";
import ImageModal from "./ui/ImageModal";
import FeatureTabs from "./ui/FeatureTabs";
import GitHubIcon from "./ui/GitHubIcon";
import { displayToast, renderImageData } from "./utils";
import extractSign from "./extractSign";

const App = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOcr, setIsOcr] = useState(false);
  const [digitsText, setDigitsText] = useState("Recognizing...");
  const [extractResult, setExtractResult] = useState(null);
  const [boxes, setBoxes] = useState(null);
  const [cropBox, setCropBox] = useState(null);

  const toast = useToast();
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
      component: <PerceptionPipeline extractResult={extractResult} />,
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

  useEffect(() => {
    if (currentImage !== null) {
      const result = extractSign(currentImage);
      renderImageData(ocrRef, result.digitsRoi);

      const ctx = ocrRef.current.getContext("2d");
      Tesseract.recognize(ctx.canvas.toDataURL("image/png"), "eng").then(
        (result) => {
          setDigitsText(result.data.text);
          setIsOcr(false);
          displayToast(toast, "The digits have been successfully recognized!");
        }
      );

      setExtractResult(result);
      setBoxes(result.boxes);
    }
  }, [currentImage]);

  const openModalHandler = () => {
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  const clickImageHandler = (e) => {
    if (currentImage === null || currentImage.src !== e.target.src) {
      let image = new Image();
      image.src = e.target.src;

      setCurrentImage(image);
      setDigitsText("Recognizing...");
      setIsOcr(true);
      setBoxes(null);
      setCropBox(null);
      displayToast(toast, "Recognizing the digits...");
    }

    setIsModalOpen(false);
  };

  return (
    <Flex m="20px" direction="column">
      <canvas ref={ocrRef} hidden />
      <ImageModal
        isModalOpen={isModalOpen}
        clickImageHandler={clickImageHandler}
        closeModalHandler={closeModalHandler}
      />
      <Link
        href="https://github.com/jsun-dev/building-sign-extractor-app"
        position="absolute"
        isExternal
      >
        <Button leftIcon={<GitHubIcon />} variant="outline">
          View on GitHub
        </Button>
      </Link>
      <Flex direction="column" alignItems="center">
        <Text fontSize="4xl" as="b">
          Building Sign Extractor
        </Text>
        <Text fontSize="sm" mt="10px">
          A building sign extractor developed with traditional computer vision
          algorithms.
        </Text>
        <Text fontSize="sm">
          Powered by OpenCV.js, Tesseract.js, Chakra UI, and React.
        </Text>
        <Button onClick={openModalHandler} isDisabled={isOcr} mt="10px">
          Choose an image
        </Button>
      </Flex>
      {currentImage && <FeatureTabs features={features} />}
    </Flex>
  );
};

export default App;
