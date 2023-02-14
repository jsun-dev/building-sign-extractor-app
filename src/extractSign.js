import cv from "@techstark/opencv-js";

const getStandardDeviation = (array) => {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
};

const getImageData = (array, width, height) => {
  let rgba = new Uint8ClampedArray(4 * width * height);
  for (let i = 0; i < width * height; i++) {
    rgba[4 * i] = array[i];
    rgba[4 * i + 1] = array[i];
    rgba[4 * i + 2] = array[i];
    rgba[4 * i + 3] = 255;
  }
  return new ImageData(rgba, width, height);
};

const extractSign = (currentImage) => {
  let boxes = [];

  const img = cv.imread(currentImage);

  let gray = new cv.Mat();
  let blur = new cv.Mat();
  let thresh = new cv.Mat();

  cv.cvtColor(img, gray, cv.COLOR_RGB2GRAY);
  cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
  cv.threshold(blur, thresh, 0, 255, cv.THRESH_OTSU);

  let labels = new cv.Mat();
  let stats = new cv.Mat();
  let centroids = new cv.Mat();

  cv.connectedComponentsWithStats(thresh, labels, stats, centroids);

  let goodStats = [];

  for (let i = 0; i < stats.rows; i++) {
    let stat = stats.intPtr(i);
    let w = stat[cv.CC_STAT_WIDTH];
    let h = stat[cv.CC_STAT_HEIGHT];

    if (w < h && w >= 5 && w <= 45 && h >= 15 && h <= 65) {
      goodStats.push(stat);
    }
  }

  let digits = cv.Mat.zeros(thresh.rows, thresh.cols, cv.CV_8UC1);

  for (let i = 0; i < goodStats.length - 2; i++) {
    let candidates = goodStats.slice(i, i + 3);
    let yCoords = candidates.map((candidate) => candidate[cv.CC_STAT_TOP]);
    let yCoordsStd = getStandardDeviation(yCoords);
    let heights = candidates.map((candidate) => candidate[cv.CC_STAT_HEIGHT]);
    let heightsStd = getStandardDeviation(heights);

    if (yCoordsStd < 10 && heightsStd < 5) {
      candidates.sort((a, b) => a[cv.CC_STAT_LEFT] - b[cv.CC_STAT_LEFT]);

      for (let j = 0; j < candidates.length; j++) {
        let x = candidates[j][cv.CC_STAT_LEFT];
        let y = candidates[j][cv.CC_STAT_TOP];
        let w = candidates[j][cv.CC_STAT_WIDTH];
        let h = candidates[j][cv.CC_STAT_HEIGHT];

        let rect = new cv.Rect(x, y, w, h);
        let sample = thresh.roi(rect);
        sample.copyTo(digits.roi(rect));

        boxes.push({ x: x, y: y, w: w, h: h });
      }

      break;
    }
  }

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    digits,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  let mergedContours = new cv.Mat();
  cv.vconcat(contours, mergedContours);

  let rect = cv.boundingRect(mergedContours);

  let wOffset = Math.trunc(rect.width * 0.25);
  let hOffset = Math.trunc(rect.height * 0.5);
  let x = rect.x - wOffset;
  let y = rect.y - hOffset;
  let w = rect.width + 2 * wOffset;
  let h = rect.height + 2 * hOffset;
  boxes.push({ x: x, y: y, w: w, h: h });

  let digitsDst = new cv.Mat();
  cv.threshold(digits, digitsDst, 0, 255, cv.THRESH_BINARY_INV);

  let digitsRoi = [];
  for (let i = y; i < y + h; i++) {
    let row = digitsDst.ucharPtr(i);
    for (let j = x; j < x + w; j++) {
      digitsRoi.push(row[j]);
    }
  }

  return {
    boxes: boxes,
    gray: getImageData(gray.data, gray.cols, gray.rows),
    blur: getImageData(blur.data, blur.cols, blur.rows),
    thresh: getImageData(thresh.data, thresh.cols, thresh.rows),
    digits: getImageData(digits.data, digits.cols, digits.rows),
    digitsRoi: getImageData(digitsRoi, w, h),
  };
};

export default extractSign;
