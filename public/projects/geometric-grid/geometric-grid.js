import {
  SVG,
  random,
  tinycolor,
  gsap,
  modulateColor
} from "../../common/shared.js";

let draw, squareSize, colors, colorPalette;

const fibonacci = [3, 5, 8, 13];

const numRows = random(fibonacci);
const numCols = random(fibonacci);

const drawGrid = () => {
  colorPalette = random(colors);
  squareSize = 100;

  const bg = tinycolor
    .mix(colorPalette[0], colorPalette[3], 50)
    .desaturate(10)
    .toString();

  const bgInner = tinycolor(bg).lighten(10).toString();
  const bgOuter = tinycolor(bg).darken(10).toString();

  gsap.to(".container", {
    "--bg-inner": bgInner,
    "--bg-outer": bgOuter,
    duration: 0.5
  });

  draw = SVG()
    .addTo(".container")
    .size("100%", "100%")
    .viewbox(`0 0 ${numRows * squareSize} ${numCols * squareSize}`);

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      generateLittleBlock(i, j);
    }
  }
};

const generateNewGrid = () => {
  document.querySelector(".container").innerHTML = "";
  drawGrid();
};

const drawBlock = (x, y, background) => {
  console.log(background);
  const group = draw.group().addClass("draw-block");

  group.rect(squareSize, squareSize).fill(background).move(x, y);
};

const getTwoColors = (colors) => {
  let colorList = [...colors];

  const colorIndex = random(0, colorList.length - 1, true);
  const background = colorList[colorIndex];

  colorList.splice(colorIndex, 1);

  const foreground = random(colorList);

  return { foreground, background };
};

const drawCircle = (x, y, foreground, background) => {
  const variation = Math.random();
  const group = draw.group().addClass("draw-circle");

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  if (variation < 0.3) {
    group
      .circle(squareSize / 2)
      .fill(foreground)
      .move(x + squareSize / 4, y + squareSize / 4);
  } else {
    group
      .circle(squareSize * 0.9)
      .fill(foreground)
      .move(x + squareSize * 0.05, y + squareSize * 0.05);
  }

  if (variation > 0.7) {
    group
      .circle(squareSize / 2)
      .fill(background)
      .move(x + squareSize / 4, y + squareSize / 4);
  }
};

const drawHalfCircle = (x, y, foreground, background) => {
  const variation = Math.random();
  const group = draw.group().addClass("draw-half-circle");
  const halfCircleGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  if (variation < 0.2) {
    halfCircleGroup
      .path("M 0 0 A 1 1 0 0 0 100 0 Z")
      .fill(foreground)
      .center(x + squareSize / 2, y + squareSize / 4);
  } else if (variation >= 0.2 && variation < 0.4) {
    halfCircleGroup
      .path("M 0 100 A 1 1 0 0 1 100 100 Z")
      .fill(foreground)
      .center(x + squareSize / 2, y + squareSize * 0.75);
  } else if (variation >= 0.4 && variation < 0.6) {
    halfCircleGroup
      .path("M 100 0 A 1 1 0 0 0 100 100 Z")
      .fill(foreground)
      .center(x + squareSize * 0.75, y + squareSize / 2);
  } else {
    halfCircleGroup
      .path("M 0 0 A 1 1 0 0 1 0 100 Z")
      .fill(foreground)
      .center(x + squareSize / 4, y + squareSize / 2);
  }
};

const drawHalfCircles = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-half-circles");
  const halfCirclesGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  halfCirclesGroup
    .path("M 0 0 A 1 1 0 0 1 0 100 Z")
    .fill(foreground)
    .center(x + squareSize / 4, y + squareSize / 2);
  halfCirclesGroup
    .path("M 100 0 A 1 1 0 0 0 100 100 Z")
    .fill(foreground)
    .center(x + squareSize * 0.75, y + squareSize / 2);

  if (Math.random() < 0.5) {
    halfCirclesGroup.transform({ rotate: 90 });
  }

  group.add(halfCirclesGroup);
};

