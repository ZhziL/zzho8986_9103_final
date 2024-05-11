# zzho8986_9103_final

## Instructions of Coding
This coding using  Perlin Noise Generator from [Github Repositories](https://github.com/joeiddon/perlin), all of the point will be randomly move in a limit area and randomlly change the radius. But the colour would be using p5.js to getting each segment centre's color, to make sure using Perlin Noise would still showing the image by using random points.

## Details of individual approach to animating the group code
By obtaining the segment that the group code has been prepared, perform secondary editing. Perlin noise randomness is used, including easing, which extracts colour from each segment, and then moves randomly within the range and randomly moves the size. You can achieve random ranges of size by changing this piece of code:

```
  draw() {
    stroke(0);
    
    let dynamicRadius = radius + random(-7, 7);  
    // dynamic radius, change -7 & 7 to control the area that point change.

    fill(this.srcImgSegColour);
    circle(this.drawXPos, this.drawYPos, dynamicRadius);
  }
```
Only need to chang the 'dynamicRadius' random(-7, 7), which is the range of the radius change, then it can achieve how big/small that you want to change of the points.
  
This feature also supports future modifications, such as adjusting size, position, or colour based on audio, time, or other operations. To make these custom changes, simply link to additional functions or objects within this function to retrieve the necessary data.
  