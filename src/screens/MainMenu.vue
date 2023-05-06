<script setup lang="ts">
import {
  useElementHover,
  useRafFn,
  useTransition,
  TransitionPresets,
  until,
} from "@vueuse/core";
import { Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { computed, ref } from "vue";
import messagesMenuTextureUrl from "../assets/sprites/message.png";
import { onBeforeRouteLeave } from "vue-router";

const messagesTexture = Texture.from(messagesMenuTextureUrl, {
  scaleMode: SCALE_MODES.NEAREST,
});

const time = ref(0);
const speed = 2;
const amplitude = 10;

useRafFn(({ delta }) => (time.value += delta));

const offsetY = computed(
  () => Math.cos((time.value / 1000) * speed) * amplitude
);

const tileSize = {
  width: 184,
  height: 89,
};

const hitArea = new Rectangle(
  -tileSize.width / 2,
  -tileSize.height / 2 - 20,
  tileSize.width,
  tileSize.height
);

const el = ref();

const hovering = useElementHover(el);

const animatedScale = useTransition(
  computed(() => (hovering.value ? 1.1 : 1)),
  {
    duration: 150,
    transition: TransitionPresets.easeOutBack,
  }
);

const leaveProgress = ref(0);

onBeforeRouteLeave(async (to, from, next) => {
  let firstRun = true;
  const { pause } = useRafFn(({ delta }) => {
    if (firstRun) {
      delta = 0;
      firstRun = false;
    }
    leaveProgress.value = Math.min(leaveProgress.value + (delta / 1000) * 3, 1);
  });

  await until(leaveProgress).toBe(1);

  pause();
  next();
});
</script>

<template>
  <container
    ref="el"
    :hit-area="hitArea"
    :x="320"
    :y="240"
    event-mode="static"
    :scale="1.35"
    :alpha="1 - leaveProgress"
    @mousedown="$router.replace('/game')"
  >
    <tiling-sprite
      :texture="messagesTexture"
      :anchor="0.5"
      :width="tileSize.width"
      :height="tileSize.height"
      :tile-position="{ x: 0, y: -1 }"
      :y="offsetY"
      :scale="animatedScale + leaveProgress * 0.2"
    />
  </container>
</template>
