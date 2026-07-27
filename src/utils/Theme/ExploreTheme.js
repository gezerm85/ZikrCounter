// Design tokens for the new "Keşfet" (Explore) / Qur'an / Hadith surface.
// Extracted verbatim from the Zikirmatik v2.0 mockup (emerald theme,
// light + dark). This module is SELF-CONTAINED and does not touch the
// existing screens' visual system.

import { useSelector } from "react-redux";

const LIGHT = {
  bg: "#F7FBF7",
  bg2: "#FFFFFF",
  surface: "#FFFFFF",
  card: "#F5FAF5",
  ink: "#1C3A30",
  inkSoft: "#51695E",
  muted: "#93A69B",
  line: "#E4ECE4",
  gold: "#1E9E76",
  gold2: "#34BC8D",
  goldInk: "#0B3A2B",
  goldSoft: "#DCF1E6",
  onAcc: "#FFFFFF",
  shadow: "rgba(30,70,55,0.14)",
  tabbar: "#FFFFFF",
  overlay: "rgba(0,0,0,0.35)",
};

const DARK = {
  bg: "#122019",
  bg2: "#17281F",
  surface: "#1A2E24",
  card: "#18291F",
  ink: "#EAF3EC",
  inkSoft: "#B5CBBF",
  muted: "#7C9488",
  line: "rgba(120,200,160,0.16)",
  gold: "#37C093",
  gold2: "#58D8AE",
  goldInk: "#DCF1E6",
  goldSoft: "#1E4234",
  onAcc: "#062018",
  shadow: "rgba(0,0,0,0.45)",
  tabbar: "#142219",
  overlay: "rgba(0,0,0,0.55)",
};

// Font families. The mockup uses Google fonts (Plus Jakarta Sans / Cormorant /
// Amiri / Share Tech Mono); the RN app only bundles "OpenSans" + "digital", so
// we fall back to those + platform defaults. Arabic renders correctly with the
// system font. (Custom fonts can be dropped into utils/Fonts later without
// changing screen code.)
export const FONTS = {
  ui: "OpenSans",
  display: "OpenSans", // headings (serif display could be added later)
  arabic: undefined, // system Arabic shaping
  mono: "digital",
};

export const getExploreTheme = (mode) => {
  const c = mode === "dark" ? DARK : LIGHT;
  return { mode: mode === "dark" ? "dark" : "light", c, fonts: FONTS };
};

/**
 * Hook: current Explore theme from redux (contentPrefs.exploreTheme).
 * @returns {{mode:string, c:typeof LIGHT, fonts:typeof FONTS}}
 */
export const useExploreTheme = () => {
  const mode = useSelector((s) => s.contentPrefs?.exploreTheme) || "light";
  return getExploreTheme(mode);
};

// Shared numeric scale (radii / spacing) from the spec.
export const RADIUS = { card: 18, container: 18, chip: 12, pill: 999, search: 14, button: 14, sheet: 24 };
export const SPACE = { screenH: 20, headerH: 24, gap: 12, cardPad: 16 };
