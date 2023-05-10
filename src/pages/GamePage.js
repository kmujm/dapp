import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import "../App.css";
import CanvasGame from "../components/CanvasGame";

import Web3 from "web3";
import { ABI } from "../assets/abi";

export const GamePage = () => {
  const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });
  const [interv, setInterv] = useState();
  const [account, setAccount] = useState("");
  const [nickname, setNickname] = useState("");
  const [gameStart, setGameStart] = useState(false);

  const address = "0xD0414937aeD63aC6bde8B0abd9E31Af040B65495";

  // 이더리움 객체 가져오기
  const [web3, setWeb3] = useState();
  const [contractInstance, setContractInstance] = useState(undefined);

  // contract instance
  const getInstance = async () => {
    // console.log(web3);
    try {
      setContractInstance(await new window.web3.eth.Contract(ABI, address));
    } catch (err) {
      console.log(err);
    }
  };

  // metamask 연결
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    // const accounts = await web3.eth.requestAccounts();
    await setAccount(accounts[0]);
    console.log(account);
  };

  // 최초 랜더링시 실행
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      try {
        window.web3 = new Web3(window.ethereum);
        // setWeb3(window.web3);
        // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        connectWallet();
        getInstance();
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

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

  const handleGameStart = () => {
    if (!account) {
      alert("지갑을 연결해 주세요!!");
    } else if (!contractInstance) {
      alert("스마트 컨트랙트를 연결중입니다. 잠시만 기다려주세요!");
    } else {
      setGameStart(true);
    }
  };

  return (
    <div className="game-container">
      {gameStart && contractInstance && account ? (
        <>
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
        </>
      ) : (
        <InputContainer>
          <InputBar
            onChange={(e) => setNickname(e.target.value)}
            value={nickname}
            placeholder={"Input your nickname"}
          />
          <Button onClick={handleGameStart}>Set</Button>
        </InputContainer>
      )}
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

const InputBar = styled.input`
  display: block;
  width: 20%;
  height: 30px;
  border: 1px dashed #00aba9;
  border-radius: 10px;
  padding: 0 5px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
  color: white;
`;

const Button = styled.div`
  background-color: #00aba9;
  padding: 15px 15px;
  border-radius: 10%;
  cursor: pointer;
`;
