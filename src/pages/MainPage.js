import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

import AdsContainer from "../components/AdsContainer";
import { ABI } from "../assets/abiobj";

export const MainPage = () => {
  const navigate = useNavigate();

  const [contractInstance, setContractInstance] = useState();

  const [data, setData] = useState();

  const [countDown, setCountDown] = useState();

  // contract address
  const address = "0xD0414937aeD63aC6bde8B0abd9E31Af040B65495";

  let bestTime = {
    m: 12,
    s: 5,
    ms: 88,
  };

  // game info, 상금, 최고기록 등 정보
  const getGameInfo = async () => {
    try {
      const data = await contractInstance.methods.getAllInfo().call();
      console.log(data);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (data) {
      Timer();
    }
  }, [data]);

  // contract instance 생성 후 game info get
  useEffect(() => {
    console.log(contractInstance);
    getGameInfo();
    // checkGameState();
  }, [contractInstance]);

  // contract instance
  const getInstance = async () => {
    // console.log(web3);
    try {
      setContractInstance(await new window.web3.eth.Contract(ABI, address));
    } catch (err) {
      console.log(err);
    }
  };

  // 최초 랜더링시 실행
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      try {
        window.web3 = new Web3(window.ethereum);
        // setWeb3(window.web3);
        // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

        getInstance();
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const Timer = () => {
    setInterval(convertTime, 1000);
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

  return (
    <MainContainer>
      <MainBanner>
        {countDown ? (
          <h2>
            {countDown.day}일 {countDown.hour}시간 {countDown.min}분
            {countDown.sec} 초
          </h2>
        ) : null}
        <h1>Total: {data ? data[2] / 1000000000000000000 : null}ETH</h1>
        <h1>
          Best:{" "}
          {/* {`${String(bestTime.m).padStart(2, "0")}(m) : ${String(
            bestTime.s
          ).padStart(2, "0")}(s) ${String(bestTime.ms).padStart(2, "0")}(ms)`} */}
          {data ? data[5] : null}
        </h1>
      </MainBanner>
      <BodyContainer>
        <AdsContainer />
        <Main>
          <Button onClick={() => navigate("/game")}>
            <h2>Get started</h2>
          </Button>
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
  background-color: black;
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
