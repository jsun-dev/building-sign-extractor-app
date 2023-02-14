import React, { useEffect, useRef, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { insideBox, renderImage } from "../utils";
import DigitsOverlay from "../ui/DigitsOverlay";

const BoundingBoxes = (props) => {
  const [coords, setCoords] = useState(null);
  const [overlayPosition, setOverlayPosition] = useState(null);
  const [highlightedDigit, setHighlightedDigit] = useState(props.digitsText);
  const [isHover, setIsHover] = useState(false);

  const originalRef = useRef();
  const boxesRef = useRef();

  const hoverCanvasHandler = (e) => {
    setCoords({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setOverlayPosition({
      x: e.nativeEvent.pageX + 20 + "px",
      y: e.nativeEvent.pageY - 25 + "px",
    });
  };

  useEffect(() => {
    setIsHover(false);

    if (props.boxes) {
      const boxes = props.boxes;
      const image = props.currentImage;
      const digitsText = props.digitsText;

      renderImage(originalRef, image);
      renderImage(boxesRef, image);

      const ctx = boxesRef.current.getContext("2d");

      ctx.lineWidth = 2;
      if (coords !== null) {
        ctx.fillStyle = "rgba(0, 255, 0, 0.3)";

        if (insideBox(coords, boxes[0])) {
          ctx.fillRect(boxes[0].x, boxes[0].y, boxes[0].w, boxes[0].h);
          setHighlightedDigit(
            digitsText === "Recognizing..." ? digitsText : digitsText.charAt(0)
          );
          setIsHover(true);
        } else if (insideBox(coords, boxes[1])) {
          ctx.fillRect(boxes[1].x, boxes[1].y, boxes[1].w, boxes[1].h);
          setHighlightedDigit(
            digitsText === "Recognizing..." ? digitsText : digitsText.charAt(1)
          );
          setIsHover(true);
        } else if (insideBox(coords, boxes[2])) {
          ctx.fillRect(boxes[2].x, boxes[2].y, boxes[2].w, boxes[2].h);
          setHighlightedDigit(
            digitsText === "Recognizing..." ? digitsText : digitsText.charAt(2)
          );
          setIsHover(true);
        } else if (insideBox(coords, boxes[3])) {
          ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
          ctx.fillRect(boxes[3].x, boxes[3].y, boxes[3].w, boxes[3].h);
          setHighlightedDigit(digitsText);
          setIsHover(true);
        }
      }

      for (let i = 0; i < boxes.length - 1; i++) {
        ctx.strokeStyle = "rgb(0, 255, 0)";
        ctx.strokeRect(boxes[i].x, boxes[i].y, boxes[i].w, boxes[i].h);
      }

      ctx.strokeStyle = "rgb(255, 0, 0)";
      ctx.strokeRect(boxes[3].x, boxes[3].y, boxes[3].w, boxes[3].h);
    }
  }, [coords, props.boxes, props.digitsText]);

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
