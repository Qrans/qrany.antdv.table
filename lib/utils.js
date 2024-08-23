export const isNull = (v) => v === null || v === undefined;

export const pick = (obj, ...keys) => {
  const res = {};
  for (const k of keys) if (!isNull(obj[k])) res[k] = obj[k];
  return res;
};

export const omit = (obj, ...keys) => {
  const res = { ...obj };
  for (const k of keys) delete res[k];
  return res;
};

export const filterVNodes = (vnodes = []) => {
  if (!Array.isArray(vnodes)) vnodes = [vnodes];
  return vnodes.filter((x) => !x.isComment);
};

export const parseImage = (img) => {
  if (typeof img === "string") {
    img = img.split("|");
    return { name: img[0], url: img[1] || img[0] };
  }
  return img;
};

export const parseImages = (imgs = []) => {
  if (typeof imgs === "string") {
    return imgs.split(",").map((img) => parseImage(img));
  }
  return imgs.map((img) => parseImage(img));
};

export const digit = (v) => {
  return Number(v)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const copy = (() => {
  let i;
  return (text) => {
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
})();
