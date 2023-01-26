const purple = tinycolor("#313558").toHsl();
const silver = tinycolor("#b2b4c9").toHsl();
const stars = tinycolor("#686f9b").toHsl();
let noiseVal;
let noiseScale = 0.02;

function setup () {
  // print or save size
  createCanvas(8000, 12000);
  colorMode(HSB, 360, 1, 1, 1);
  angleMode(DEGREES);
  noLoop();
}

const modulateColor = (baseColor, hRange, sRange, lRange) => {
  const random = (min, max) => Math.random() * (max - min) + min;

  return {
    h: baseColor.h + random(-hRange, hRange),
    s: baseColor.s * 100 + random(-sRange, sRange),
    l: baseColor.l * 100 + random(-lRange, lRange)
  };
};

const modulatedColorString = (
  baseColor,
  hRange = 8,
  sRange = 8,
  lRange = 8
) => {
  const modulatedColor = modulateColor(baseColor, hRange, sRange, lRange);

  return tinycolor(modulatedColor).toHslString();
};

const lerpPoints = (point1, point2, step) => {
  const x = lerp(point1.x, point2.x, step);
  const y = lerp(point1.y, point2.y, step);
  
  return {x, y};
}

const drawTriangle = (pointA, pointB, pointC, step) => {
  triangle(
    pointA.x,
    pointA.y,
    pointB.x,
    pointB.y,
    pointC.x,
    pointC.y
  );
  
  if (step > 1) {
    const newPointA = lerpPoints(pointA, pointB, 0.1);
  const newPointB = lerpPoints(pointB, pointC, 0.1);
  const newPointC = lerpPoints(pointC, pointA, 0.1);
    
    step = step - 1;
    drawTriangle(newPointA, newPointB, newPointC, step);
  }
}

const createGrid = (gap) => {
  let edge;
  let odd = false;
  let edges = [];
  
  for(let y = gap / 2; y <= height; y += gap) {
    odd = !odd;
    edge = [];
    
    for(let x = gap / 2; x <= width + (gap * 3); x += gap) {
      edge.push({
        x: x + (Math.random() * 0.8 - 0.4) * gap + (odd ? gap / 2 : 0),
        y: y + (Math.random() * 0.8 - 0.4) * gap
      });
    }
    edges.push(edge);
  }
  
  let dotLine;
  odd = true;
  
  for(let y = 0; y < edges.length - 1; y++) {
    odd = !odd;
    dotLine = [];
    
    for(let i = 0; i < edges[y].length; i++) {
      dotLine.push(odd ? edges[y][i] : edges[y + 1][i]);
      dotLine.push(odd ? edges[y + 1][i] : edges[y][i]);
    }
    
    for(let i = 0; i < dotLine.length - 2; i++) {
      drawTriangle(dotLine[i], dotLine[i + 1], dotLine[i + 2], 20);
    }
  }
}

const createFog = (x, y, width, height, seed) => {
  noFill();
  const bottom = color(0, 0, 1);
  const top = color(0, 0, 1, 0);
  
  for(let i = y; i <= y + height; i++) {
    const inter = map(i, y, y + height, 0, 1);
    const color = lerpColor(top, bottom, inter);
    stroke(color);
    beginShape();
    for(let j = x; j <= x + width; j++) {
      const nx = map(j, 0, width, 0, 5 * seed);
      const ny = i + y * noise(nx);
      
      vertex(j, ny);
    }
    endShape();
  }
}

function draw () {
  // background
  noStroke();
  fill("#222546");
  rect(0, 0, width, height);
  
  // stars
  for (let y = 0; y <= height; y += 13) {
    for (let x = 0; x <= width; x += 13) {
      noiseDetail(2, 0.2);
      noiseVal = noise(x * noiseScale, y * noiseScale);
      
      if(noiseVal > 0.4) {
        fill(color(modulatedColorString(stars)));
        circle(x * (random() + 1), y * (random() + 1), random(3, 8));
      }
    }
  }
  
  // moon
  push();
  translate(width / 2, height / 3);
  noFill();
  const radius = width * 0.25;
  
  for(let i = 0; i < 1024; i++) {
    const modulatedColor = modulatedColorString(silver);
    stroke(color(modulatedColor));
    
    const angle1 = abs(randomGaussian(360, 10));
    const angle2 = abs(randomGaussian(360, 10));
    const x1 = cos(radians(i * angle1)) * radius;
    const y1 = sin(radians(i * angle1)) * radius;
    const x2 = sin(radians(i * angle2)) * radius;
    const y2 = cos(radians(i * angle2)) * radius;
    line(x1, y1, x2, y2);
  }
  pop();
  
  // mountains
  let gap = width / 13;
  let step = height / 10;
 
  push();
  stroke(color(tinycolor(purple)
     .lighten(30)
     .desaturate(15)
     .spin(-30)
     .toHslString()));
  fill(color(tinycolor(purple)
     .lighten(40)
     .desaturate(15)
     .spin(-30)
     .toHslString()));
  translate(-gap * 1.5, height * 0.66 - step);
  createGrid(gap);
  pop();

  createFog(0, height * 0.4, width, height, random(-1, 1));
  
  push();
  stroke(color(tinycolor(purple)
     .lighten(20)
     .desaturate(10)
     .spin(-20)
     .toHslString()));
  fill(color(tinycolor(purple)
     .lighten(30)
     .desaturate(10)
     .spin(-20)
     .toHslString()));
  translate(-gap * 1.5, height * 0.66);
  createGrid(gap);
  pop();
  
  createFog(0, height * 0.4 + step, width, height, random(-1, 1));
  
  push();
  stroke(color(tinycolor(purple)
     .lighten(10)
     .desaturate(5)
     .spin(-10)
     .toHslString()));
  fill(color(tinycolor(purple)
     .lighten(20)
     .desaturate(5)
     .spin(-10)
     .toHslString()));
  translate(-gap * 1.5, height * 0.66 + step);
  createGrid(gap);
  pop();
  
  createFog(0, height * 0.4 + step * 2, width, height, random(-1, 1));
  
  push();
  stroke(color(tinycolor(purple)
     .toHslString()));
  fill(color(tinycolor(purple)
     .lighten(10)
     .toHslString()));
  translate(-gap * 1.5, height * 0.66 + step * 2);
  createGrid(gap);
  pop();
  
  createFog(0, height * 0.4 + step * 3, width, height, random(-1, 1));
}