import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [canva, setcanva] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setctx] = useState<CanvasRenderingContext2D | null>(null);
  const [loading, setLoading] = useState(true);
  const [vars, setVars] = useState({
    canvawith: 500,
    canvahight: 600,
  });
  const box = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (box.current) {
      // check if the box is already has a canvas

      if (box.current.querySelector("canvas")) {
        box.current.removeChild(box.current.querySelector("canvas")!);
      }
      if (!canva) {
        const canvas = document.createElement("canvas");
        canvas.width = vars.canvawith;
        canvas.height = vars.canvahight;
        setcanva(canvas);
      } else {
        box.current.appendChild(canva);
        if (!ctx) {
          const ctxv = canva.getContext("2d");
          if (ctxv) {
            setctx(ctxv);
          }
        } else {
          ctx.fillStyle = "#70c5cd";
          ctx.fillRect(0, 0, canva.width, canva.height);
          const sky = new Image();
          sky.src = "/sky.png";
          const land = new Image();
          land.src = "/land.png";
          land.onload = () => {
            ctx.drawImage(
              land,
              0,
              vars.canvahight - land.height,
              vars.canvawith,
              land.height
            );
          };
          sky.onload = () => {
            ctx.drawImage(sky, 0, 390, vars.canvawith, sky.height);
          };
          setLoading(false);
        }
      }
    }
  }, [canva, ctx, vars]);
  return (
    <main className="main">
      <div className="globe"></div>
      <div
        className="globe"
        style={{
          left: "100%",
        }}
      ></div>
      <div className="title">
        Flappy Bird Game
        <span className="tag">test</span>
      </div>

      <div
        ref={box}
        className="box"
        style={{
          display: loading || !canva ? "none" : "block",
          height: vars.canvahight,
          width: vars.canvawith,
        }}
      ></div>
    </main>
  );
}

export default App;