const drawQuarterCircle = (x, y, foreground, background) => {
  const variation = Math.random();
  const group = draw.group().addClass("draw-quarter-circle");

  const mask = draw.rect(squareSize, squareSize).fill("#ffffff").move(x, y);

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  const offset = random([
    [0, 0],
    [0, squareSize],
    [squareSize, squareSize],
    [squareSize, 0]
  ]);

  group
    .circle(squareSize * 2)
    .fill(foreground)
    .center(x + offset[0], y + offset[1])
    .maskWith(mask);
};

const drawFourCircles = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-four-circles");
  const circlesGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  circlesGroup
    .circle(squareSize / 2.5)
    .fill(foreground)
    .move(x, y);
  circlesGroup
    .circle(squareSize / 2.5)
    .fill(foreground)
    .move(x + squareSize / 2.5, y);
  circlesGroup
    .circle(squareSize / 2.5)
    .fill(foreground)
    .move(x + squareSize / 2.5, y + squareSize / 2.5);
  circlesGroup
    .circle(squareSize / 2.5)
    .fill(foreground)
    .move(x, y + squareSize / 2.5);

  circlesGroup.center(x + squareSize / 2, y + squareSize / 2);

  group.add(circlesGroup);
};

const drawSesameSeed = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-sesame-seed");

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  group
    .path("M 100 100 H 50 A 50 50 0 1 1 100 50 V 100 Z")
    .fill(foreground)
    .move(x, y)
    .transform({ rotate: random([0, 90, 180, 270]), origin: "center center" });
};

const drawSlope = (x, y, foreground, background) => {
  const variation = Math.random();
  const group = draw.group().addClass("draw-slope");
  const slopeGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  slopeGroup.polygon("0,0 100,100 0,100").fill(foreground).move(x, y);

  if (variation < 0.5) {
    slopeGroup.transform({ rotate: 90 });
  }

  group.add(slopeGroup);
};

const drawTriangle = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-triangle");
  const triangleGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  triangleGroup.polygon("50,0 100,100 0,100").fill(foreground).move(x, y);

  triangleGroup.transform({ rotate: random([0, 90, 180, 270]) });

  group.add(triangleGroup);
};

const drawTangramTriangles = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-tangram-triangles");
  const tangramGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  tangramGroup.polygon("0,0 100,100 0,100").fill(foreground).move(x, y);
  tangramGroup
    .polygon("50,0 100,50 50,50")
    .fill(foreground)
    .move(x + squareSize / 2, y);

  tangramGroup.transform({ rotate: random([0, 90, 180, 270]) });

  group.add(tangramGroup);
};

const drawExTriangles = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-x-triangles");
  const trianglesGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  trianglesGroup.polygon("0,0 100,0 50,50").fill(foreground).move(x, y);
  trianglesGroup
    .polygon("0,100 50,50 100,100")
    .fill(foreground)
    .move(x, y + squareSize / 2);

  group.add(trianglesGroup);
};

const drawStackedTriangles = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-stacked-triangles");
  const trianglesGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  trianglesGroup.polygon("0,0 100,0 50,50").fill(foreground).move(x, y);
  trianglesGroup
    .polygon("0,50 100,50 50,100")
    .fill(foreground)
    .move(x, y + squareSize / 2);

  trianglesGroup.transform({ rotate: random([0, 90, 180, 270]) });

  group.add(trianglesGroup);
};

const drawDiamond = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-diamond");

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  group
    .rect(squareSize / 2, squareSize / 2)
    .fill(foreground)
    .center(x + squareSize / 2, y + squareSize / 2)
    .transform({ rotate: 45 });
};

