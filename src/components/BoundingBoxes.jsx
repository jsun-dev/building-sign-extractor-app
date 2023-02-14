import React, { useEffect, useRef, useState } from "react";
import { Flex } from "@chakra-ui/react";

import DigitsOverlay from "../ui/DigitsOverlay";
import { insideBox, renderImage } from "../utils";

const BoundingBoxes = (props) => {
  const [mouseCoords, setMouseCoords] = useState(null);
  const [overlayPosition, setOverlayPosition] = useState(null);
  const [highlightedDigit, setHighlightedDigit] = useState(props.digitsText);
  const [isHover, setIsHover] = useState(false);

  const originalRef = useRef();
  const boxesRef = useRef();

  useEffect(() => {
    setIsHover(false);

    const boxes = props.boxes;
    if (boxes) {
      const image = props.currentImage;
      const digitsText = props.digitsText;

      renderImage(originalRef, image);
      renderImage(boxesRef, image);

      const ctx = boxesRef.current.getContext("2d");
      ctx.lineWidth = 2;

      if (mouseCoords !== null) {
        ctx.fillStyle = "rgba(0, 255, 0, 0.3)";

        if (insideBox(mouseCoords, boxes[0])) {
          ctx.fillRect(boxes[0].x, boxes[0].y, boxes[0].w, boxes[0].h);
          setIsHover(true);
          setHighlightedDigit(
            digitsText === "Recognizing..." ? digitsText : digitsText.charAt(0)
          );
        } else if (insideBox(mouseCoords, boxes[1])) {
          ctx.fillRect(boxes[1].x, boxes[1].y, boxes[1].w, boxes[1].h);
          setIsHover(true);
          setHighlightedDigit(
            digitsText === "Recognizing..." ? digitsText : digitsText.charAt(1)
          );
        } else if (insideBox(mouseCoords, boxes[2])) {
          ctx.fillRect(boxes[2].x, boxes[2].y, boxes[2].w, boxes[2].h);
          setIsHover(true);
          setHighlightedDigit(
            digitsText === "Recognizing..." ? digitsText : digitsText.charAt(2)
          );
        } else if (insideBox(mouseCoords, boxes[3])) {
          ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
          ctx.fillRect(boxes[3].x, boxes[3].y, boxes[3].w, boxes[3].h);
          setIsHover(true);
          setHighlightedDigit(digitsText);
        }
      }

      for (let i = 0; i < boxes.length - 1; i++) {
        ctx.strokeStyle = "rgb(0, 255, 0)";
        ctx.strokeRect(boxes[i].x, boxes[i].y, boxes[i].w, boxes[i].h);
      }

      ctx.strokeStyle = "rgb(255, 0, 0)";
      ctx.strokeRect(boxes[3].x, boxes[3].y, boxes[3].w, boxes[3].h);
    }
  }, [mouseCoords, props.boxes, props.digitsText]);

  const hoverCanvasHandler = (e) => {
    setMouseCoords({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setOverlayPosition({
      x: e.nativeEvent.pageX + 20 + "px",
      y: e.nativeEvent.pageY - 25 + "px",
    });
  };

  return (
    <>
      <DigitsOverlay
        enabled={isHover}
        overlayPosition={overlayPosition}
        text={highlightedDigit}
      />
      <Flex justifyContent="center" gap="20px">
        {props.currentImage && <canvas ref={originalRef} />}
        {props.currentImage && (
          <canvas ref={boxesRef} onMouseMove={hoverCanvasHandler} />
        )}
      </Flex>
    </>
  );
};

export default BoundingBoxes;
