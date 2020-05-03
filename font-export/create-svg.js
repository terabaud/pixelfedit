/**
 * Create SVG from 8bit binary font (WIP)
 * @param {Uint8Array} font binary data of the raster font
 */
function createSVG(font) {
  const numRows = (font.length / 256) | 0;
  const viewBox = [0, 0, 8 * 16, numRows * 16].join(" ");
  const symbolViewBox = [0, 0, 8, numRows];
  const symbols = [];
  const content = [];
  for (let n = 0; n < 256; n++) {
    let path = "";
    for (let y = 0; y < numRows; y++) {
      const line = font[n * numRows + y];
      for (let x = 0; x < 8; x++) {
        if ((line & (1 << (7 - x))) > 0) {
          path += `M${x} ${y}H${x + 1}V${y + 1}H${x}Z`;
        }
      }
    }
    symbols.push(
      `<symbol id="chr${n}" viewBox="${symbolViewBox}" fill="#000"><path d="${path}" /></symbol>`
    );
    const xPos = (n % 16) * 8;
    const yPos = ((n / 16) | 0) * numRows;
    content.push(
      `<use xlink:href="#chr${n}" x="${xPos}" y="${yPos}" width="8" height="${numRows}"/>`
    );
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="${viewBox}">
      ${symbols}
      ${content}
    </svg>`;
  return svg;
}
