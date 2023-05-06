<script setup lang="ts">
import { Application } from "pixi.js";
import { useElementSize } from "@vueuse/core";
import { computed, inject } from "vue";

const app = inject("app") as Application;
const { width: screenWidth, height: screenHeight } = useElementSize(
  app.view as HTMLCanvasElement
);

const scale = computed(() =>
  Math.min(screenWidth.value / 640, screenHeight.value / 480)
);

const position = computed(() => {
  return {
    x: (screenWidth.value - 640 * scale.value) / 2,
    y: (screenHeight.value - 480 * scale.value) / 2,
  };
});
</script>

<template>
  <container :position="position" :scale="scale">
    <slot />
  </container>
</template>
