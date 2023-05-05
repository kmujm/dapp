import React, { useRef, useState, useEffect } from "react";

const CanvasGame = (width, height) => {
  const canvasRef = useRef(null);
  const [ballSize, setBallSize] = useState(50);
  const [x, setX] = useState(350);
  const [y, setY] = useState(200);
  const [vx, setVx] = useState(2);
  const [vy, setVy] = useState(2);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballSize, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    };

    const updateBall = () => {
      if (isClicked) {
        const nextX = x + vx;
        const nextY = y + vy;

        if (nextX + ballSize > width || nextX - ballSize < 0) {
          setVx(-vx);
        } else {
          setX(nextX);
        }

        if (nextY + ballSize > height || nextY - ballSize < 0) {
          setVy(-vy);
        } else {
          setY(nextY);
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      updateBall();
      drawBall();
      window.requestAnimationFrame(draw);
    };

    const handleClick = (e) => {
      if (!isClicked) {
        console.log("clicked");
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;
        console.log(mouseX);

        if (
          mouseX >= x - ballSize &&
          mouseX <= x + ballSize &&
          mouseY <= y + ballSize &&
          mouseY >= y - ballSize
        ) {
          setIsClicked(true);
        }
      }
    };

    const handleMouseMove = (e) => {
      const mouseX = e.clientX - canvas.offsetLeft;
      const mouseY = e.clientY - canvas.offsetTop;
      console.log(isClicked);

      //   console.log(isClicked);
      //   console.log(mouseX);
      //   //   console.log(mouseY);
      //   console.log(x);

      if (isClicked) {
        if (
          mouseX < x - ballSize ||
          mouseX > x + ballSize ||
          mouseY > y + ballSize ||
          mouseY < y - ballSize
        ) {
          console.log([x, mouseX, y, mouseY]);
          setIsClicked(false);
        }
      }
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);

    const animationId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationId);
      canvas.removeEventListener("click", handleClick);
    };
  }, [x, y, vx, vy, isClicked]);

  return (
    <canvas
      style={{ border: "1px solid black" }}
      width={700}
      height={400}
      ref={canvasRef}
    />
  );
};

export default CanvasGame;
