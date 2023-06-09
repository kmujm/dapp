import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CanvasGame = ({ timer, timerStart, timerStop }) => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [ballSize, setBallSize] = useState(50);
  const [x, setX] = useState(350);
  const [y, setY] = useState(200);
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);
  const [vx, setVx] = useState(2);
  const [vy, setVy] = useState(2);
  const [isClicked, setIsClicked] = useState(false);
  const [gameOver, setGameOver] = useState(false);

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
      if (isClicked && !gameOver) {
        const nextX = x + vx;
        const nextY = y + vy;

        // update position
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

        // game over
        if (
          clientX < x - ballSize ||
          clientX > x + ballSize ||
          clientY < y - ballSize ||
          clientY > y + ballSize
        ) {
          setIsClicked(false);
          setVx(0);
          setVy(0);
          timerStop();
          setGameOver(true);
          alert(
            `Your score is ${String(timer.h).padStart(2, "0")} : ${String(
              timer.m
            ).padStart(2, "0")} : ${String(timer.s).padStart(
              2,
              "0"
            )} : ${String(timer.ms).padStart(2, "0")}`
          );
          navigate("/");
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      updateBall();
      drawBall();
    };

    const handleClick = (e) => {
      if (!isClicked && !gameOver) {
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;

        if (
          mouseX >= x - ballSize &&
          mouseX <= x + ballSize &&
          mouseY <= y + ballSize &&
          mouseY >= y - ballSize
        ) {
          setIsClicked(true);
          timerStart();
        }
      }
    };

    const handleMouseMove = (e) => {
      const mouseX = e.clientX - canvas.offsetLeft;
      const mouseY = e.clientY - canvas.offsetTop;

      setClientY(mouseY);
      setClientX(mouseX);
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);

    const animationId = setInterval(draw, 10);

    return () => {
      clearInterval(animationId);
      canvas.removeEventListener("click", handleClick);
    };
  }, [x, y, vx, vy, isClicked]);

  return (
    <canvas
      style={{ border: "2px solid #00aba9" }}
      width={700}
      height={400}
      ref={canvasRef}
    />
  );
};

export default CanvasGame;
