let img;
let numSegments = 40;
let segments = [];
let drawSegments = true;
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};
let canvasAspectRatio = 0;
let perlinNoiseOffset = 20; // Offset for Perlin noise
let easing = 0.1; 

// Load the image and create segments
function preload() {
  img = loadImage('../p5project/asset/final1.jpg');
}

function setup() {
   // following the window width and height to create the canvas
  resizeCanvas(windowWidth, windowHeight);
  segments.forEach(function(segment){
    segment.calculateSegDrawProps();
  })

  imgDrwPrps.aspect = img.width / img.height; //get the aspect ratio of the image
  calculateImageDrawProps();

  let segmentWidth = img.width / numSegments; //get the width of the segment
  let segmentHeight = img.height / numSegments; //get the height of the segment

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

  // Calculate the drawing properties of the segments
  segments.forEach(function(segment) {
    segment.calculateSegDrawProps();
  })
}

// Draw the segments or the image
function draw() {
  background(50);

   // Draw the image
  if (drawSegments) {
    segments.forEach(function(segment) {
      segment.move();
      segment.draw();
    });
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

class ImageSegment {

  // Initialize the segment with its position and average colour
  constructor(columnPosition, rowPosition, srcImgSegColour) {
    this.columnPosition = columnPosition; //get the column position of the segment
    this.rowPosition = rowPosition; //get the row position of the segment
    this.srcImgSegColour = srcImgSegColour; //get the average colour of the segment
    this.drawXPos = 0; // X position to draw the segment
    this.drawYos = 0; // Y position to draw the segment
    this.drawWidth = 0; // Width of the segment
    this.drawHeight = 0; // Height of the segment
    this.timeOffset = random(100); // Time offset for Perlin noise
    this.targetXPos = 0; // Target X position
    this.targetYPos = 0; // Target Y position
  }

  // Calculate the drawing properties of the segment
  calculateSegDrawProps() {
    this.drawWidth = imgDrwPrps.width / numSegments; //get the width of the segment
    this.drawHeight = imgDrwPrps.height / numSegments; //get the height of the segment
    this.targetXPos = this.columnPosition * this.drawWidth + imgDrwPrps.xOffset; //get the target X position
    this.targetYPos = this.rowPosition * this.drawHeight + imgDrwPrps.yOffset; //get the target Y position
  }

  // Update the position of the segment based on Perlin noise and easing
  move() {
    const time = frameCount / 60; 
    const noiseScale = 0.1;
    const xOffset = noise(this.columnPosition * noiseScale + time + this.timeOffset) * perlinNoiseOffset;
    const yOffset = noise(this.rowPosition * noiseScale + time + this.timeOffset) * perlinNoiseOffset;
    this.targetXPos = this.columnPosition * this.drawWidth + imgDrwPrps.xOffset + xOffset; //get the new X position
    this.targetYPos = this.rowPosition * this.drawHeight + imgDrwPrps.yOffset + yOffset; //get the new Y position

    this.drawXPos += (this.targetXPos - this.drawXPos) * easing; //get X position with easing
    this.drawYos += (this.targetYPos - this.drawYos) * easing;  //get Y position with easing
  }

  // Draw the segment as a rectangle with the average colour of the segment
  draw() {
    noStroke();
    fill(this.srcImgSegColour);
    rect(this.drawXPos, this.drawYos, this.drawWidth - 7, this.drawHeight - 7); // Draw the segment
  }
}
