// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.11;

contract Game {
    address public owner;
    uint public totalPlayers;

    uint public deadline; // (UnixTime)
    bool public ended;

    uint public highestRecord = 0;
    address public highestPlayer;

    uint256 public totalAmount;

    address public contractAddress; // TODO: smartContract의 주소 초기화

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(uint _duration) {
        // 컨트랙트 owner
        owner = msg.sender;

        // 마감일(Unixtime)
        deadline = block.timestamp + _duration;

        ended = false;

        totalPlayers = 0;
        totalAmount = 0;
    }

    /// 게임 참가
    function play() public payable {
        // 게임이 참여 기한 종료되지 않음
        require(!ended);

        totalPlayers++;
        totalAmount += msg.value; // TODO: 값 확인

        require(payable(contractAddress).send(msg.value));
    }

    ///  메인 페이지에 보여줄 정보: 게임 참여자 수, 최고 기록, 총 상금
    function getGameInfo() public view returns (uint, uint, uint256) {
        return (totalPlayers, highestRecord, totalAmount);
    }

    /// 기록 갱신
    function updateRecord(uint record) public {
        require(!ended, "Game is already ended.");
        require(block.timestamp <= deadline, "Game is already ended.");

        if (record > highestRecord) {
            highestRecord = record;
            highestPlayer = msg.sender;
        }
    }

    /// 게임 종료
    function checkGameOver() public {
        require(!ended && block.timestamp >= deadline);
        ended = true;
        require(payable(highestPlayer).send(totalAmount));
    }
}
