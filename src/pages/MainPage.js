import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

import AdsContainer from "../components/AdsContainer";
import { ABI } from "../assets/abiobj";

export const MainPage = () => {
  const navigate = useNavigate();
  // 기록
  const [contractInstance, setContractInstance] = useState(undefined);
  const address = "0xD0414937aeD63aC6bde8B0abd9E31Af040B65495";
  const [countDown, setCountDown] = useState();
  const [account, setAccount] = useState();
  const [data, setData] = useState();
  const [bestScore, setBestScore] = useState({ h: 0, m: 0, s: 0, ms: 0 });

  const handleBestScore = (data) => {
    const ms = data % 1000;
    const seconds = parseInt(data / 1000);
    setBestScore({
      ms,
      s: seconds % 60,
      m: parseInt(seconds / 60),
      h: parseInt(seconds / 3600),
    });
  };

  const convertTime = () => {
    const now = new Date().getTime();
    const date = new Date(data[0] * 1000).getTime();
    var diff = date - now;
    const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHour = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const diffMin = Math.floor((diff / (1000 * 60)) % 60);
    const diffSec = Math.floor((diff / 1000) % 60);
    setCountDown({ day: diffDay, hour: diffHour, min: diffMin, sec: diffSec });
  };

  const handleDistributePrize = async () => {
    await contractInstance.methods.distributePrize().send({ from: account });
  };

  // contract instance
  const getInstance = async () => {
    try {
      setContractInstance(await new window.web3.eth.Contract(ABI, address));
    } catch (err) {}
  };

  // game info, 상금, 최고기록 등 정보
  const getGameInfo = async () => {
    try {
      const data = await contractInstance.methods.getAllInfo().call();
      setData(data);
      handleBestScore(data[5]);
    } catch (err) {
      console.log(err);
    }
  };

  const Timer = () => {
    setInterval(convertTime, 1000);
  };

  // metamask 연결
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    await setAccount(accounts[0]);
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      try {
        window.web3 = new Web3(window.ethereum);
        connectWallet();
        getInstance();
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      Timer();
    }
  }, [data]);

  useEffect(() => {
    if (contractInstance) {
      getGameInfo();
    }
  }, [contractInstance]);

  return (
    <MainContainer>
      <MainBanner>
        <h1>Total: {data ? data[2] / 1000000000000000000 : null}ETH</h1>
        <h1>
          Best:{" "}
          {`${String(bestScore.h).padStart(2, "0")}(h) : ${String(
            bestScore.m
          ).padStart(2, "0")}(m) : ${String(bestScore.s).padStart(
            2,
            "0"
          )}(s) : ${String(bestScore.ms).padStart(2, "0")}(ms) - ${
            data ? data[3] : ""
          }`}
        </h1>
        {countDown &&
        countDown.day >= 0 &&
        countDown.hour >= 0 &&
        countDown.min >= 0 &&
        countDown.sec >= 0 ? (
          <h2>
            {countDown.day}일 {countDown.hour}시간 {countDown.min}분{" "}
            {countDown.sec}초
          </h2>
        ) : (
          <h2>새로운 게임을 생성해주세요</h2>
        )}
      </MainBanner>
      <BodyContainer>
        <AdsContainer />
        <Main>
          {data &&
          countDown &&
          countDown.day >= 0 &&
          countDown.hour >= 0 &&
          countDown.min >= 0 &&
          countDown.sec >= 0 ? (
            <Button onClick={() => navigate("/game")}>
              <h2>Get started</h2>
            </Button>
          ) : (
            <Button onClick={handleDistributePrize}>
              <h2>정산 후 새 게임 생성</h2>
            </Button>
          )}
          <br></br>
          <a href="https://youtu.be/N-r4XH8DAiY">
            시연 동영상 https://youtu.be/N-r4XH8DAiY
          </a>
        </Main>
        <AdsContainer />
      </BodyContainer>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

const MainBanner = styled.div`
  width: 100%;
  height: 40%;
  background-image: url(https://satoshidice.com/static/satoshi-dice-header-transparent-e4621067994134bca386e2f270ecf408.png),
    linear-gradient(to right, rgb(131, 96, 195), rgb(46, 191, 145));

  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BodyContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 216px 2fr 216px;
`;

const Main = styled.main`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Button = styled.div`
  border: 2px solid black;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 225px;
  height: 45px;
  border-radius: 10px;
  cursor: pointer;

  h2 {
    margin: 0;
    padding: 0;
  }
`;
