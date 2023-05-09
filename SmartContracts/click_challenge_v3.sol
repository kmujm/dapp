// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClickChallenge {
    // 스마트 컨트랙트 소유자 주소
    address payable public owner;

    // 게임 상금
    uint256 public prizePool;

    // 참가비
    uint256 public constant entryFee = 0.0002 ether;

    // 게임 기간 (3일)
    uint256 public constant gameDuration = 3 days;

    // 게임 종료 시간
    uint256 public gameEndTime;

    // 최고 점수
    uint256 public highestScore;

    // 게임 참가자의 수
    uint256 public numberOfPlayers;

    // 최고 점수를 기록한 참가자의 닉네임
    string public highestScorerName;

    // 최고 점수를 기록한 참가자의 지갑 주소
    address public highestScorerAddress;

    // 생성자 함수 (게임 종료 시간 초기화)
    constructor() {
        owner = payable(msg.sender);
        gameEndTime = block.timestamp + gameDuration;
        numberOfPlayers = 0;
    }

    // 게임 참여 함수
    function play(uint256 score, string calldata name) external payable {
        // 게임 종료 시간이 지나지 않았는지 확인
        require(block.timestamp < gameEndTime, "Game has ended");

        // 참가비가 정확한지 확인
        require(msg.value >= entryFee, "Minimum amount of Ether is 0.0002");

        if (score > highestScore) {
            // 최고 점수를 갱신한 경우, 최고 점수와 해당 참가자의 닉네임과 지갑 주소를 저장
            highestScore = score;
            highestScorerName = name;
            highestScorerAddress = msg.sender;
        }

        // 상금을 참가비로 누적
        prizePool += entryFee;

        // 게임 참가자 수를 1 증가
        numberOfPlayers++;
    }

    // 상금 분배 함수
    function distributePrize() external {
        // 게임 종료 시간이 지났는지 확인
        require(block.timestamp >= gameEndTime, "Game has not ended yet");

        // 1등 상금 계산 (상금의 90%)
        uint256 winnerPrize = (prizePool * 9) / 10;

        // 스마트 컨트랙트 배포자의 수수료 계산 (상금의 10%)
        uint256 ownerPrize = prizePool - winnerPrize;

        // 1등에게 상금 지급
        payable(highestScorerAddress).transfer(winnerPrize);

        // 스마트 컨트랙트 배포자에게 수수료 지급
        payable(owner).transfer(ownerPrize);

        // 게임 상태 초기화
        // 상금 초기화
        prizePool = 0;

        // 최고 점수 관련 변수 초기화
        highestScore = 0;
        delete highestScorerName;
        delete highestScorerAddress;

        // 게임 종료 시간 초기화
        delete gameEndTime;
        gameEndTime = block.timestamp + gameDuration;
    }

    // 게임 참가자의 수를 반환하는 함수
    function getNumberOfPlayers() public view returns (uint256) {
        return numberOfPlayers;
    }

    // 1등의 점수, 닉네임, 지갑 주소를 반환하는 함수
    function getWinner()
        public
        view
        returns (string memory name, address addr, uint256 score)
    {
        name = highestScorerName;
        addr = highestScorerAddress;
        score = highestScore;
    }

    // 게임 종료 시간을 반환하는 함수
    function getGameEndTime() public view returns (uint256) {
        return gameEndTime;
    }

    // winnerPrize(1등이 수령할 상금)를 반환하는 함수
    function getWinnerPrize() public view returns (uint256) {
        return (prizePool * 9) / 10;
    }
}
