import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { SignalOverlayParams } from "vizcraft";
import { type RootState } from "../../store/store";
import { patchState, reset } from "./helloWorldSlice";

export type Signal = { id: string } & SignalOverlayParams;

export const useHelloWorldAnimation = (onAnimationComplete?: () => void) => {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((state: RootState) => state.simulation);
  const runtime = useSelector((state: RootState) => state.helloWorld);
  const [signals, setSignals] = useState<Signal[]>([]);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const onCompleteRef = useRef(onAnimationComplete);

  onCompleteRef.current = onAnimationComplete;

  const cleanup = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
    setSignals([]);
  }, []);

  const sleep = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        timeoutsRef.current.push(id);
      }),
    [],
  );

  const finish = useCallback(() => onCompleteRef.current?.(), []);

  useEffect(() => {
    cleanup();

    const run = async () => {
      switch (currentStep) {
        case 0:
          dispatch(reset());
          finish();
          break;

        case 1:
          dispatch(
            patchState({
              phase: "greeting",
              message: "A signal is traveling between the two nodes.",
            }),
          );
          setSignals([
            {
              id: "hello-sig",
              from: "sender",
              to: "receiver",
              progress: 0,
              magnitude: 1,
            },
          ]);
          await sleep(1400);
          setSignals([
            {
              id: "hello-sig",
              from: "sender",
              to: "receiver",
              progress: 1,
              magnitude: 1,
            },
          ]);
          await sleep(400);
          finish();
          break;

        case 2:
          dispatch(
            patchState({
              phase: "done",
              message:
                "Signal delivered! This is how every plugin works — define nodes, edges, signals, and step logic.",
            }),
          );
          setSignals([]);
          await sleep(200);
          finish();
          break;

        default:
          finish();
      }
    };

    run();
    return cleanup;
  }, [currentStep]);

  return { runtime, currentStep, signals };
};
