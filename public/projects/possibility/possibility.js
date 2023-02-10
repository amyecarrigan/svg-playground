// HT: @deconbatch
// https://www.deconbatch.com/2020/02/aquarius.html

let colors = [
  "#020234",
  "#141154",
  "#2a2067",
  "#35256e",
  "#2e226c",
  "#181460",
  "#040347",
  "#20134b",
  "#4b2965",
  "#6b366c",
  "#763d72",
  "#6d3773",
  "#502c6a",
  "#251556",
  "#6d2650",
  "#a64662",
  "#d85f68",
  "#f17166",
  "#e46669",
  "#b04967",
  "#6f2854",
  "#f9a34e",
  "#f8e958",
  "#fcfb55",
  "#ffffcc",
  "#080524",
  "#050424",
  "#060320",
  "#0e0520",
  "#1b0b25",
  "#2f1b50",
  "#1c0937",
  "#0e1156",
  "#0a0e4b",
  "#03031d",
  "#08082c",
  "#07041f",
  "#040420",
  "#0b0a29",
  "#02021e",
  "#030422",
  "#030420",
  "#03031f",
  "#02021c",
  "#01011d",
  "#fcd1a7"
];

colors = colors.map((color) => tinycolor(color).toHsl());
colors = colors.sort((a, b) => {
  return b.l - a.l;
});
colors = colors.map((color) => tinycolor(color).toHslString());

let starMax, stars, sunDiameter;

function setup() {
  // print or save size
  createCanvas(2732, 2048);
  colorMode(HSB, 360, 100, 100, 1);
  background(colors[colors.length - 1]);
  noLoop();

  starMax = 1024;
  stars = createVector(starMax);

  for (let i = 0; i < starMax; i++) {
    if (i < starMax * 0.5) {
      const sY = map(i, 0, starMax * 0.5, -height * 0.35, height * 1.35);
      stars[i] = createVector(random(-width * 0.35, width * 1.35), sY);
    } else {
      const sX = map(i, 0, starMax * 0.5, -width * 0.35, width * 1.35);
      stars[i] = createVector(sX, random(-height * 0.35, height * 1.35));
    }
  }
  
  sunDiameter = 150;

  // scale canvas to fit on screen
  const canvasElement = document.querySelector(".p5Canvas");
  const canvasRatio = canvasElement.height / canvasElement.width;
  const windowRatio = window.innerHeight / window.innerWidth;
  let cssHeight;
  let cssWidth;

  if (windowRatio < canvasRatio) {
    cssHeight = window.innerHeight;
    cssWidth = cssHeight / canvasRatio;
  } else {
    cssWidth = window.innerWidth;
    cssHeight = cssWidth * canvasRatio;
  }

  canvasElement.style.width = `${cssWidth * 0.75}px`;
  canvasElement.style.height = `${cssHeight * 0.75}px`;
}

