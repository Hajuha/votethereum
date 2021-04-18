pragma solidity >=0.5.0;

contract Election {
    constructor() public {}

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        string party;
    }

    mapping(uint256 => Candidate) public candidates;

    uint256 public candidatesCount;
    bool public isVoting = false;

    function addCandidate(string memory _name, string memory _party) public {
        require(
            voteTotal == 0,
            "Cannot submit candidate after first vote recorded"
        );
        candidatesCount++;
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            0,
            _party
        );

        emit addCandidateEvent(candidatesCount);
    }

    event addCandidateEvent(uint256 indexed_candidateId);

    mapping(address => bool) public voters;

    uint256 public voteTotal;

    function vote(uint256 _candidateId) public {
        require(!voters[msg.sender], "Vote already cast from this address");
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Candidate ID is not in range of candidates"
        );

        require(
            candidatesCount >= 2,
            "Must be at least 2 candidates before votes can be cast"
        );

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        voteTotal++;
        emit votedEvent(_candidateId);
    }

    function isVoted(address _sender) public view returns (bool) {
        if (voters[_sender]) return true;
        else return false;
    }

    function startVoting() public {
        isVoting = true;
    }

    function getIsVoting() public returns (bool) {
        return isVoting;
    }

    event votedEvent(uint256 indexed_candidateId);
}
