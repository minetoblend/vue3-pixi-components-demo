<script setup lang="ts">
import {
  useElementHover,
  useRafFn,
  useTransition,
  TransitionPresets,
  until,
  onKeyDown,
} from "@vueuse/core";
import { Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { computed, ref } from "vue";
import textureUrl from "../assets/sprites/gameover.png";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useTransitionProgress } from "../composables/useTransition";
import ScoreDisplay from "../components/ScoreDisplay.vue";

const texture = Texture.from(textureUrl, {
  scaleMode: SCALE_MODES.NEAREST,
});

const { progress: entryProgress } = useTransitionProgress(500);

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

const router = useRouter();

const route = useRoute();

onKeyDown(" ", () => router.replace("/game"));

const score = parseInt(route.query.score as string);
</script>

<template>
  <container
    ref="el"
    :hit-area="hitArea"
    :x="320"
    :y="180"
    event-mode="static"
    :scale="1.35"
    :alpha="Math.min(1 - leaveProgress, entryProgress)"
    @pointerdown="$router.replace('/game')"
  >
    <sprite
      :texture="texture"
      :anchor="0.5"
      :tile-position="{ x: 0, y: 200 }"
      :y="offsetY"
      :scale="animatedScale + (leaveProgress, entryProgress) * 0.2"
    />
  </container>
  <ScoreDisplay
    :score="score"
    centered
    :x="320"
    :y="260"
    :scale="1.5"
    :alpha="Math.min(1 - leaveProgress, entryProgress)"
  />
</template>
