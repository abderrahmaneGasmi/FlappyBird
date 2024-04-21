import React, { useEffect, useState } from "react";
import "./App.css";
interface Vars {
  canvawith: number;
  canvahight: number;
  groundx: number;
}
interface BirdY {
  birdY: number;
  dir: "up" | "down";
}
function App() {
  const [canva, setcanva] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setctx] = useState<CanvasRenderingContext2D | null>(null);
  const [loading, setLoading] = useState(true);
  const groundRef = React.useRef<HTMLImageElement>(null);
  const skyRef = React.useRef<HTMLImageElement>(null);
  const birdRef = React.useRef<HTMLImageElement>(null);
  const [vars, setVars] = useState({
    canvawith: 500,
    canvahight: 600,
    groundx: 0,
  });
  const birdX = React.useRef<number>(0);
  const birdY = React.useRef<BirdY>({
    birdY: -5,
    dir: "down",
  });
  const box = React.useRef<HTMLDivElement>(null);
  const frameCount = React.useRef<number>(0);
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

          const groundwidth = 37;
          // repeat the ground image to fill the canvas width
          for (let i = 0; i < vars.canvawith / groundwidth; i++) {
            ctx.drawImage(
              groundRef.current!,
              i * groundwidth,
              vars.canvahight - 112
            );
          }

          ctx.drawImage(
            skyRef.current!,
            0,
            390,
            vars.canvawith,
            skyRef.current!.height
          );
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
      const groundwidth = 37;
      // repeat the ground image to fill the canvas width
      for (let i = 0; i < (vars.canvawith / groundwidth) * 2; i++) {
        ctx.drawImage(
          groundRef.current!,
          i * groundwidth + vars.groundx,
          vars.canvahight - 112
        );
      }
      ctx.drawImage(
        skyRef.current!,
        0,
        390,
        vars.canvawith,
        skyRef.current!.height
      );

      ctx.drawImage(
        birdRef.current!,
        birdX.current,
        0,
        92,
        64,
        vars.canvawith / 2 - 46,
        vars.canvahight / 2 - 32 + birdY.current.birdY,
        92,
        64
      );

      // Move to the next frame
      frameCount.current++;
      if (frameCount.current % 2 === 0) {
        birdY.current.birdY += birdY.current.dir === "down" ? 1 : -1;
        if (birdY.current.birdY > 10) {
          birdY.current.dir = "up";
        }
        if (birdY.current.birdY < -10) {
          birdY.current.dir = "down";
        }
      }
      // Move to the next frame every 5 frames
      if (frameCount.current % 7 === 0) {
        birdX.current += 92;

        // If the last frame is reached, reset to the first frame
        if (birdX.current >= birdRef.current!.width) {
          birdX.current = 0;
        }
      }
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
      <img ref={skyRef} src="sky.png" style={{ display: "none" }} />
      <img ref={birdRef} src="bird.png" style={{ display: "none" }} />
    </main>
  );
}

export default App;
