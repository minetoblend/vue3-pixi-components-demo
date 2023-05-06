<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useTransitionProgress } from "../composables/useTransition";
import BirdSprite from "../components/BirdSprite.vue";
import { Rectangle, Ticker } from "pixi.js";
import {
  tryOnScopeDispose,
  onKeyDown,
  whenever,
  syncRef,
  until,
  useEventListener,
} from "@vueuse/core";
import Pipes from "../components/Pipes.vue";
import { useGroundPosition } from "../composables/useGroundPosition";
import { PipeInfo } from "../interfaces";
import { router } from "../router";
import { onBeforeRouteLeave } from "vue-router";
import ScoreDisplay from "../components/ScoreDisplay.vue";
const { progress: entryProgress } = useTransitionProgress(800);

const entryOffsetX = computed(() => (1 - entryProgress.value) ** 2 * -200);

const birdY = ref(50);
const velocityY = ref(0);
const gravity = 0.6;
const birdX = ref(0);

const gameOver = ref(false);

const birdAngle = computed(() => gameOver.value ? Math.PI : velocityY.value * 2.5);

const score = ref(0);

Ticker.shared.add(update);

tryOnScopeDispose(() => Ticker.shared.remove(update));

function jump() {
  if (!gameOver.value) velocityY.value = -11;
}

const birdSprite = computed(() => {
  if (velocityY.value < -2) return 0;
  if (velocityY.value > 2) return 2;
  return 1;
});

const { x } = useGroundPosition();

// spacebar
onKeyDown(" ", jump);

useEventListener("pointerdown", jump);

whenever(
  () => birdY.value > 379,
  () => {
    birdY.value = 379;
    velocityY.value = gameOver.value ? 0 : -5;
  }
);

whenever(
  () => birdY.value < 10,
  () => {
    birdY.value = 10;
    velocityY.value = 0;
  }
);

const pipes = reactive([] as PipeInfo[]);

const pipeDistance = 300;

function spawnPipe(x: number) {
  pipes.push({
    x,
    y: Math.random() * 175 + 100,
  });
}

spawnPipe(800);

watch(x, (x, prevX) => {
  const pipeX = Math.floor(x / pipeDistance) * pipeDistance + 800;
  if (
    pipeX !== Math.floor(prevX / pipeDistance) * pipeDistance + 800 &&
    !gameOver.value
  ) {
    spawnPipe(pipeX);
  }
});

onKeyDown("g", () => (gameOver.value = true));

watch(x, (x, prevX) => {
  if (gameOver.value) {
    birdX.value += prevX - x;
  } else {
    const pipeIndex = pipes.findIndex((it) => it.x > x + 150 - 45);
    const lastPipeIndex = pipes.findIndex((it) => it.x > prevX + 150 - 45);

    if (pipeIndex !== lastPipeIndex) {
      score.value++;
    }

    const collisionPipeIndex = pipes.findIndex((it) => it.x > x + 50);

    if (collisionPipeIndex !== -1) {
      const pipe = pipes[collisionPipeIndex];
      const topBounds = new Rectangle(
        pipe.x - 45,
        pipe.y - 65 - 1000,
        90,
        1000
      );
      const bottomBounds = new Rectangle(pipe.x - 45, pipe.y + 65, 90, 1000);

      if (
        topBounds.contains(x + 150, birdY.value) ||
        bottomBounds.contains(x + 150, birdY.value)
      ) {
        gameOver.value = true;
      }
    }
  }
});

function update(dt: number) {
  birdY.value += velocityY.value * dt;
  velocityY.value += gravity * dt;

  if (pipes.length > 0 && pipes[0].x - x.value < -100) {
    pipes.splice(0, 1);
  }
}

whenever(gameOver, () => router.replace("/gameover?score=" + score.value));

const leaveProgress = ref(0);

onBeforeRouteLeave(async () => {
  const { progress } = useTransitionProgress(1500);
  syncRef(leaveProgress, progress);

  await until(progress).toBe(1);
});
</script>

<template>
  <pipes :offset="x" :pipes="pipes" :alpha="1 - leaveProgress ** 4" />
  <bird-sprite
    :x="150 + birdX + entryOffsetX"
    :angle="birdAngle"
    :y="birdY"
    :sprite-index="birdSprite"
  />
  <score-display
    :score="score"
    :x="600"
    :y="10"
    :alpha="1 - leaveProgress ** 4"
    s
  />
</template>
