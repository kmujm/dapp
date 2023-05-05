import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import "../App.css";
import CanvasGame from "../components/CanvasGame";

export const GamePage = () => {
  const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });
  const [interv, setInterv] = useState();
  const targetRef = useRef();
  const [gameStart, setGameStart] = useState(false);

  const start = () => {
    run();
    setInterv(setInterval(run, 10));
    setGameStart(true);
    handleStartClick();
  };

  const stop = () => {
    clearInterval(interv);
    setGameStart(false);
    setTime({ ms: 0, s: 0, m: 0, h: 0 });
  };

  let updatedMs = time.ms,
    updatedS = time.s,
    updatedM = time.m,
    updatedH = time.h;

  const run = () => {
    if (updatedM === 60) {
      updatedH++;
      updatedM = 0;
    }
    if (updatedS === 60) {
      updatedM++;
      updatedS = 0;
    }
    if (updatedMs === 100) {
      updatedS++;
      updatedMs = 0;
    }
    updatedMs++;
    return setTime({ ms: updatedMs, s: updatedS, m: updatedM, h: updatedH });
  };

  const timer = () => {
    if (time.h === 0) {
      return "";
    } else {
      return <span>{time.h >= 10 ? time.h : "0" + time.h}</span>;
    }
  };

  const boardRef = useRef(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetPos, setTargetPos] = useState({
    top: Math.floor(Math.random() * 401),
    left: Math.floor(Math.random() * 800),
  });
  useEffect(() => {
    if (gameStart) {
      const interval = setInterval(() => {
        const distanceX = targetPos.left - position.left;
        const distanceY = targetPos.top - position.top;

        // 현재 위치와 목표 위치 간의 거리를 계산합니다.
        const distance = Math.sqrt(
          Math.pow(distanceX, 2) + Math.pow(distanceY, 2)
        );

        // 이동할 거리를 계산합니다.
        const moveDistance = distance > 10 ? 10 : distance;

        // 현재 위치와 목표 위치 간의 각도를 계산합니다.
        const angle = Math.atan2(distanceY, distanceX);

        // 새로운 위치를 계산합니다.
        const newPos = {
          top: position.top + moveDistance * Math.sin(angle),
          left: position.left + moveDistance * Math.cos(angle),
        };

        setPosition(newPos);

        // 새로운 목표 위치를 계산합니다.
        if (distance < 10) {
          setTargetPos({
            top: Math.floor(Math.random() * 401),
            left: Math.floor(Math.random() * 800),
          });
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [gameStart, position, targetPos]);

  const handleStartClick = () => {
    setTimeout(() => {
      setGameStart(true);
    }, 3000);
  };

  const targetStyle = {
    position: "relative",
    top: position.top,
    left: position.left,
    transition: "all 1s ease",
    width: "40px",
    height: "40px",
    backgroundColor: "black",
  };

  const handleMouseMove = (event) => {
    let coord = [event.clientX, event.clientY];
    if (gameStart) {
      alert(
        `${time.m >= 10 ? time.m : "0" + time.m}m ${
          time.s >= 10 ? time.s : "0" + time.s
        }s ${time.ms >= 10 ? time.ms : "0" + time.ms}ms 기록`
      );
    }
    stop();
  };

  return (
    <div className="game-container">
      <div className="clock-holder">
        <div className="stopwatch">
          <div>
            {timer()}&nbsp;&nbsp;
            <span>{time.m >= 10 ? time.m : "0" + time.m}</span>&nbsp;:&nbsp;
            <span>{time.s >= 10 ? time.s : "0" + time.s}</span>&nbsp;:&nbsp;
            <span>{time.ms >= 10 ? time.ms : "0" + time.ms}</span>
          </div>
          <button className="stopwatch-btn stopwatch-btn-gre" onClick={start}>
            Start
          </button>
        </div>
      </div>
      {/* <div className="game-container board" ref={boardRef}>
        <div className="target-dot" style={targetStyle} ref={targetRef}></div>
        <svg
          height={window.innerHeight}
          width={window.innerWidth}
          onMouseMove={(event) => handleMouseMove(event)}
        ></svg>
      </div> */}
      <GameContainer>
        <CanvasGame />
      </GameContainer>
    </div>
  );
};

const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  border: 2px solid #00aba9;
`;
