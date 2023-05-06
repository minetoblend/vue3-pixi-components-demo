<script setup lang="ts">
import { TransitionPresets, useTransition } from "@vueuse/core";
import { BlurFilter, Texture } from "pixi.js";
import { computed, watchEffect } from "vue";
import textureUrl from "../assets/sprites/background-day.png";
import { useGroundPosition } from "../composables/useGroundPosition";

const props = defineProps<{
  blur?: boolean;
}>();

const texture = Texture.from(textureUrl);

const textureWidth = 288
const textureHeight = 512

const { x } = useGroundPosition(0.25);

interface SkySpriteInfo {
  key: number;
  position: number;
  scale: number;
}

const rollingSprites = computed(() => {
  const sprites = [] as SkySpriteInfo[];

  const scale = 480 / textureHeight;

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

const blurAmount = useTransition(
  computed(() => (props.blur ? 20 : 0)),
  {
    duration: 350,
    transition: TransitionPresets.easeOutQuad,
  }
);

const blurFilter = new BlurFilter();

watchEffect(() => {
  blurFilter.blur = blurAmount.value;
});

const filters = [blurFilter];
</script>

<template>
  <container :filters="filters">
    <sprite
      :texture="texture"
      v-for="sprite in rollingSprites"
      :key="sprite.key"
      :x="sprite.position"
      :scale="sprite.scale"
    />
  </container>
</template>
