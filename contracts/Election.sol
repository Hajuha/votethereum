pragma solidity >=0.5.0;

contract Election {
    // Constructor
    constructor() public {}

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        string party;
    }

    // Read/write Candidates
    mapping(uint256 => Candidate) public candidates;

    // Store Candidates Count
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

    // Read/write voters
    mapping(address => bool) public voters;

    uint256 public voteTotal;

    // vote takes candidate id,
    function vote(uint256 _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender], "Vote already cast from this address");

        // require a valid candidate, making sure their index is in mapping
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Candidate ID is not in range of candidates"
        );

        require(
            candidatesCount >= 2,
            "Must be at least 2 candidates before votes can be cast"
        );

        // record that voter has voted, making their address key true
        voters[msg.sender] = true;

        // update candidate vote Count, for matched id, based on key
        candidates[_candidateId].voteCount++;
        voteTotal++;

        // trigger voted event
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
