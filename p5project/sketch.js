// We need a variable to hold our image
let img;

// We will divide the image into segments
let numSegments = 20;

// We will store the segments in an array
let segments = [];

// Array to store circle objects
let circles = [];

// Let's add a variable to switch between drawing the image and the segments
let drawSegments = true;

// Let's make an object to hold the draw properties of the image
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};

// And a variable for the canvas aspect ratio
let canvasAspectRatio = 0;

let radius = 15;

// Global variables for noise scale and offset
let noiseScale = 0.3;
let noiseSpeed = 0.01;

// Let's load the image from disk
function preload() {
  img = loadImage('../p5project/asset/Mona_Lisa.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imgDrwPrps.aspect = img.width / img.height;
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;

  let positionInColumn = 0;
  for (let segYPos = 0; segYPos < img.height; segYPos += segmentHeight) {
    let positionInRow = 0;
    for (let segXPos = 0; segXPos < img.width; segXPos += segmentWidth) {
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      let segment = new ImageSegment(positionInColumn, positionInRow, segmentColour);
      segments.push(segment);
      positionInRow++;
    }
    positionInColumn++;
  }
  for (const segment of segments) {
    segment.calculateSegDrawProps();
  }
}

function draw() {
  background(10);
  if (drawSegments) {
    for (const segment of segments) {
      segment.calculateSegDrawProps(); // Recalculate properties with noise
      segment.draw();
    }
  } else {
    image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
  }
}

function keyPressed() {
  if (key == " ") {
    drawSegments = !drawSegments;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateImageDrawProps();
  for (const segment of segments) {
    segment.calculateSegDrawProps();
  }
}

function calculateImageDrawProps() {
  canvasAspectRatio = width / height;
  if (imgDrwPrps.aspect > canvasAspectRatio) {
    imgDrwPrps.width = width;
    imgDrwPrps.height = width / imgDrwPrps.aspect;
    imgDrwPrps.yOffset = (height - imgDrwPrps.height) / 2;
    imgDrwPrps.xOffset = 0;
  } else if (imgDrwPrps.aspect < canvasAspectRatio) {
    imgDrwPrps.height = height;
    imgDrwPrps.width = height * imgDrwPrps.aspect;
    imgDrwPrps.xOffset = (width - imgDrwPrps.width) / 2;
    imgDrwPrps.yOffset = 0;
  } else {
    imgDrwPrps.width = width;
    imgDrwPrps.height = height;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = 0;
  }
}

class ImageSegment {
  constructor(columnPositionInPrm, rowPositionInPrm, srcImgSegColourInPrm) {
    this.columnPosition = columnPositionInPrm;
    this.rowPosition = rowPositionInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
    this.drawXPos = 0;
    this.drawYPos = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
    // Noise offset for organic movement
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }

  calculateSegDrawProps() {
    this.drawWidth = imgDrwPrps.width / numSegments;
    this.drawHeight = imgDrwPrps.height / numSegments;
    // Incorporate noise in position calculations for dynamic movement
    this.drawXPos = (this.rowPosition + 0.5 + noise(this.noiseOffsetX) * 2 - 1) * this.drawWidth + imgDrwPrps.xOffset;
    this.drawYPos = (this.columnPosition + 0.5 + noise(this.noiseOffsetY) * 2 - 1) * this.drawHeight + imgDrwPrps.yOffset;
    // Update noise offsets for smooth transitions
    this.noiseOffsetX += noiseSpeed;
    this.noiseOffsetY += noiseSpeed;
  }

  draw() {
    stroke(0);
    let dynamicRadius = radius + random(-5, 5); // Randomness in circle size
    fill(this.srcImgSegColour);
    circle(this.drawXPos, this.drawYPos, dynamicRadius);
  }
}
