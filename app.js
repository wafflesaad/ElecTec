const express = require("express");
const app = express();
const path = require("path");
const {ethers} = require("ethers");
const bodyParser = require("body-parser");
const { log } = require("console");
const port = 80;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


const provider = new ethers.providers.JsonRpcProvider("https://delicate-powerful-night.ethereum-sepolia.quiknode.pro/afd4de4507a093c6f8ef83b5c079df1d19962d52/");


const contractAddress = "0x29c8DCD9E538FBD4f1eFa54aE1228Bc1301Cb7e2";
const abi = [
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "names",
				"type": "string[]"
			}
		],
		"name": "addCandidates",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endElection",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "c",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "ad",
				"type": "address"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "cname",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "check",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "winner",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const privateKey = "4327f6e45bb0a232c51bd07777f61cb5c6cc8760b8748c8b88770f1949da6463";
const walletAddress = "0xf6bE2d9B99c82BEE893735546E4aBeac8D8Ebfb5";

const contract = new ethers.Contract(contractAddress, abi, provider);

const wallet = new ethers.Wallet(privateKey, provider);
const contractWithSigner = contract.connect(wallet);

async function check(){
	const result = await contract.check();
	console.log(result);
}

check();



async function addCandidates(arrC){
	const tx = await contractWithSigner.addCandidates(arrC);
	const receipt = await tx.wait();
	console.log(receipt);
}


let candidates = [];
let voters = [];

app.get("/", (req,res) =>{
    res.render("index");
});

app.get("/admin", (req,res) =>{
	res.render("admin");
});



app.post("/addCandidate", (req,res) =>{
	
	console.log(req.body);
	let arrC = [req.body.candidateName];

	try{
		addCandidates(arrC);
	}catch(err){
		console.log(err);
	}

	candidates.push(req.body.candidateName);
	res.send(`<script>alert("Candidate added."); window.location="/admin"</script>`);
});

app.get("/getCandidates", (req,res) =>{
	res.send(candidates);
});


async function endElection(){
	const tx = await contractWithSigner.endElection();
	const receipt = await tx.wait();
	console.log(receipt);
}

app.get("/endElec", (req,res) =>{
	endElection();
	
	
	let result = {response: "Election ended."};
	res.send(result);
});
 
app.get("/getWinner", async (req,res) =>{
	let result;
	
	async function getWinner(){
		result = await contract.winner(0);
	}

	try{
	await getWinner();
	} catch(err){
		console.log(err);
	}

	console.log(result);
	let Result = {response: result};
	res.send(Result);
});

app.get("/getCandidatesArr", (req,res) =>{
	let result = {response: candidates};
	res.send(result);
});

async function vote(candidate, voter){
	const tx = await contractWithSigner.vote(candidate, voter);
	const receipt = await tx.wait();
	console.log(receipt);
}

app.post("/vote", (req,res)=>{
	let candidate = req.body.candidate;
	let voter = req.body.voter;
	
	voters.push(voter);

	console.log(candidate);
	console.log(voter);

	vote(candidate, voter);

	let result = {response: "Received."};
	res.send(result);
});
 
app.get("/getVoters", (req,res) =>{
	let result = {response: voters};
	res.send(result);
});

app.listen(port, () =>{
    console.log(`App running on port ${port}`);
});

