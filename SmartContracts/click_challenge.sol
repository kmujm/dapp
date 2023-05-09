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

        contractAddress = msg.sender; // owner의 주소로 설정
        // contractAddress = address(this); // 해당 계약의 주소로 설정

        // 마감일(Unixtime)
        deadline = block.timestamp + _duration;

        ended = false;

        totalPlayers = 0;
        totalAmount = 0;
    }

    /// 게임 참가
    function play() public payable {
        // 메시지 전송 시 보낼 이더 양이 0인 경우 에러 발생
        require(msg.value > 0, "You must send some Ether to play");

        // 최소 이더량을 확인하고, 이상인 경우에만 게임 참가 가능
        require(msg.value >= 0.0002 ether, "Minimum amount of Ether is 0.0002");

        // 이미 게임 참가 기한이 종료된 경우 에러 발생
        require(!ended, "The game has already ended");

        totalPlayers++;
        totalAmount += msg.value;

        // 함수 호출 시 메시지의 value 값이 설정되지 않은 경우 에러 발생
        require(
            msg.value == address(this).balance,
            "Sent Ether value does not match the expected value"
        );

        require(
            payable(contractAddress).send(msg.value),
            "Failed to send Ether to contract"
        );
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
