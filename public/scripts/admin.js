const formtxt = document.getElementById("formtxt");
const formbtn = document.getElementById("formbtn");
const cform = document.getElementById("cform");
const getCandidates = document.getElementById("getCandidates");
const getCandidatesP = document.getElementById("getCandidatesP");
const endElec = document.getElementById("endElec");
const endElecP = document.getElementById("endElecP");
const getWinner = document.getElementById("getWinner");
const getWinnerP = document.getElementById("getWinnerP");
const getVoters = document.getElementById("getVoters");
const getVotersP = document.getElementById("getVotersP");

getCandidates.addEventListener("click", () => {
    fetch("/getCandidates", {
        method: "get"
    }).then((res) => {
        return res.json();
    }, (err) => {console.log(err);}).then((candidates) => 
    {
        console.log(candidates);
        for(let i=0;i<candidates.length;i++){
            getCandidatesP.innerHTML += ` ${candidates[i]}`;
        }
    });

});

endElec.addEventListener("click", () => {

    fetch("/endElec", {
        method: "get"
    }).then((res) => {
        return res.json();
    }).then((res) => {
        console.log(res.response);
        endElecP.innerHTML = res.response;
    });

});

getWinner.addEventListener("click", () => {
    fetch("/getWinner", {
        method: "get"
    }).then((res) =>{
        return res.json();
    }).then((res) => {
        console.log(res.response);
        getWinnerP.innerHTML = res.response;
    }).catch((err) => {
        console.log(err);
        getWinnerP.innerHTML = err;
    });
});

getVoters.addEventListener("click", () => {
    fetch("/getVoters", {
        method: "get"
    }).then(res => {
        return res.json();
    }).then(res => {
        console.log(res.response);
        
        for(let i=0; i < res.response.length; i++){
            getVotersP.innerHTML += `<br>${res.response[i]}`;
        }
    })

});