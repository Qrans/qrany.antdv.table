export const isNull = (v) => v === null || v === undefined;

/** 解析图片地址 */
export const parseImage = (img) => {
  if (typeof img === "string") {
    img = img.split("|");
    return { name: img[0], url: img[1] || img[0], type: img[2] || "image" };
  }
  return img;
};

/** 解析图片地址 */
export const parseImages = (imgs = []) => {
  if (typeof imgs === "string") {
    return imgs.split(",").map((img) => parseImage(img));
  }
  return imgs.map((img) => parseImage(img));
};

/** 插入千分位符 */
export const digit = (v) => {
  return Number(v)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

/** 深拷贝 */
export const clone = (v) => JSON.parse(JSON.stringify(v));

/** @type {HTMLTextAreaElement} */
let i;
/** 复制文本 */
export const copy = (text) => {
  if (!i) {
    i = document.createElement("textarea");
    i.style.position = "fixed";
    i.style.left = "-9999px";
    i.style.top = "-9999px";
  }
  i.value = text;
  document.body.appendChild(i);
  i.select();
  document.execCommand("copy");
  i.remove();
};
