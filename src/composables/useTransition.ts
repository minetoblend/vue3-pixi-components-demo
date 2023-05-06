import { until, useRafFn } from "@vueuse/core";
import { ref } from "vue";

export function useTransitionProgress(duration: number = 200) {
  const progress = ref(0);
  let firstRun = true;

  const { pause } = useRafFn(({ delta }) => {
    if (firstRun) {
      delta = 0;
      firstRun = false;
    }

    progress.value = Math.min(progress.value + delta / duration, 1);
  });

  until(progress).toBe(1).then(pause);

  return { progress };
}
