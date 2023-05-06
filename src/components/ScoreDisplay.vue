<script setup lang="ts">
import { SCALE_MODES, Texture } from "pixi.js";
import tex0 from "../assets/sprites/0.png";
import tex1 from "../assets/sprites/1.png";
import tex2 from "../assets/sprites/2.png";
import tex3 from "../assets/sprites/3.png";
import tex4 from "../assets/sprites/4.png";
import tex5 from "../assets/sprites/5.png";
import tex6 from "../assets/sprites/6.png";
import tex7 from "../assets/sprites/7.png";
import tex8 from "../assets/sprites/8.png";
import tex9 from "../assets/sprites/9.png";
import { computed } from "vue";

const props = defineProps<{
  score: number;
  centered?: boolean;
}>();

const textures = [
  tex0,
  tex1,
  tex2,
  tex3,
  tex4,
  tex5,
  tex6,
  tex7,
  tex8,
  tex9,
].map((url) =>
  Texture.from(url, {
    scaleMode: SCALE_MODES.NEAREST,
  })
);

const digits = computed(() => {
  const digits = [] as number[];

  let score = props.score;

  if (score === 0) return [0];

  while (score > 0) {
    digits.push(score % 10);
    score = Math.floor(score / 10);
  }


  return digits.reverse();
});
</script>
<template>
  <container>
    <sprite
      v-for="(digit, index) in digits"
      :key="index"
      :texture="textures[digit]"
      :anchor-x="centered ? 0.5 : 1"
      :x="(centered ? -(digits.length - 1) * 15 :  -digits.length * 30) + index * 30"
    />
  </container>
</template>
