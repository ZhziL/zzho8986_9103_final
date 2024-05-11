let img;
let numSegments = 40;
let segments = [];
let drawSegments = true;
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};
let canvasAspectRatio = 0;
let perlinNoiseOffset = 20;

// Load the image and create segments
function preload() {
  img = loadImage('../p5project/asset/final1.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imgDrwPrps.aspect = img.width / img.height;
  calculateImageDrawProps();

  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;

  // Create segments
  for (let y = 0; y < numSegments; y++) {
    for (let x = 0; x < numSegments; x++) {
      let segXPos = x * segmentWidth;
      let segYPos = y * segmentHeight;
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      let segment = new ImageSegment(x, y, segmentColour);
      segments.push(segment);
    }
  }
  segments.forEach(segment => segment.calculateSegDrawProps());
}

// Draw the segments or the image
function draw() {
  background(50);
  if (drawSegments) {
    segments.forEach(segment => {
      segment.update();
      segment.draw();
    });
    drawConnections();
  } else {
    image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
  }
}

// Toggle the drawing of the segments
function keyPressed() {
  if (key === " ") {
    drawSegments = !drawSegments;
  }
}

// Resize the canvas and recalculate the drawing properties of the image
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateImageDrawProps();
  segments.forEach(segment => segment.calculateSegDrawProps());
}

// Calculate the drawing properties of the image
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

// Draw connections between segments
function drawConnections() {
  segments.forEach(segment => {
    // Connect to right and bottom neighbors only to avoid duplicates
    let rightNeighbor = segments.find(s => s.rowPosition === segment.rowPosition && s.columnPosition === segment.columnPosition + 1);
    let bottomNeighbor = segments.find(s => s.rowPosition === segment.rowPosition + 1 && s.columnPosition === segment.columnPosition);
    [rightNeighbor, bottomNeighbor].forEach(neighbor => {
      if (neighbor) {
        stroke(segment.srcImgSegColour);
        strokeWeight(2);
        line(segment.drawXPos + segment.drawWidth / 2, segment.drawYPos + segment.drawHeight / 2,
             neighbor.drawXPos + neighbor.drawWidth / 2, neighbor.drawYPos + neighbor.drawHeight / 2);
      }
    });
  });
}

class ImageSegment {

  // Initialize the segment with its position and average colour
  constructor(columnPosition, rowPosition, srcImgSegColour) {
    this.columnPosition = columnPosition;
    this.rowPosition = rowPosition;
    this.srcImgSegColour = srcImgSegColour;
    this.drawXPos = 0;
    this.drawYos = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
    this.timeOffset = random(100);
  }

  // Calculate the drawing properties of the segment
  calculateSegDrawProps() {
    this.drawWidth = imgDrwPrps.width / numSegments;
    this.drawHeight = imgDrwPrps.height / numSegments;
    this.drawXPos = this.columnPosition * this.drawWidth + imgDrwPrps.xOffset;
    this.drawYos = this.rowPosition * this.drawHeight + imgDrwPrps.yOffset;
  }

  // Update the position of the segment based on Perlin noise
  update() {
    const time = millis() / 1000;
    const noiseScale = 0.1;
    const xOffset = noise(this.columnPosition * noiseScale + time + this.timeOffset) * perlinNoiseOffset;
    const yOffset = noise(this.rowPosition * noiseScale + time + this.timeOffset) * perlinNoiseOffset;
    this.drawXPos = this.columnPosition * this.drawWidth + imgDrwPrps.xOffset + xOffset;
    this.drawYos = this.rowPosition * this.drawHeight + imgDrwPrps.yOffset + yOffset;
  }

  // Draw the segment as a circle with the average colour of the segment
  draw() {
    noStroke();
    fill(this.srcImgSegColour);
    // circle(this.drawXPos + this.drawWidth / 2, this.drawYos + this.drawHeight / 2, this.drawWidth);
    rect(this.drawXPos, this.drawYos, this.drawWidth - 5, this.drawHeight - 5);
  }
}
