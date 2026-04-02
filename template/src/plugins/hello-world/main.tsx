import React, { useLayoutEffect, useRef, useEffect } from "react";
import {
  viz,
  type PanZoomController,
  type SignalOverlayParams,
} from "vizcraft";
import {
  useConceptModal,
  ConceptPills,
  PluginLayout,
  StageHeader,
  StatBadge,
  SidePanel,
  SideCard,
  CanvasStage,
} from "../../components/plugin-kit";
import { concepts, type ConceptKey } from "./concepts";
import {
  useHelloWorldAnimation,
  type Signal,
} from "./useHelloWorldAnimation";
import "./main.scss";

interface Props {
  onAnimationComplete?: () => void;
}

const W = 900;
const H = 500;

const HelloWorldVisualization: React.FC<Props> = ({ onAnimationComplete }) => {
  const { runtime, currentStep, signals } =
    useHelloWorldAnimation(onAnimationComplete);
  const { openConcept, ConceptModal } = useConceptModal<ConceptKey>(concepts);
  const containerRef = useRef<HTMLDivElement>(null!);
  const builderRef = useRef<ReturnType<typeof viz> | null>(null);
  const pzRef = useRef<PanZoomController | null>(null);

  const { phase, message } = runtime;
  const isGreeting = phase === "greeting" || phase === "done";

  /* ── Build VizCraft scene ─────────────────────────────── */
  const scene = (() => {
    const b = viz().view(W, H);

    b.node("sender")
      .at(200, 250)
      .rect(140, 60, 12)
      .fill(isGreeting ? "#1e40af" : "#0f172a")
      .stroke(isGreeting ? "#60a5fa" : "#334155", 2)
      .label("Sender", { fill: "#fff", fontSize: 14, fontWeight: "bold" });

    b.node("receiver")
      .at(650, 250)
      .rect(140, 60, 12)
      .fill(phase === "done" ? "#065f46" : "#0f172a")
      .stroke(phase === "done" ? "#34d399" : "#334155", 2)
      .label("Receiver", { fill: "#fff", fontSize: 14, fontWeight: "bold" });

    b.edge("sender", "receiver", "link")
      .stroke("#475569", 2)
      .animate("flow", { duration: "3s" });

    if (signals.length > 0) {
      b.overlay((o) => {
        signals.forEach((sig) => {
          const { id, ...params } = sig;
          o.add("signal", params as SignalOverlayParams, { key: id });
        });
      });
    }

    return b;
  })();

  /* ── Mount / destroy ────────────────────────────────── */
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const saved = pzRef.current?.getState() ?? null;
    builderRef.current?.destroy();
    builderRef.current = scene;
    pzRef.current =
      scene.mount(containerRef.current, {
        autoplay: true,
        panZoom: true,
        initialZoom: saved?.zoom ?? 1,
        initialPan: saved?.pan ?? { x: 0, y: 0 },
      }) ?? null;
  }, [scene]);

  useEffect(() => {
    return () => {
      builderRef.current?.destroy();
      builderRef.current = null;
      pzRef.current = null;
    };
  }, []);

  /* ── Pills ──────────────────────────────────────────── */
  const pills = [
    {
      key: "how-plugins-work",
      label: "How Plugins Work",
      color: "#93c5fd",
      borderColor: "#3b82f6",
    },
  ];

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="hello-world-root">
      <PluginLayout
        toolbar={<ConceptPills pills={pills} onOpen={openConcept} />}
        canvas={
          <div className="hello-world-stage">
            <StageHeader title="Hello World" subtitle="A minimal reference plugin">
              <StatBadge
                label="Phase"
                value={phase}
                className={`hello-world-phase hello-world-phase--${phase}`}
              />
            </StageHeader>
            <CanvasStage canvasRef={containerRef} />
          </div>
        }
        sidebar={
          <SidePanel>
            <SideCard label="What's happening" variant="explanation">
              <p>{message}</p>
            </SideCard>
            <SideCard label="Current step" variant="info">
              <p style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
                {currentStep}
              </p>
            </SideCard>
          </SidePanel>
        }
      />
      <ConceptModal />
    </div>
  );
};

export default HelloWorldVisualization;
