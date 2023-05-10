import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import "../App.css";
import CanvasGame from "../components/CanvasGame";

export const GamePage = () => {
  const { contractInstance, account } = useLocation();
  const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });
  const [interv, setInterv] = useState();

  const start = () => {
    run();
    setInterv(setInterval(run, 10));
  };

  const stop = () => {
    clearInterval(interv);
    // setTime({ ms: 0, s: 0, m: 0, h: 0 });

    // 기록 갱신 여부 체크
    gameOver();
  };

  const gameOver = async () => {
    await contractInstance.methods
      .updateRecord(time.h + time.m * 60 + time.s * 360 + time.ms * 3600)
      .send({ from: account });
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
        </div>
      </div>
      <GameContainer>
        <CanvasGame timerStart={start} timerStop={stop} />
      </GameContainer>
    </div>
  );
};

const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 2px solid #00aba9;
  width: 700px;
  height: 400px;
`;
