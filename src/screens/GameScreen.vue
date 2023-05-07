<script setup lang="ts">
import { syncRef, until, whenever } from "@vueuse/core";
import { Rectangle } from "pixi.js";
import { ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import Bird from "../components/Bird.vue";
import Pipes from "../components/Pipes.vue";
import ScoreDisplay from "../components/ScoreDisplay.vue";
import { useGroundPosition } from "../composables/useGroundPosition";
import { usePipeSpawner } from "../composables/usePipeSpawner";
import { useTransitionProgress } from "../composables/useTransition";
import { router } from "../router";

const birdY = ref(150);
const birdX = ref(0);
const gameOver = ref(false);
const score = ref(0);

const { x: groundX } = useGroundPosition();

const { pipes } = usePipeSpawner(groundX, gameOver, 300, 800);

watch(groundX, (x, prevX) => {
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

whenever(gameOver, () => router.replace("/gameover?score=" + score.value));

const leaveProgress = ref(0);

onBeforeRouteLeave(async () => {
  const { progress } = useTransitionProgress(1500);
  syncRef(leaveProgress, progress);

  await until(progress).toBe(1);
});
</script>

<template>
  <pipes :offset="groundX" :pipes="pipes" :alpha="1 - leaveProgress ** 4" />
  <bird
    v-model:x="birdX"
    v-model:y="birdY"
    :disabled="gameOver"
    @die="gameOver = true"
  />
  <score-display
    :score="score"
    :x="600"
    :y="10"
    :alpha="1 - leaveProgress ** 4"
  />
</template>
