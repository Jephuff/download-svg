import saveSvgAsPng from 'save-svg-as-png';
import canvg from '@jephuff/canvg';

const fontRegEx = /(font-size: ?)(([0-9]*(\.[0-9]+))?([^;]*))/;

const defaultConfig = {
  scale: 1,
  backgroundColor: '#fff',
  modifyStyle: (r) => {
    const size = r.match(fontRegEx);
    return r.replace(fontRegEx, () => `font-size: ${size[5] === 'rem' ? `${(parseFloat(size[3]) * 10)}px` : size[2]}`);
  },
};

function downloadSvg({ svg, stylePrefix, fileName = 'export.svg', modifyFontFace }) {
  const selectorRemap = stylePrefix ? s => s.replace(stylePrefix, '').replace(/^ /, '') : undefined;
  const extension = (fileName.match(/\.[^.]*$/) || [])[0];

  if (extension === '.svg') {
    saveSvgAsPng.svgAsDataUri(svg, {
      ...defaultConfig,
      selectorRemap,
    }, uri => saveSvgAsPng.download(uri, fileName));
  } else {
    let encoderType;
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        encoderType = 'image/jpeg';
        break;
      case '.webp':
        encoderType = 'image/webp';
        break;
      default:
        encoderType = 'image/png';
        break;
    }

    saveSvgAsPng.saveSvgAsPng(svg, fileName, {
      ...defaultConfig,
      selectorRemap,
      scale: 2,
      canvg,
      encoderType,
      modifyFontFace,
    });
  }
}

export default downloadSvg;
