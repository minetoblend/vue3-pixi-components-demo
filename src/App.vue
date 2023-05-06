<script setup lang="ts">
import { useRoute } from "vue-router";
import Ground from "./components/Ground.vue";
import ScaleMaintianingContainer from "./components/ScaleMaintianingContainer.vue";
import SkyBackground from "./components/SkyBackground.vue";
import { computed, ref } from "vue";
import { Graphics } from "pixi.js";

const route = useRoute();

const isGameScreen = computed(() => route.name === "game");

const mask = ref<Graphics>();

function drawMask(mask: Graphics) {
  mask.beginFill(0xffffff).drawRect(0, 0, 640, 480).endFill();
}
</script>

<template>
  <ScaleMaintianingContainer>
    <graphics ref="mask" :is-mask="true" @draw="drawMask" />
    <container :mask="mask">
      <Suspense>
        <container>
          <SkyBackground :blur="!isGameScreen" />
        <RouterView />
        <Ground />
        </container>
      </Suspense>
    </container>
  </ScaleMaintianingContainer>
</template>
