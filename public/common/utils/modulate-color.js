export const modulateColor = (color, hRange = 8, sRange = 8, lRange = 8) => {
  const random = (min, max) => Math.random() * (max - min) + min;
  const hsl = tinycolor(color).toHsl();

  hsl.h = Math.floor(hsl.h + random(-hRange, hRange));
  hsl.s = Math.floor(hsl.s * 100 + random(-sRange, sRange));
  hsl.l = Math.floor(hsl.l * 100 + random(-lRange, lRange));

  return tinycolor(hsl).toHslString();
}