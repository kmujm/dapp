import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Web3 from "web3";

import backgorund from "../assets/background2.jpeg";
import { ABI } from "../assets/abi";

const Container = styled.div`
  background-image: url(${backgorund});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100vh;
`;

const AddInput = styled.input`
  margin: auto;
  display: block;
  width: 20%;
  height: 30px;
  border: none;
  border-radius: 10px;
`;

const Button = styled.button`
  margin: auto;
  display: block;
  width: 10%;
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

  const [account, setAccount] = useState("");
  const [nickname, setNickname] = useState("");

  // 이더리움 객체 가져오기
  const [web3, setWeb3] = useState();
  const [contractInstance, setContractInstance] = useState();

  // 기록
  const [record, setRecord] = useState(0);

  // contract address
  const address = "0xd9145CCE52D386f254917e481eB44e9943F39138";

  // contract instance
  const getInstance = async () => {
    // console.log(web3);
    try {
      setContractInstance(await new window.web3.eth.Contract(ABI, address));
    } catch (err) {
      console.log(err);
    }
  };

  // game info, 상금, 최고기록 등 정보
  const getGameInfo = async () => {
    return await contractInstance.methods.getGameInfo().call();
  };

  const checkGameState = async () => {
    return await contractInstance.methods.checkGameOver().call();
    // if(result)
  };

  // contract instance 생성 후 game info get
  useEffect(() => {
    console.log(contractInstance);
    const data = getGameInfo();
    console.log(data);
    checkGameState();
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

  // 게임 시작 버튼. ether 송금
  const handleGameStart = async () => {
    if (account && nickname) {
      console.log(account, nickname);
      // 게임 참가비 송금

      await contractInstance.methods
        .play()
        .send({
          from: account,
          value: window.web3.utils.toWei("0.001", "ether"),
        });
      navigate("/game", {
        contractInstance: contractInstance,
        account: account,
      });
    } else if (!account) {
      alert("메타마스크를 연결해주세요");
    } else {
      alert("닉네임을 입력해주세요");
    }
  };

  return (
    <Container>
      <AddInput onChange={handleInput} placeholder="닉네임을 입력해주세요" />
      {!account ? <Button onClick={connectWallet}>지갑 연결하기</Button> : null}
      <Button onClick={handleGameStart}>Start Game!</Button>
    </Container>
  );
};
