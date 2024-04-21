import React, { useEffect, useState } from "react";
import "./App.css";
interface Vars {
  canvawith: number;
  canvahight: number;
  groundx: number;
  Gap: number;
  speed: number;
  gameStatus: "start" | "playing" | "gameover";
}
interface BirdY {
  birdY: number;
  velocity: number;
  gravity: number;
  dir: "up" | "down";
}
interface Pipe {
  topx: number;
  topy: number;
  bottomx: number;
  bottomy: number;
  toph: number;
  bottomh: number;
}
interface Score {
  score: number;
  bestScore: number;
}
function App() {
  const [canva, setcanva] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setctx] = useState<CanvasRenderingContext2D | null>(null);
  const [loading, setLoading] = useState(true);
  const groundRef = React.useRef<HTMLImageElement>(null);
  const skyRef = React.useRef<HTMLImageElement>(null);
  const birdRef = React.useRef<HTMLImageElement>(null);
  const pipeUpRef = React.useRef<HTMLImageElement>(null);
  const pipeDownRef = React.useRef<HTMLImageElement>(null);
  const restartRef = React.useRef<HTMLImageElement>(null);
  const scoreRef = React.useRef<HTMLImageElement>(null);
  const curentpipeindex = React.useRef<number>(0);
  const [vars, setVars] = useState({
    canvawith: 500,
    canvahight: 600,
    groundx: 0,
    Gap: 250,
    speed: 4,
    gameStatus: "start" as "start" | "playing" | "gameover",
  });
  const birdX = React.useRef<number>(0);
  const score = React.useRef<Score>({
    score: 0,
    bestScore: 0,
  });
  const birdY = React.useRef<BirdY>({
    birdY: -5,
    dir: "down",
    velocity: 0,
    gravity: 0.25, // Adjust this value to change gravity
  });
  const [pipes, setPipes] = useState<Array<Pipe>>([
    {
      topx: vars.Gap * 3,
      topy: 0,
      toph: 250,
      bottomx: vars.Gap * 3,
      bottomy: 350,
      bottomh: 200,
    },
    {
      topx: 4 * vars.Gap,
      topy: 0,
      toph: 250,
      bottomx: 4 * vars.Gap,
      bottomy: 350,
      bottomh: 200,
    },
    {
      topx: vars.Gap * 5,
      topy: 0,
      toph: 250,
      bottomx: vars.Gap * 5,
      bottomy: 350,
      bottomh: 200,
    },
  ]);
  const box = React.useRef<HTMLDivElement>(null);
  const frameCount = React.useRef<number>(0);
  useEffect(() => {
    const boxC = box.current;
    const handleclick = (e: MouseEvent) => {
      if (vars.gameStatus === "gameover") {
        const posx = e.clientX - boxC!.getBoundingClientRect().left;
        const posy = e.clientY - boxC!.getBoundingClientRect().top;

        if (
          posx > vars.canvawith / 3 + 30 &&
          posx < vars.canvawith / 3 + 130 &&
          posy > (vars.canvahight / 5) * 3 &&
          posy < (vars.canvahight / 5) * 3 + 50
        ) {
          frameCount.current = 0;

          setVars({
            ...vars,
            gameStatus: "start",
          });
          score.current!.score = 0;
          setPipes([
            {
              topx: vars.Gap * 3,
              topy: 0,
              toph: 250,
              bottomx: vars.Gap * 3,
              bottomy: 350,
              bottomh: 200,
            },
            {
              topx: 4 * vars.Gap,
              topy: 0,
              toph: 250,
              bottomx: 4 * vars.Gap,
              bottomy: 350,
              bottomh: 200,
            },
            {
              topx: vars.Gap * 5,
              topy: 0,
              toph: 250,
              bottomx: vars.Gap * 5,
              bottomy: 350,
              bottomh: 200,
            },
          ]);
        }
        return;
      }
      if (vars.gameStatus === "start") {
        setVars({
          ...vars,
          gameStatus: "playing",
        });
      }

      birdY.current.velocity = -1 * vars.speed;
    };
    boxC!.addEventListener("click", handleclick);
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

          animate(ctx, canva, vars, pipes);
        }
      }
    }
    function animate(
      ctx: CanvasRenderingContext2D,
      canva: HTMLCanvasElement,
      vars: Vars,
      pipes: Array<Pipe>
    ) {
      ctx.clearRect(0, 0, canva.width, canva.height);
      ctx.fillStyle = "#1dc5cd";
      ctx.fillRect(0, 0, canva.width, canva.height);
      const groundwidth = 37;

      // sky image
      ctx.drawImage(
        skyRef.current!,
        0,
        390,
        vars.canvawith,
        skyRef.current!.height
      );

      // Move to the next frame
      frameCount.current++;
      if (vars.gameStatus === "start") {
        if (frameCount.current % 2 === 0) {
          birdY.current.birdY += birdY.current.dir === "down" ? 1 : -1;
          if (birdY.current.birdY > 10) {
            birdY.current.dir = "up";
          }
          if (birdY.current.birdY < -10) {
            birdY.current.dir = "down";
          }
        }
      } else {
        birdY.current.birdY += birdY.current.velocity;
        birdY.current.velocity += birdY.current.gravity;
      }
      // move pipes
      if (vars.gameStatus === "playing")
        pipes.forEach((pipe) => {
          pipe.topx -= 2;
          pipe.bottomx -= 2;
          if (pipe.topx < -50) {
            pipe.topx = vars.canvawith + vars.Gap;
            pipe.bottomx = vars.canvawith + vars.Gap;
            const PipesHeight = generateRandomPairIn();
            pipe.toph = PipesHeight[0];
            pipe.bottomy = PipesHeight[1];
          }
        });

      // draw pipes
      pipes.forEach((pipe) => {
        // const PipesHeight = generateRandomPairIn(vars.canvahight - 112);

        ctx.drawImage(
          pipeDownRef.current!,
          pipe.topx,
          pipe.topy,
          50,
          pipe.toph
        );
        ctx.drawImage(
          pipeUpRef.current!,
          pipe.bottomx,
          // vars.canvahight - 100 - pipeDownRef.current!.height,
          pipe.bottomy,
          50,
          pipe.bottomh + pipeDownRef.current!.height
        );
      });
      ctx.font = "30px bayside";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";

      ctx.lineWidth = 2;
      ctx.strokeText(
        score.current!.score.toString(),
        vars.canvawith / 3 + 70,
        50
      );
      ctx.font = "28px bayside";
      ctx.fillText(
        score.current!.score.toString(),
        vars.canvawith / 3 + 70,
        51
      );
      // draw ground
      for (let i = 0; i < (vars.canvawith / groundwidth) * 2; i++) {
        ctx.drawImage(
          groundRef.current!,
          i * groundwidth + vars.groundx,
          vars.canvahight - 112
        );
      }
      // move the ground
      vars.groundx -= 2;
      if (vars.groundx < -vars.canvawith + 17) {
        vars.groundx = 0;
      }

      // draw score and best score
      if (vars.gameStatus === "gameover") {
        ctx.drawImage(
          restartRef.current!,
          vars.canvawith / 3 + 30,
          (vars.canvahight / 5) * 3,
          100,
          50
        );
        ctx.drawImage(
          scoreRef.current!,
          vars.canvawith / 3 + 10,
          vars.canvahight / 5,
          140,
          160
        );
        ctx.font = "30px bayside";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";

        ctx.lineWidth = 2;
        ctx.strokeText(
          score.current!.bestScore.toString(),
          vars.canvawith / 3 + 70,
          251
        );
        ctx.strokeText(
          score.current!.score.toString(),
          vars.canvawith / 3 + 70,
          191
        );
        ctx.font = "28px bayside";
        ctx.fillText(
          score.current!.score.toString(),
          vars.canvawith / 3 + 70,
          190
        );

        ctx.fillText(
          score.current!.bestScore.toString(),
          vars.canvawith / 3 + 70,
          250
        );
        return;
      }

      // draw bird
      ctx.drawImage(
        birdRef.current!,
        birdX.current,
        // 0,
        0,
        69,
        48,
        vars.canvawith / 2 - 24,
        vars.canvahight / 2 - 24 + birdY.current.birdY,
        50,
        40
      );

      // add bird animation
      if (frameCount.current % 7 === 0) {
        birdX.current += 69;

        // If the last frame is reached, reset to the first frame
        if (birdX.current >= birdRef.current!.width) {
          birdX.current = 0;
        }
      }
      // check if the bird hit the ground
      if (
        vars.canvahight / 2 - 24 + birdY.current.birdY > 450 ||
        vars.canvahight / 2 - 24 + birdY.current.birdY < 1
      ) {
        vars.gameStatus = "gameover";
      }

      // check if the bird hit the pipes

      const pipe = pipes[curentpipeindex.current];

      if (
        vars.canvahight / 2 - 24 + birdY.current.birdY < pipe.toph &&
        vars.canvawith / 2 - 24 + 48 > pipe.topx &&
        vars.canvawith / 2 - 24 + 48 < pipe.topx + 50
      ) {
        vars.gameStatus = "gameover";
      }
      if (
        vars.canvahight / 2 - 24 + birdY.current.birdY + 40 > pipe.bottomy &&
        vars.canvawith / 2 - 24 + 48 > pipe.bottomx &&
        vars.canvawith / 2 - 24 < pipe.bottomx + 50
      ) {
        vars.gameStatus = "gameover";
      }

      if (vars.canvawith / 2 - 24 + 48 > pipe.topx + 50) {
        score.current!.score++;
        if (score.current!.score > score.current!.bestScore) {
          score.current!.bestScore = score.current!.score;
        }
        curentpipeindex.current = (curentpipeindex.current + 1) % pipes.length;
      }

      requestAnimationFrame(() => animate(ctx, canva, vars, pipes));
    }
    return () => {
      boxC!.removeEventListener("click", handleclick);
    };
  }, [canva, ctx, vars, pipes]);

  function generateRandomPairIn(): [number, number] {
    const number = generateNumber();

    return [number - 150, number];
  }
  function generateNumber(min: number = 230, max: number = 380): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
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
      <img ref={birdRef} src="bird2.png" style={{ display: "none" }} />
      <img ref={pipeUpRef} src="PipeUp.png" style={{ display: "none" }} />
      <img ref={pipeDownRef} src="PipeDown.png" style={{ display: "none" }} />
      <img ref={restartRef} src="restart.png" style={{ display: "none" }} />
      <img ref={scoreRef} src="score.png" style={{ display: "none" }} />
    </main>
  );
}

export default App;
