// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.11;

contract Game {
    // struct Player {
    // 	address addr;	// 참가자 주소
    // 	uint amount;	// 참가비
    // }

    address public owner;
    uint public totalPlayers;

    uint public deadline; // (UnixTime)
    bool public ended;

    uint public highestRecord = 0;
    address public highestPlayer;

    uint256 public totalAmount;

    // mapping (uint => Player) public players;

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
        totalAmount += msg.value;

        // owner한테 이더 송금
        // owner.transfer(msg.value);
        if (!payable(owner).send(address(this).balance)) {
            revert();
        }
    }

    ///  메인 페이지에 보여줄 현재 상금과 기록
    function getGameInfo() public view returns (uint, uint) {
        return (highestRecord, totalAmount);
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
        require(!ended);
        require(block.timestamp >= deadline);
        ended = true;
        if (!payable(highestPlayer).send(address(this).balance)) {
            revert();
        }
    }
}
