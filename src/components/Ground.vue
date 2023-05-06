<script setup lang="ts">
import { useRafFn } from "@vueuse/core";
import { SCALE_MODES, Texture } from "pixi.js";
import { computed, ref } from "vue";
import textureUrl from "../assets/sprites/base.png";
import { useGroundPosition } from "../composables/useGroundPosition";

const texture = Texture.from(textureUrl, {
  scaleMode: SCALE_MODES.NEAREST,
});

const textureWidth = 336;
const textureHeight = 112;

const { x } = useGroundPosition();

const time = ref(0);
useRafFn(({ delta }) => {
  time.value += delta;
});

interface SkySpriteInfo {
  key: number;
  position: number;
  scale: number;
}

const rollingSprites = computed(() => {
  const sprites = [] as SkySpriteInfo[];

  const scale = (480 / textureHeight) * 0.25;

  let curPos =
    -((x.value / (scale * textureWidth)) % 1) * (scale * textureWidth) - 300;

  do {
    sprites.push({
      scale,
      key: 0,
      position: curPos,
    });

    curPos += textureWidth * scale;
  } while (curPos < 940);

  return sprites;
});
</script>

<template>
  <container :y="390">
    <sprite
      :texture="texture"
      v-for="sprite in rollingSprites"
      :key="sprite.key"
      :x="sprite.position"
      :scale="sprite.scale"
    />
  </container>
</template>
