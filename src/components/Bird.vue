<script setup lang="ts">
import {
  onKeyDown,
  useEventListener,
  useVModels,
  whenever,
} from "@vueuse/core";
import { Ticker } from "pixi.js";
import { computed, onBeforeUnmount, ref } from "vue";
import { useTransitionProgress } from "../composables/useTransition";
import BirdSprite from "./BirdSprite.vue";

const props = defineProps<{
  x: number;
  y: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (name: "die"): void;
  (name: "update:x", x: number): void;
  (name: "update:y", y: number): void;
}>();

const { progress: entryProgress } = useTransitionProgress(800);
const entryOffsetX = computed(() => (1 - entryProgress.value) ** 2 * -200);

const { x, y } = useVModels(props);

const velocityY = ref(-11);
const gravity = 0.6;

const angle = computed(() => velocityY.value * 2.5);

const spriteIndex = computed(() => {
  if (velocityY.value < -2) return 0;
  if (velocityY.value > 2) return 2;
  return 1;
});

Ticker.shared.add(update);
onBeforeUnmount(() => Ticker.shared.remove(update));

function update(dt: number) {
  y.value += velocityY.value * dt;
  velocityY.value += gravity * dt;
}

function jump() {
  if (!props.disabled) velocityY.value = -11;
}

onKeyDown(" ", jump);

useEventListener("pointerdown", jump);

whenever(
  () => y.value > 379,
  () => {
    y.value = 379;
    velocityY.value = 0;
    emit("die");
  }
);

whenever(
  () => y.value < 10,
  () => {
    y.value = 10;
    velocityY.value = 0;
  }
);
</script>

<template>
  <BirdSprite
    :x="150 + x + entryOffsetX"
    :y="y"
    :angle="angle"
    :sprite-index="spriteIndex"
  />
</template>
