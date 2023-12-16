//SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.5.0 <0.9.0;

struct candidate{
    string cname;
    uint voteCount;
}

contract election{
    address public owner;   //election admin
    candidate[] public candidates;  // holds candidates
    address[] public voters;  // holds voters address's
    mapping(address=>int) votedFor;  // tracks which voter voted for who
    string[] public winner;  // holds winners. Usually length is 1 but can be more for ties

    constructor(){
        owner = msg.sender;  // setting admin to deployer
    }

    function addCandidates(string[] memory names) public {
        require(names.length > 0 && msg.sender == owner,"Length is 0 or less or sender is not admin"); //checking privilage

        for(uint i = 0; i < names.length; i++){     
            for(uint j = 0; j < candidates.length; j++){ // checking if candidate already exists
                if(keccak256(bytes(names[i])) == keccak256(bytes(candidates[j].cname))){
                    require(false, "Candidate already exists");
                }
            }
            // adding candidate
            candidate memory c;
            c.cname = names[i];
            c.voteCount = 0;
            candidates.push(c);
        }
    }

    function vote(string memory c) public payable {
        
        for(uint i = 0; i < voters.length; i++){  // check if address has already voted
            if(msg.sender == voters[i]){
                require(false, "address has already voted");
            }
        }


        int cindex = checkCandidate(c);   
        require(cindex >= 0, "candidate not found");
        //adding vote
        voters.push(msg.sender);
        votedFor[msg.sender] = cindex;
        candidates[uint(cindex)].voteCount = candidates[uint(cindex)].voteCount + uint(1);
    }

    // function to get candidates index
    function checkCandidate(string memory c) private view returns(int){
        bytes32 chash =  keccak256(bytes(c));
        bytes32 shash;
        
        for (uint i = 0; i < candidates.length; i++){
            shash =  keccak256(bytes(candidates[i].cname));
            if(shash == chash){
                return int(i);
            }
        }

        return -1;
    }

    function endElection() public payable {
        uint maxvotes = 0;

        // getting max no. of votes
        for (uint i = 0; i < candidates.length; i++){
            if(candidates[i].voteCount > maxvotes){
                maxvotes = candidates[i].voteCount;
            }
        }

        // finding candidates with max no. of votes
        for (uint i = 0; i < candidates.length; i++){
            if(candidates[i].voteCount == maxvotes){
                winner.push(candidates[i].cname);
            }
        }

        // clearing all state variables
        for(uint i = 0; i <= candidates.length; i++){
            candidates.pop();            
        }

        voters = new address[](0);   
             
        for(uint i = 0; i < voters.length; i++){
            votedFor[voters[i]] = -2;
        }

    }

    function check() pure public returns(string memory){
        return "Connection done";
    }

}