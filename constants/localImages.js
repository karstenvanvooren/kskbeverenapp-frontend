// Local bundled player/news photos, keyed by whatever string is stored in
// the backend's `image` field. Metro (the RN bundler) needs every
// require(...) call to be static, so each local asset has to be listed
// literally here rather than built dynamically from a variable.

export const PLAYER_IMAGES = {
  jarl: require("../assets/images/jarl.jpg"),
  mauro: require("../assets/images/mauro.jpg"),
  sander: require("../assets/images/sander.jpg"),
  samuell: require("../assets/images/samuell.jpg"),
  mike: require("../assets/images/mike.jpg"),
  emmanuel: require("../assets/images/emmanuel.jpg"),
  dylan: require("../assets/images/dylan.jpg"),
  moussa: require("../assets/images/moussa.jpg"),
  ward: require("../assets/images/ward.jpg"),
  arno: require("../assets/images/arno.jpg"),
  jean: require("../assets/images/jean.jpg"),
  cedric: require("../assets/images/cedric.jpg"),
  warre: require("../assets/images/warre.jpg"),
  raphael: require("../assets/images/raphael.jpg"),
  mathias: require("../assets/images/mathias.jpg"),
  emiel: require("../assets/images/emiel.jpg"),
  seppe: require("../assets/images/seppe.jpg"),
  muhammad: require("../assets/images/muhammad.jpg"),
  adam: require("../assets/images/adam.jpg"),
  yentl: require("../assets/images/yentl.jpg"),
  "jean-baptist": require("../assets/images/jean-baptist.jpg"),
  yannick: require("../assets/images/yannick.jpg"),
  victor: require("../assets/images/victor.jpg"),
  milan: require("../assets/images/milan.jpg"),
  fil_geenfoto: require("../assets/images/fil_geenfoto.jpg"),
};

export const NEWS_IMAGES = {
  "kskb-berlare": require("../assets/images/kskb-berlare.jpg"),
  ploegfoto: require("../assets/images/ploegfoto.jpg"),
};

const FALLBACK_PLAYER_IMAGE = PLAYER_IMAGES.fil_geenfoto;

// `image` on a Player/News document can be either a real http(s) URL (if
// you switch to hosted photos later, e.g. via imgbb) or one of the local
// keys above. This resolves either case to something <Image source={...}>
// can use directly.
export function resolvePlayerImage(imageValue) {
  if (!imageValue) return FALLBACK_PLAYER_IMAGE;
  if (imageValue.startsWith("http")) return { uri: imageValue };
  return PLAYER_IMAGES[imageValue] || FALLBACK_PLAYER_IMAGE;
}

export function resolveNewsImage(imageValue) {
  if (!imageValue) return null;
  if (imageValue.startsWith("http")) return { uri: imageValue };
  return NEWS_IMAGES[imageValue] || null;
}