const drawConcaveDiamond = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-concave-diamond");

  const circleGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  const mask = draw.rect(squareSize, squareSize).fill("#ffffff").move(x, y);

  circleGroup.circle(squareSize).fill(foreground).center(x, y);

  circleGroup
    .circle(squareSize)
    .fill(foreground)
    .center(x + squareSize, y);

  circleGroup
    .circle(squareSize)
    .fill(foreground)
    .center(x + squareSize, y + squareSize);

  circleGroup
    .circle(squareSize)
    .fill(foreground)
    .center(x, y + squareSize);

  circleGroup.maskWith(mask);
  group.add(circleGroup);
};

const drawBars = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-bars");
  const barsGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  barsGroup
    .rect(squareSize, squareSize / 8)
    .fill(foreground)
    .center(x + squareSize / 2, y + squareSize / 2);

  if (Math.random() < 0.5) {
    barsGroup.transform({ rotate: 90 });
  }

  group.add(barsGroup);
};

const drawCheckers = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-checkers");
  const checkerGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  checkerGroup
    .rect(squareSize / 2, squareSize / 2)
    .fill(foreground)
    .move(x, y);
  checkerGroup
    .rect(squareSize / 2, squareSize / 2)
    .fill(foreground)
    .move(x + squareSize / 2, y + squareSize / 2);

  group.add(checkerGroup);
};

const drawClover = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-clover");
  const cloverGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  cloverGroup
    .path(
      "M 20 20 A 1 1 0 0 1 55 20 A 1 1 0 0 1 55 55 A 1 1 0 0 1 20 55 A 1 1 0 0 1 20 20 Z"
    )
    .fill(foreground)
    .center(x + squareSize / 2, y + squareSize / 2);

  if (Math.random() < 0.4) {
    cloverGroup.transform({ rotate: 45 });
  }

  group.add(cloverGroup);
};

const drawShield = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-shield");

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  group
    .path("M 50 0 Q 100 50 50 100 Q 0 50 50 0 Z")
    .fill(foreground)
    .center(x + squareSize / 2, y + squareSize / 2);
};

const drawStackedShields = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-stacked-shields");
  const shieldGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  shieldGroup
    .path("M 50 0 Q 100 50 50 100 Q 0 50 50 0 Z")
    .fill(foreground)
    .move(x, y);
  shieldGroup
    .path("M 50 0 Q 100 50 50 100 Q 0 50 50 0 Z")
    .fill(foreground)
    .move(x + squareSize / 2, y);

  group.add(shieldGroup);
};

const drawLeaf = (x, y, foreground, background) => {
  const group = draw.group().addClass("draw-leaf");

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  group
    .path("M 0 0 H 50 A 50 50 0 0 1 100 50 V 100 H 50 A 50 50 0 0 1 0 50 Z")
    .fill(foreground)
    .move(x, y)
    .transform({ rotate: random([0, 90]) });
};

const generateLittleBlock = (i, j) => {
  const { foreground, background } = getTwoColors(colorPalette);

  const blockStyleOptions = [
    drawCircle,
    drawConcaveDiamond,
    drawClover,
    drawHalfCircle,
    drawQuarterCircle,
    drawDiamond,
    drawSlope,
    drawTangramTriangles,
    drawFourCircles,
    drawHalfCircles,
    drawTriangle,
    drawExTriangles,
    drawStackedTriangles,
    drawBars,
    drawSesameSeed,
    drawCheckers,
    drawShield,
    drawStackedShields,
    drawLeaf
  ];
  const blockStyle = random(blockStyleOptions);

  const xPos = i * squareSize;
  const yPos = j * squareSize;

  blockStyle(xPos, yPos, foreground, background);
};

const init = () => {
  colors = [
    ["#4cb7c2", "#81ccd1", "#0097a9", "#f1efed", "#1b1716"],
    ["#055757", "#3b7f7b", "#003238", "#f1efed", "#1b1716"],
    ["#7ca979", "#a1c199", "#518759", "#f1efed", "#1b1716"],
    ["#e7bd6d", "#f0d090", "#d79e49", "#f1efed", "#1b1716"],
    ["#df4e6c", "#ee797b", "#c3254a", "#f1efed", "#1b1716"]
  ];

  generateNewGrid();
};

init();
