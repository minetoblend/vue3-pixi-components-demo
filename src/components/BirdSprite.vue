<script setup lang="ts">
import downFlapTexture from "../assets/sprites/redbird-downflap.png";
import midFlapTexture from "../assets/sprites/redbird-midflap.png";
import upFlapTexture from "../assets/sprites/redbird-upflap.png";

import { SCALE_MODES, Texture } from "pixi.js";

defineProps<{
  spriteIndex: number;
}>();

const textures = [downFlapTexture, midFlapTexture, upFlapTexture].map((url) =>
  Texture.from(url, {
    scaleMode: SCALE_MODES.NEAREST,
  })
);
</script>

<template>
  <sprite
    :texture="textures[spriteIndex % textures.length]"
    :anchor="0.5"
  />
</template>
