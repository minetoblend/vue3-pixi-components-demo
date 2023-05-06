import { RouteRecordRaw, createMemoryHistory, createRouter } from "vue-router";

import MainMenu from "./screens/MainMenu.vue";
import GameScreen from "./screens/GameScreen.vue";
import GameOverScreen from "./screens/GameOverScreen.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    name: "mainMenu",
    component: MainMenu,
  },
  {
    path: "/game",
    name: "game",
    component: GameScreen,
  },
  {
    path: "/gameover",
    name: "gameover",
    component: GameOverScreen,
  },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
