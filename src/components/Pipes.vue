<script setup lang="ts">
import { PipeInfo } from "../interfaces";
import Pipe from "./Pipe.vue";

defineProps<{
  pipes: PipeInfo[];
  offset: number;
}>();
</script>

<template>
  <container>
    <Pipe
      v-for="pipe in pipes"
      :key="pipe.x"
      :x="pipe.x - offset"
      :y="pipe.y"
    />
  </container>
</template>
