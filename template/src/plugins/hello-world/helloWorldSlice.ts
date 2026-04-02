import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type HelloWorldPhase = "idle" | "greeting" | "done";

export interface HelloWorldState {
  phase: HelloWorldPhase;
  message: string;
}

export const initialState: HelloWorldState = {
  phase: "idle",
  message: "Press Next to see the plugin system in action.",
};

const helloWorldSlice = createSlice({
  name: "helloWorld",
  initialState,
  reducers: {
    patchState(state, action: PayloadAction<Partial<HelloWorldState>>) {
      Object.assign(state, action.payload);
    },
    reset() {
      return initialState;
    },
  },
});

export const { patchState, reset } = helloWorldSlice.actions;
export default helloWorldSlice.reducer;
