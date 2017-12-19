/*----- constants -----*/
var suit = ['spades', 'hearts', 'clubs', 'diamonds'];
var rank = [1,2,3,4,5,6,7,8,9,10,11,12,13];

/*----- app's state (variables) -----*/
var deck, stock, tableau, foundation, waste, selectedCard;
/*----- cached element references -----*/
var tableauEl = document.getElementById('tableau');
var foundationEl = document.getElementById("foundation");
var wasteEl = document.getElementById("waste");
var stockEl = document.getElementById("stock");
/*----- event listeners -----*/
tableauEl.addEventListener('click', selectCard);
stockEl.addEventListener('click', addWaste);
wasteEl.addEventListener('click', selectCard);
foundationEl.addEventListener('click', selectCard);
document.getElementById('restart').addEventListener('click',init)

//restart button just inits
/*----- functions -----*/

function init() {
    deck = [];
    activeCard =[];
    stock = [];
    waste = [];
    tableau = [[],[],[],[],[],[],[]];
    foundation = [[],[],[],[]];
    makeDeck();
    shuffleDeck();
    makeTableau();
    render();   
}

function render(){
    var tChildren = tableauEl.children;
    console.log()
    for(col in tableau){
        while(tChildren[col].firstChild) {
            tChildren[col].removeChild(tChildren[col].firstChild);
        }
        for(card in tableau[col]) {
           if(tableau[col][card].isVisible){ tChildren[col].innerHTML = tChildren[col].innerHTML + `<div class='cards'>${tableau[col][card].rank} of ${tableau[col][card].suit}</div>`;
            } else { tChildren[col].innerHTML = tChildren[col].innerHTML + `<div class='cards'>boi</div>`;}
        } 
    }
    var count = 0;
    while(wasteEl.childElementCount>0){
         wasteEl.removeChild(wasteEl.firstChild);
         count++;
    }    
    for(card in waste) {
        waste[card].isActive = false;
        if (card > waste.length-4) {
            wasteEl.innerHTML = wasteEl.innerHTML +`<div class='cards'>${waste[card].rank} of ${waste[card].suit}</div>`;
            if(Number(card) === waste.length-1) waste[card].isActive = true;
        }    
    }    
    
    chkWin();
}

class Card {
    constructor(suit, rank) {
	    this.suit = suit;
	    this.rank = rank;
	    this.isActive = false;
    }
}
function makeDeck(){
    for(s in suit) {	
		for(r in rank) {
		deck.push(new Card(suit[s], rank[r]));
		}
    }
    return deck;
}
function shuffleDeck() {
    for(i=0;i<52;i++) {
            var randI = Math.floor(Math.random()*(deck.length));
            stock.push(deck[randI]);
            deck.splice(randI, 1);
        }
    return stock;
}
function makeTableau() {
    for(t in tableau) {
        while(tableau[t].length <= t ){
            tableau[t].push(stock.pop());
        }
        var lastCard = tableau[t][t];
        lastCard.isActive = true;
        lastCard.isVisible = true;
    }
}
function addFoundation(e) {
    var fTarget = foundation[e.target.id.charAt(1)];
    var isSuit = ((fTarget[fTarget.length-1].suit === activeCard.suit) || (fTarget.length === 0));
    var isRank = fTarget.length === activeCard.rank;
    if  (isRank && isSuit) {
        fTarget[fTarget.length-1].isActive = false;
        fTarget.push(activeCard.pop());
    }
    render();    
}

function addTableau(e) {
    var tTarget = tableau[e.parentNode.id.charAt(1)];
    var rankChk = activeCard.rank+1 === tTarget[tTarget.length-1].rank;
    var suitChk = suit.indexOf(activeCard.suit)%2 !== suit.indexOf(tTarget[tTarget.length-1].suit)%2;
    if((activeCard.rank === 13 && tTarget.length === 0) || (rankChk && suitChk)){
        tTarget[tTarget.length-1].isActive = false;
        tTarget.push(activeCard.pop());
        console.log(e.target.parentNode.lastElementChild)
    }
    render();
}
function addWaste(e) {
    if(stock.length === 0) {
        stock = stock.concat(waste.reverse());
        waste = []; 
    } else {
        waste = waste.concat(stock.splice(stock.length-3).reverse());
    }
    render();
}

function selectCard(e){
    if (activeCard.length === 0) {
        console.log(`the ${e.target.innerHTML} has been clicked`);
        inArr = e.target.parentNode.className;
        if(inArr === "waste"){
            activeCard.push(waste.pop());
        } else if(inArr === 'tableau'){
            activeCard.push(tableau[e.target.parentNode.id.charAt(1)].pop());
        };
    } else {
        addTableau(e, activeCard);
        addFoundation(e, activeCard);
    }
    render();
}

function chkWin(){
    if (foundation[0].length === foundation[1].length === foundation[2].length === foundation[3].length === 13) {return 'winner winner chicken dinner';
    } else {return 'you lose';}
}
init();
render();


//a how to push the active card to the tableau or foundation
//b moving cards within the tableau
//c flipping cards in the tableau
//d click and drag functionality
//e css image library link