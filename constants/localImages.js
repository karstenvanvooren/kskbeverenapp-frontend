// Local bundled player/news/club photos, keyed by whatever string is stored
// in the backend's `image` / `opponentLogo` field. Metro (the RN bundler)
// needs every require(...) call to be static, so each local asset has to be
// listed literally here rather than built dynamically from a variable.

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
  welkomskberlare: require("../assets/images/welkomskberlare.jpg"),
  wordtpeter: require("../assets/images/wordtpeter.jpg"),
  zondagbervhemsport: require("../assets/images/zondagbervhemsport.jpg"),
  crowdfunding: require("../assets/images/crowdfunding.jpg"),
};

// Opponent club crests, keyed the same way (one entry per club that shows
// up as `opponent` in seedMatches.js). "kskbeveren" isn't in here because
// it's not looked up dynamically -- it's exported directly below since
// it's always our own team's crest, never a value coming from the backend.
export const CLUB_LOGOS = {
  skbeveren: require("../assets/images/skbeveren.png"),
  latem: require("../assets/images/latem.jpeg"),
  kallo: require("../assets/images/kallo.png"),
  deurnepirates: require("../assets/images/deurnepirates.jpeg"),
  blankenberge: require("../assets/images/blankenberge.jpeg"),
  kruibeke: require("../assets/images/kruibeke.png"),
  sintgilleswaas: require("../assets/images/sintgilleswaas.png"),
  berchem: require("../assets/images/berchem.png"),
  waasmunster: require("../assets/images/waasmunster.jpg"),
  hulst: require("../assets/images/hulst.jpg"),
  berlare: require("../assets/images/berlare.png"),
  denderhoutem: require("../assets/images/denderhoutem.png"),
  evergem: require("../assets/images/Evergem.png"),
  haasdonk: require("../assets/images/haasdonk.png"),
  ninove: require("../assets/images/ninove.png"),
  munkzwalm: require("../assets/images/munkzwalm.png"),
  schellebelle: require("../assets/images/schellebelle.jpeg"),
  aalter: require("../assets/images/aalter.jpeg"),
  kruishoutem: require("../assets/images/kruishoutem.png"),
};

// KSK Beveren's own crest -- used for "our side" of a matchup everywhere a
// team badge is shown, instead of looking it up by key like an opponent.
export const OWN_TEAM_LOGO = require("../assets/images/logo.png");

const FALLBACK_PLAYER_IMAGE = PLAYER_IMAGES.fil_geenfoto;

// `image` on a Player/News document (or `opponentLogo` on a Match) can be
// either a real http(s) URL (if you switch to hosted photos later, e.g. via
// imgbb) or one of the local keys above. These resolve either case to
// something <Image source={...}> can use directly.
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

export function resolveClubLogo(logoValue) {
  if (!logoValue) return null;
  if (logoValue.startsWith("http")) return { uri: logoValue };
  return CLUB_LOGOS[logoValue] || null;
}