import React, { useState, useEffect, useRef } from "react";
import { Flex } from "@chakra-ui/react";
import { renderImage } from "../utils";

const CropTool = (props) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState(null);

  const drawRef = useRef();
  const cropRef = useRef();

  useEffect(() => {
    const image = props.currentImage;

    if (image !== null) {
      const cropBox = props.cropBox;
      const canvasWidth = image.width;
      const canvasHeight = image.height;

      renderImage(drawRef, image);

      const drawCtx = drawRef.current.getContext("2d");
      const cropCtx = cropRef.current.getContext("2d");
      cropCtx.canvas.width = canvasWidth;
      cropCtx.canvas.height = canvasHeight;

      if (cropBox !== null) {
        if (cropBox.w > 0 && cropBox.h > 0) {
          const imageData = drawCtx.getImageData(
            cropBox.x,
            cropBox.y,
            cropBox.w,
            cropBox.h
          );
          cropCtx.putImageData(imageData, cropBox.x, cropBox.y);
        }

        drawCtx.fillStyle = "rgba(0, 0, 0, 0.7)";

        drawCtx.fillRect(0, 0, canvasWidth, cropBox.y);
        drawCtx.fillRect(0, cropBox.y, cropBox.x, cropBox.h);
        drawCtx.fillRect(
          cropBox.x + cropBox.w,
          cropBox.y,
          canvasWidth - (cropBox.x + cropBox.w),
          cropBox.h
        );
        drawCtx.fillRect(
          0,
          cropBox.y + cropBox.h,
          canvasWidth,
          canvasHeight - (cropBox.y + cropBox.h)
        );

        drawCtx.strokeStyle = "white";
        drawCtx.lineWidth = 2;
        drawCtx.setLineDash([12]);
        drawCtx.strokeRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);
      }
    }
  }, [props.currentImage, props.cropBox]);

  const drawStartHandler = (e) => {
    setIsDrawing(true);
    setStartCoords({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const drawStopHandler = () => {
    setIsDrawing(false);
  };

  const drawHandler = (e) => {
    if (isDrawing) {
      let x = startCoords.x;
      let y = startCoords.y;

      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;
      const w = endX - x;
      const h = endY - y;

      x = w < 0 ? endX : x;
      y = h < 0 ? endY : y;

      props.setCropBox({ x: x, y: y, w: Math.abs(w), h: Math.abs(h) });
    }
  };

  return (
    <Flex justifyContent="center" gap="20px">
      {props.currentImage && (
        <canvas
          ref={drawRef}
          onMouseDown={drawStartHandler}
          onMouseUp={drawStopHandler}
          onMouseMove={drawHandler}
        />
      )}
      {props.currentImage && <canvas ref={cropRef} />}
    </Flex>
  );
};

export default CropTool;
