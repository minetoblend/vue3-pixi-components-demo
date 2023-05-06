<script setup lang="ts">
import { SCALE_MODES, Texture } from "pixi.js";
import textureUrl from "../assets/sprites/pipe-green.png";

defineProps<{
  x: number;
  y: number;
}>();

const texture = Texture.from(textureUrl, {
  scaleMode: SCALE_MODES.NEAREST,
});
</script>

<template>
  <container :x="x" :y="y">
    <sprite
      :texture="texture"
      :anchor-x="0.5"
      :y="-65"
      :scale-x="1.5"
      :scale-y="-1.5"
    />
    <sprite :texture="texture" :anchor-x="0.5" :y="65" :scale-x="1.5" :scale-y="1.5" />
  </container>
</template>
