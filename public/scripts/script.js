const btnmeta = document.getElementById("btnmeta");
const para = document.getElementById("para");
const votePlace = document.getElementById("votePlace");
const voteForm = document.getElementById("voteForm");
const radios = document.getElementsByName("options");
const voteBtn = document.getElementById("voteBtn");


let candidates = [];

fetch("/getCandidatesArr", {
    method: "get"
}).then((res) => {
    return res.json();
}).then((res) => {
    candidates = res.response;
});

let admin_acc;

voteForm.style.visibility = "hidden";

btnmeta.addEventListener("click", async function metaClick(){
    if(window.ethereum != "undefined"){
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);
        para.innerHTML = "Connected: " + accounts[0];
        admin_acc = accounts[0];
        
        if(candidates.length == 0){
            votePlace.innerHTML = "No candidates added yet.";
        }
        else{
            votePlace.innerHTML = "";
            voteForm.style.visibility = "visible";
            displayCandidates();
        }
    }
    else{
        para.innerHTML = "Failed to Connect to metamask";
    }

    btnmeta.removeEventListener("click", metaClick);
});

function displayCandidates(){
    candidates.forEach((option, index) => {
        
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.id = option;
        radioButton.name = "options"; 
    
        const label = document.createElement("label");
        label.htmlFor = `option${index + 1}`;
        label.appendChild(document.createTextNode(option));
        radioButton.style.marginTop = "10px";
        radioButton.style.marginLeft = "4vw";
        radioButton.style.marginRight = "20px";
        label.style.marginTop = "10px";
        label.style.fontSize = "1.5rem";
        // Append radio button and label to the form
        voteForm.appendChild(radioButton);
        voteForm.appendChild(label);
        voteForm.appendChild(document.createElement("br")); 
      });

      const btn = document.createElement("button");
      btn.innerHTML = "Vote";
      btn.type = "submit";
      btn.value = "Submit";
      btn.className = "btns";
      btn.id = "voteBtn"
      btn.style.marginTop = "20px";
      voteForm.appendChild(btn);

}

voteForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    
    const selectedRadioButton = document.querySelector('input[name="options"]:checked');


    if (selectedRadioButton) {
        
        console.log(selectedRadioButton.id);

        fetch("/vote", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                candidate: selectedRadioButton.id,
                voter: para.innerHTML.substring(11)
            })
        }).then((res) => {
            return res.json();
        }).then((res) => {
            console.log(res.response);
        });

    } else {
        
        console.log('No radio button selected');
    }
});