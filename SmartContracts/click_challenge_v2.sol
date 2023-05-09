// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ClickChallenge {
    address payable public owner; // 스마트 컨트랙트 소유자 주소
    uint256 public entryFee; // 게임 참가비
    uint256 public pot; // 참가비 누적 금액
    uint256 public endTime; // 게임 종료 시각
    mapping(address => uint256) public scores; // 참가자의 점수를 저장하는 매핑
    address[] public players; // 참가자의 주소를 저장하는 배열

    constructor() {
        owner = payable(msg.sender);
        entryFee = 0.0002 ether;
        endTime = block.timestamp + 3 days; // 새로운 게임의 종료 시각을 3일 뒤로 설정
    }

    function enterGame() public payable {
        require(msg.value >= entryFee, "Minimum amount of Ether is 0.0002");

        pot += msg.value;
        scores[msg.sender] = 0;
        players.push(msg.sender); // 새로운 참가자의 주소를 players 배열에 추가
    }

    function updateScore(uint256 score) public {
        require(block.timestamp < endTime, "The game has ended.");
        scores[msg.sender] = score;
    }

    function endGame() public {
        require(block.timestamp >= endTime, "The game has not ended yet.");
        uint256 highestScore = 0;
        address payable winner = payable(address(0));
        for (uint256 i = 0; i < players.length; i++) {
            address payable player = payable(players[i]);
            if (scores[player] > highestScore) {
                highestScore = scores[player];
                winner = player;
            }
        }
        winner.transfer(pot); // 가장 높은 점수를 받은 참가자에게 누적된 참가비를 전송
        pot = 0; // 누적된 참가비를 0으로 초기화
        endTime = block.timestamp + 3 days; // 새로운 게임의 종료 시각을 3일 뒤로 설정
        delete players; // players 배열을 초기화하여 새로운 게임을 시작할 수 있도록 함
    }
}
