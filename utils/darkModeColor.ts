const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
};

/** 파스텔 hex → 다크모드 배경 (같은 Hue, 채도 UP, 밝기 ~20%) */
export const getDarkChipBg = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#1a1a1a";
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const darkRgb = hslToRgb(h, Math.min(s * 3, 60), 20);
  return `rgb(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b})`;
};

/** 파스텔 hex → 다크모드 텍스트 (같은 Hue, 채도 UP, 밝기 ~72%) */
export const getDarkChipText = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#ffffff";
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const textRgb = hslToRgb(h, Math.min(s * 3.5, 85), 72);
  return `rgb(${textRgb.r}, ${textRgb.g}, ${textRgb.b})`;
};
