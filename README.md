# zzho8986_9103_final

## Instructions of Coding
This coding using  Perlin Noise Generator from [Github Repositories](https://github.com/joeiddon/perlin), all of the point will be randomly move in a limit area and randomlly change the radius. But the colour would be using p5.js to getting each segment centre's color, to make sure using Perlin Noise would still showing the image by using random points.

Because it was completed before the tutorial part, I searched and learned on GitHub and referenced an online js document through HTML (this ensures that the document is not local, even if you switch to different devices) also be displayed usually), and then use Perlin noise inside the p5.js document. This part designed a class named ImageSegment, which has four functions: getting the colour for each segment, calculating the size and position, setting the position and speed, and drawing the segment. Regarding the part that adapts to the screen, in the setup() function at the top, get the windowWidth and windowHeight to keep it centred.


## Details of individual approach to animating the group code
The code mainly uses Perlin Noise to obtain random quantities and then inserts them into x and y. Different from other team members, this one has a function that allows the rectangle to move irregularly and randomly.

## Inspiration
The source of inspiration mainly combines the segments learned in week 7 and week 10, part 4 using Perlin noise random numbers to create random & smooth movements. I reduced each segment and tried different shapes and methods. Finally, I put each segment into the array,  used Perlin noise random numbers to position each segment's x & y, and then used Perlin noise to make each segment move randomly. After controlling the quantity and size, the effect is as expected. Regarding size, colour, etc., it was mainly considered that other team members might use this function, so there was no random size transformation, and only the smooth movement of random x and y points was designed. In this way, other team members may be able to change the width and height to achieve other effects.

![Week 10 tut photo](/image/wk10.gif)
<img src="/image/wk10.gif" alt="Week 10 tut photo" width="300" height="200">

Week 10 tutorial part 4

![Week 7 tut photo](/image/wk7.png)
Week 7 tutorial

*If one needs to change the width and height, the way is the same as changing the x-coordinate and y-coordinate, implanting a random number of Perlin noises, and then smoothly increasing or decreasing the size.*

## Iteration
Regarding iterative design, because the Perlin Noise part was completed earlier, this part of the iteration is incomplete. However, there are only some screenshots because of communication with the team members. The initial idea was to use Emily Kame Kngwarreye's 'Ntange II (Grass)' combined with circles to design, but later found that the displayed effect was not good (probably because the overall tone is similar, it is difficult to see when the result is output) is this painting). Later, I switched the artwork to the 'Wheels of fortune' by Pacita Abad, which I have chosen now. I used several shapes, including the previous circle, and finally found a square shape with reduced side lengths, which can naturally show the design of the original work. The content to be realized mainly revolves around the original circle design, whose radius can be changed. However, considering that the team members may need to adjust the radius through the sound obtained, the design of random radius length was canceled at a later stage. Later, the final output effect was changed to a square (of course, the segments can also be scaled by changing the width and height of the square)
![Iteration 1](/image/iteration1.png)
![Iteration 2](/image/iteration2.png)


## Code analysis
By obtaining the segment that the group code has been prepared, perform secondary editing. Perlin noise randomness is used, including easing, which extracts colour from each segment and then moves randomly within the range and randomly moves the size. You can achieve random ranges of area of moving and speed by changing this variable:

```
  let perlinNoiseOffset = 25;
```
*It is set here to 25, which mainly sets the range of movement. This range has been tested and cannot exceed 50. When it exceeds 50, the original image will not be visible in the generated random movement, and because the range becomes more extensive, there will be an overall offset. (There is no problem with the code itself, but because the range becomes more extensive, the movable range of each segment also becomes more extensive, and the whole may visually shift)*

#### Main functional explanation and implementation logic
The entire design is implemented through the class below to make the rectangle move (the code below is also taken from the function in this class). anyway, to be easy to say, the position information of x and y is randomly calculated through Perlin noise and smoothed through an easing move.
```
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
```

In the last draw() function, the square subjected to Perlin noise is redrawn. This line of code draws the x, y, width and height of the rectangle, and the ’-7‘ in the width and height parts here are to allow the graphics to move without too much overlap.
```
rect(this.drawXPos, this.drawYos, this.drawWidth - 7, this.drawHeight - 7);
```
*This feature also supports future modifications by group members, such as adjusting block size, colour, or position based on audio, time, or obtaining mouse position. To make these custom changes, simply link the quantification obtained by other functions into this function to retrieve the necessary data.*

The rectangle mentioned above contains x and y information from the code below. This code uses Perlin Noise and easing to calculate all rectangles' position and target position and achieve smooth movement.

```
move() {
  const time = frameCount / 60;
  const noiseScale = 0.1;
  const xOffset = noise(this.columnPosition * noiseScale + time + this.timeOffset) * perlinNoiseOffset;
  const yOffset = noise(this.rowPosition * noiseScale + time + this.timeOffset) * perlinNoiseOffset;
  this.targetXPos = this.columnPosition * this.drawWidth + imgDrwPrps.xOffset + xOffset;
  this.targetYPos = this.rowPosition * this.drawHeight + imgDrwPrps.yOffset + yOffset;

  this.drawXPos += (this.targetXPos - this.drawXPos) * easing;
  this.drawYos += (this.targetYPos - this.drawYos) * easing;
}
```

