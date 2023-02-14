export const renderImageData = (canvasRef, imageData) => {
  const ctx = canvasRef.current.getContext("2d");
  ctx.canvas.width = imageData.width;
  ctx.canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
};

export const renderImage = (canvasRef, image) => {
  const ctx = canvasRef.current.getContext("2d");
  ctx.canvas.width = image.width;
  ctx.canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
};

export const insideBox = (coords, box) => {
  const startX = box.x;
  const startY = box.y;
  const endX = box.x + box.w;
  const endY = box.y + box.h;
  return (
    coords.x >= startX &&
    coords.x <= endX &&
    coords.y >= startY &&
    coords.y <= endY
  );
};

export const displayToast = (
  toast,
  description,
  duration = 5000,
  position = "top-right",
  isClosable = true
) => {
  toast({
    description: description,
    duration: duration,
    position: position,
    isClosable: isClosable,
  });
};
