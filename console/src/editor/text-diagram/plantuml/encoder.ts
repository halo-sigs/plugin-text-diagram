import pako from "pako";

/**
 * Compresses the given string to a PlantUML URL
 * use pako instead of plantuml original javascript
 * @see https://plantuml.com/zh/code-javascript-synchronous
 * @param s plantumlText
 * @returns image url
 */
export function compress(s: string) {
  // console.log("Original:" + s);
  // Encoded in UTF-8
  const utf8 = unescape(encodeURIComponent(s));
  console.log("UTF-8:" + utf8);
  // Compressed using Deflate algorithm
  const deflateRaw = pako.deflateRaw(utf8, {
    level: 9,
  });
  // console.log(`pako deflateRaw: ${deflateRaw}`);
  // unit8 to unit16
  const deflateRaw16 = new Uint16Array(deflateRaw);
  const deflate = new TextDecoder("utf-16").decode(deflateRaw16);
  // console.log("pako deflate:" + deflate);
  // Reencoded in ASCII using a transformation close to base64
  const encoded = encode64(deflate);
  // console.log("base64:" + encoded);
  // Base64 encoded

  return `https://www.plantuml.com/plantuml/svg/${encoded}`;
}

function encode64(data: string) {
  let r = "";
  for (let i = 0; i < data.length; i += 3) {
    if (i + 2 == data.length) {
      r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
    } else if (i + 1 == data.length) {
      r += append3bytes(data.charCodeAt(i), 0, 0);
    } else {
      r += append3bytes(
        data.charCodeAt(i),
        data.charCodeAt(i + 1),
        data.charCodeAt(i + 2)
      );
    }
  }
  return r;
}

function append3bytes(b1: number, b2: number, b3: number) {
  const c1 = b1 >> 2;
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
  const c4 = b3 & 0x3f;
  let r = "";
  r += encode6bit(c1 & 0x3f);
  r += encode6bit(c2 & 0x3f);
  r += encode6bit(c3 & 0x3f);
  r += encode6bit(c4 & 0x3f);
  return r;
}

function encode6bit(b: number) {
  if (b < 10) {
    return String.fromCharCode(48 + b);
  }
  b -= 10;
  if (b < 26) {
    return String.fromCharCode(65 + b);
  }
  b -= 26;
  if (b < 26) {
    return String.fromCharCode(97 + b);
  }
  b -= 26;
  if (b == 0) {
    return "-";
  }
  if (b == 1) {
    return "_";
  }
  return "?";
}
