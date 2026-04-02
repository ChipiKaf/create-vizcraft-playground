import type { Action, Dispatch } from "@reduxjs/toolkit";
import type { DemoPlugin, DemoStep } from "../../types/ModelPlugin";
import HelloWorldVisualization from "./main";
import helloWorldReducer, {
  type HelloWorldState,
  initialState,
  reset,
} from "./helloWorldSlice";

type LocalRootState = { helloWorld: HelloWorldState };

const HelloWorldPlugin: DemoPlugin<
  HelloWorldState,
  Action,
  LocalRootState,
  Dispatch<Action>
> = {
  id: "hello-world",
  name: "Hello World",
  description:
    "A minimal reference plugin — two nodes, one signal, three steps. Study this to learn how the plugin system works.",
  initialState,
  reducer: helloWorldReducer,
  Component: HelloWorldVisualization,
  restartConfig: { text: "Replay", color: "#1e40af" },
  getSteps: (_: HelloWorldState): DemoStep[] => [
    {
      label: "Idle",
      autoAdvance: false,
      nextButtonText: "Send Signal",
    },
    {
      label: "Signal in flight",
      autoAdvance: true,
      processingText: "Sending…",
    },
    {
      label: "Delivered",
      autoAdvance: true,
    },
  ],
  init: (dispatch) => {
    dispatch(reset());
  },
  selector: (state: LocalRootState) => state.helloWorld,
};

export default HelloWorldPlugin;
