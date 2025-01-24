import { proxy } from "valtio";

// ?DEFINE INITIAL STATE - EMPTY DEFAULT VALUES
const state = proxy({
    intro: true,
    color: "#68ffea",
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: "./threejs.png",
    fullDecal: "./threejs.png",
});

export default state;