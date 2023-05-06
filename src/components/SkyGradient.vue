<script setup lang="ts">
import { inject } from "vue";
import { Application, RenderTexture, Renderer } from "pixi.js";
import { useElementSize } from "@vueuse/core";
import { GradientFactory } from "@pixi-essentials/gradients";

const app = inject("app") as Application;

const renderTexture = RenderTexture.create({
  width: 640,
  height: 480,
});

const { width, height } = useElementSize(app.view as HTMLCanvasElement);

const texture = GradientFactory.createLinearGradient(
  app.renderer as Renderer,
  renderTexture,
  {
    x0: 0,
    x1: 0,
    y0: 0,
    y1: 480,
    colorStops: [
      {
        offset: 0,
        color: 0x4ac6f7,
      },
      {
        offset: 1,
        color: 0xc9f6ff,
      },
    ],
  }
);
</script>

<template>
  <sprite :texture="texture" :width="width" :height="height" />
</template>
