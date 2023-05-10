import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

import AdsContainer from "../components/AdsContainer";
import backgorund from "../assets/background2.jpeg";
import { ABI } from "../assets/abiobj";

const Container = styled.div`
  background-image: url(${backgorund});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100vh;
`;

const Text = styled.div`
  color: white;
  margin: auto;
  width: 40%;
  height: 30px;
  border-radius: 50px;
  font-size: 4em;
`;

const SmallText = styled.div`
  color: white;
  margin: auto;
  width: 40%;
  height: 30px;
  border-radius: 50px;
  font-size: 1em;
`;

const AddInput = styled.input`
  margin: auto;
  display: block;
  width: 20%;
  height: 30px;
  border: none;
  border-radius: 10px;
  margin-top: 100px;
`;

const Button = styled.button`
  margin: auto;
  display: block;
  min-width: 10%;
  height: 100px;
  background: none;
  border: none;
  color: white;
  font-size: 2em;
  text-align: center;
  &:hover {
    color: black;
  }
`;

export const MainPage = () => {
  const navigate = useNavigate();

  // 기록
  const [record, setRecord] = useState(0);

  const [data, setData] = useState();

  const [countDown, setCountDown] = useState();
  const [paid, setPaid] = useState(false);

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

  const checkGameState = async () => {
    return await contractInstance.methods.distributePrize().call();
    // if(result)
  };

  // contract instance 생성 후 game info get
  useEffect(() => {
    console.log(contractInstance);
    getGameInfo();
    // checkGameState();
  }, [contractInstance]);

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

  // nickname input handler
  const handleInput = (e) => {
    setNickname(e.target.value);
  };

  // metamask 연결
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    // const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);
    console.log(account);
  };

  // 참가비
  const payFee = async () => {
    try {
      // 게임 참가비 송금
      await contractInstance.methods.payEntryFee().send({
        from: account,
        value: window.web3.utils.toWei("0.0005", "ether"),
      });
      setPaid(true);
    } catch (err) {
      console.log(err);
    }
  };

  // 게임 시작 버튼. ether 송금
  const handleGameStart = async () => {
    if (account && nickname) {
      console.log(account, nickname);
    } else if (!account) {
      alert("메타마스크를 연결해주세요");
    } else {
      alert("닉네임을 입력해주세요");
    }
    try {
      // 게임 참가비 송금
      // await contractInstance.methods.payEntryFee().send({
      //   from: account,
      //   value: window.web3.utils.toWei("0.0005", "ether"),
      // });
      console.log(contractInstance, account, nickname);
      navigate("/game", {
        state: {
          contractInstance: contractInstance,
          account: account,
          nickname: nickname,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

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

  // return (
  //   <Container>
  //     {countDown ? (
  //       <Text>
  //         {countDown.day}일 {countDown.hour}시간 {countDown.min}분
  //         {countDown.sec} 초
  //       </Text>
  //     ) : null}
  //     {data ? (
  //       <SmallText style={{ marginTop: 50 }}>
  //         누적 {data[1]}명이 참가하였고 누적 상금은{" "}
  //         {data[2] / 1000000000000000000} ether이며 최고기록은 {data[5]}{" "}
  //         초입니다.
  //       </SmallText>
  //     ) : null}
  //     <AddInput onChange={handleInput} placeholder="닉네임을 입력해주세요" />
  //     {!account ? <Button onClick={connectWallet}>지갑 연결하기</Button> : null}
  //     {/* {!paid ? <Button onClick={payFee}>참가비 내기</Button> : null} */}
  //     <Button onClick={handleGameStart}>Start Game!</Button>
  //   </Container>
  let bestScore = 123.456789;

  return (
    <MainContainer>
      <MainBanner>
        <h1>Total: {bestScore}ETH</h1>
        <h1>
          Best:{" "}
          {`${String(bestTime.m).padStart(2, "0")}(m) : ${String(
            bestTime.s
          ).padStart(2, "0")}(s) ${String(bestTime.ms).padStart(2, "0")}(ms)`}
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
