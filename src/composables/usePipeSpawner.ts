import { PipeInfo } from "../interfaces";
import { Ref, reactive, watch } from "vue";

export function usePipeSpawner(
  groundX: Readonly<Ref<number>>,
  gameOver: Readonly<Ref<boolean>>,
  pipeDistance: number,
  firstPipe: number
) {
  const pipes = reactive([] as PipeInfo[]);

  function spawnPipe(x: number) {
    pipes.push({
      x,
      y: Math.random() * 175 + 100,
    });
  }

  spawnPipe(firstPipe);

  watch(groundX, (x, prevX) => {
    const pipeX = Math.floor(x / pipeDistance) * pipeDistance + 800;
    if (
      pipeX !== Math.floor(prevX / pipeDistance) * pipeDistance + 800 &&
      !gameOver.value
    ) {
      spawnPipe(pipeX);
    }

    if (pipes.length > 0 && pipes[0].x - groundX.value < -100) {
      pipes.splice(0, 1);
    }
  });

  return { pipes };
}