function draw() {
  blendMode(NORMAL);
  background(colors[colors.length - 1]);

  noStroke();
  blendMode(ADD);

  let starBrightness;
  for (let starCount = 0; starCount < starMax; starCount++) {
    const starRatio = map(starCount, 0, starMax, 0.0, 1.0);
    const starNoise = map(noise(starRatio), 0.0, 1.0, -1.0, 1.0);
    const locationNoise = map(
      noise(stars[starCount].x / width, stars[starCount].y / height),
      0.0,
      1.0,
      -1.0,
      1.0
    );
    
    const sizeRatio = sin(TWO_PI * (starNoise * 2));

    stars[starCount].x -=
      0.5 *
      (cos(TWO_PI * starRatio) * 0.2 +
        locationNoise +
        starNoise);
    stars[starCount].y +=
      0.5 *
      (sin(TWO_PI * starRatio) * 0.2 +
        locationNoise +
        starNoise);

    const starSize = map(sizeRatio, -1.0, 1.0, 2.0, 8.0);
    starBrightness = map(sizeRatio, -1.0, 1.0, 0.4, 0.1);
    const starColor = tinycolor(colors[0]).setAlpha(starBrightness).toHslString();

    fill(starColor);
    ellipse(stars[starCount].x, stars[starCount].y, starSize);
  }

  noFill();
  strokeWeight(3.0);
  const strokeColor = tinycolor(colors[0]).setAlpha(starBrightness).toHslString();
  stroke(strokeColor);
  for(let i = 0; i < starMax - 1; i++) {
    for(let j = i + 1; j < starMax; j++) {
      const d = dist(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
      if(d > 20 && d < 50) {
        line(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
      }
    }
  }
  
  push();
  
  translate(width / 2, height / 8);
  
  blendMode(ADD);
  noFill();
  
  const p = PI / starMax;
  let j = 0;
  
  for(let i = 0; i < TAU + p; i+=p) {
    strokeWeight(1);
    stroke(tinycolor(strokeColor).setAlpha(random(0.01, 0.05)).toHslString());
    
    const eclipseNoise = noise(i, j / 77);
    
    line(sin(i + eclipseNoise) * 100, cos(i + eclipseNoise) * 100, sunDiameter + sin(i + eclipseNoise) * width, sunDiameter + cos(i + eclipseNoise) * height);
    
    strokeWeight(6);
    stroke(tinycolor(strokeColor).setAlpha(random(0.01, 0.1)).toHslString());
    
    point(sin(i + eclipseNoise) * 100, cos(i + eclipseNoise) * 100)
    
    j++;
  }
  
  blendMode(NORMAL);
  noStroke();
  fill("black");
  
  ellipse(0, 0, sunDiameter * 1.25);
  
  pop();
  
  push();
  
  translate(width / 2, height * 2);
  
  // -1366
  const planetTop = -width;
  // -1024
  const canvasBottom = -height;

  blendMode(NORMAL);
  noStroke();
  
  const planetColors = colors.filter(color => tinycolor(color).getBrightness() > 60 && tinycolor(color).toHsl().h > 80);
  
  fill(random(colors));
  
  ellipse(0, 0, width * 2);
  
  noFill();
  
  const steps = [...Array(10)].map(() => abs(randomGaussian(starMax / 10, 25)));
  
  let yCounter = -height;
  for(let j = 0; j < steps.length; j++) {
    const strokeColors = tinycolor(random(planetColors)).analogous();
    
    for(let i = 0; i < starMax / 2; i++) {
      strokeWeight(randomGaussian(10.0));
      const planetAngle = abs(randomGaussian(TWO_PI));
      const planetX = cos(radians(i * planetAngle)) * width;
      const planetY = sin(radians(i * planetAngle)) * width;
      if(planetY <= yCounter && planetY > yCounter - steps[j]) {
        const strokeColor = tinycolor(random(strokeColors)).setAlpha(randomGaussian(0.6, 0.1)).desaturate(random(1, 3.5)).toHslString();
        stroke(strokeColor);
        line(planetX, planetY, -planetX, planetY); 
      }
    }
    
    yCounter -= steps[j];
  }
  
  pop();
  
  blendMode(NORMAL);
  strokeWeight(1.0);
  
  const butterflies = 13;
  const butterflyColors = colors.filter(color => {
    const hue = tinycolor(color).toHsl().h;
    
    return hue > 20 && hue < 60;
  });
  
  for(let j = 0; j < butterflies; j++) {
    const size = abs(randomGaussian(width - height, 30)) * (2 / (j + 1));
    const butterflyNoise = noise(j);
    const butterflyNoiseX = noise(width * j + size) * butterflyNoise;
    const butterflyNoiseY = noise(height * j + size) * butterflyNoise;
    const butterflyX = map(butterflyNoiseX, 0, 1, width / 2, size) - size * j * butterflyNoise;
    const butterflyY = map(butterflyNoiseY, 0, 1, height, size) - size * j;
    
    stroke(random(butterflyColors));
    const rng = random();
    let t = 0;
    for(let i = 0; i < 50; i++) {
      push();
      
      translate(butterflyX, butterflyY);
      
      const x1 = width / j * noise(t + 25 * rng);
      const x2 = width / j * noise(t + 35 * rng);
      const x3 = width / j * noise(t + 45 * rng);
      const x4 = width / j * noise(t + 55 * rng);
      const y1 = height / j * noise(t + 65 * rng);
      const y2 = height / j * noise(t + 75 * rng);
      const y3 = height / j * noise(t + 85 * rng);
      const y4 = height / j * noise(t + 95 * rng);

      bezier(x1, y1, x2, y2, x3, y3, x4, y4);
      t += 0.01;
      
      pop();
    }
  }
}