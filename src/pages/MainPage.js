import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AdsContainer from "../components/AdsContainer";

import Web3 from "web3";

import backgorund from "../assets/background2.jpeg";
import { ABI } from "../assets/abi";

// const AddInput = styled.input`
//   margin: auto;
//   display: block;
//   width: 20%;
//   height: 30px;
//   border: none;
//   border-radius: 10px;
// `;

// const Button = styled.button`
//   margin: auto;
//   display: block;
//   width: 10%;
//   height: 100px;
//   background: none;
//   border: none;
//   color: white;
//   font-size: 2em;
//   text-align: center;
//   &:hover {
//     color: black;
//   }
// `;

export const MainPage = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");

  // 기록
  const [record, setRecord] = useState(0);

  // contract address

  // // game info, 상금, 최고기록 등 정보
  // const getGameInfo = async () => {
  //   return await contractInstance.methods.getGameInfo().call();
  // };

  // const checkGameState = async () => {
  //   return await contractInstance.methods.checkGameOver().call();
  //   // if(result)
  // };

  // // contract instance 생성 후 game info get
  // useEffect(() => {
  //   console.log(contractInstance);
  //   const data = getGameInfo();
  //   console.log(data);
  //   checkGameState();
  // }, [contractInstance]);

  // // nickname input handler
  // const handleInput = (e) => {
  //   setNickname(e.target.value);
  // };

  // // metamask 연결
  // const connectWallet = async () => {
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   // const accounts = await web3.eth.requestAccounts();
  //   setAccount(accounts[0]);
  //   console.log(account);
  // };

  // // 게임 시작 버튼. ether 송금
  // const handleGameStart = async () => {
  //   if (account && nickname) {
  //     console.log(account, nickname);
  //     // 게임 참가비 송금

  //     await contractInstance.methods.play().send({
  //       from: account,
  //       value: window.web3.utils.toWei("0.001", "ether"),
  //     });
  //   } else if (!account) {
  //     alert("메타마스크를 연결해주세요");
  //   } else {
  //     alert("닉네임을 입력해주세요");
  //   }
  // };

  let bestTime = {
    m: 12,
    s: 5,
    ms: 88,
  };

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
