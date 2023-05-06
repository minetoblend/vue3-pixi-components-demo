import "./style.css";
import App from "./App.vue";
import { createPixiApp } from "vue3-pixi-components";
import { Application } from "pixi.js";
import { router } from "./router";

const app = new Application({
  resizeTo: window,
  antialias: true
});

document.body.appendChild(app.view as HTMLCanvasElement);

createPixiApp(App).provide("app", app).use(router).mount(app.stage);
