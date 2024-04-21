import React, { useEffect, useState } from "react";
import "./App.css";
interface Vars {
  canvawith: number;
  canvahight: number;
  groundx: number;
}
function App() {
  const [canva, setcanva] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setctx] = useState<CanvasRenderingContext2D | null>(null);
  const [loading, setLoading] = useState(true);
  const groundRef = React.useRef<HTMLImageElement>(null);
  const [vars, setVars] = useState({
    canvawith: 500,
    canvahight: 600,
    groundx: 0,
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

          const groundwidth = 37;
          // repeat the ground image to fill the canvas width
          for (let i = 0; i < vars.canvawith / groundwidth; i++) {
            ctx.drawImage(
              groundRef.current!,
              i * groundwidth,
              vars.canvahight - 112
            );
          }

          sky.onload = () => {
            ctx.drawImage(sky, 0, 390, vars.canvawith, sky.height);
          };
          setLoading(false);

          animate(ctx, canva, vars);
        }
      }
    }
    function animate(
      ctx: CanvasRenderingContext2D,
      canva: HTMLCanvasElement,
      vars: Vars
    ) {
      ctx.clearRect(0, 0, canva.width, canva.height);
      ctx.fillStyle = "#1dc5cd";
      ctx.fillRect(0, 0, canva.width, canva.height);
      const sky = new Image();
      const groundwidth = 37;
      // repeat the ground image to fill the canvas width
      for (let i = 0; i < (vars.canvawith / groundwidth) * 2; i++) {
        ctx.drawImage(
          groundRef.current!,
          i * groundwidth + vars.groundx,
          vars.canvahight - 112
        );
      }
      sky.onload = () => {
        ctx.drawImage(sky, 0, 390, vars.canvawith, sky.height);
      };
      vars.groundx -= 2;
      if (vars.groundx < -vars.canvawith + 17) {
        vars.groundx = 0;
      }
      // }
      requestAnimationFrame(() => animate(ctx, canva, vars));
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
      <img ref={groundRef} src="ground.png" style={{ display: "none" }} />
    </main>
  );
}

export default App;
