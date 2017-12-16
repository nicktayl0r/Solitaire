/*----- constants -----*/
var suit = ['spade', 'heart', 'club', 'diamond'];
var rank = [1,2,3,4,5,6,7,8,9,10,11,12,13];

/*----- app's state (variables) -----*/
var deck, stock, tableau, foundation, waste, activeCard;
/*----- cached element references -----*/
var tableauEl = document.getElementById('tableau');
var foundationEl = document.getElementById("foundation");
var wasteEl = document.getElementById("waste");
var stockEl = document.getElementById("stock");
/*----- event listeners -----*/
//restart button just inits
//onclick for cards set to active card, pop from array
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
}

function render(){
    //update dom from arrays
    //one div for each item in array
    //set the active and the visiblility based on the dom;
    chkWin();
}

class Card {
    constructor(suit, rank) {
	    this.suit = suit;
	    this.rank = rank;
	    this.isActive = false;
        this.isVisible = false;
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
    var tTarget = tableau[e.target.id.charAt(1)];
    var rankChk = activecard.rank+1 === tTarget[tTarget.length-1].rank;
    var suitChk = suits.indexOf(activeCard.suit)%2 !== suits.indexOf(tTarget[tTarget.length-1].suit)%2;
    if((activeCard.rank === 13 && tTarget.length === 0) || (rankChk && suitChk)){
        tTarget[tTarget.length-1].isActive = false;
        tTarget.push(activeCards.pop());
    }
    render();
}
function addWaste(e) {
    if(stock.length = 0) stock = stock.concat(waste.reverse());
        waste = waste.concat(stock.splice(stock.length-3).reverse());
    render();
}
/*
function selectCard(e){
    e.target.ParentNode.id.charAt(1)
    var tCard = tableau[][tableau[].length-1];
    //which array is it in
    // how do i acquire the  in the tableau array 
    if (activeCard.length === 0 && tCard.isActive === true) {
        activeCard.push(tCard) 
}
*/
function chkWin(){
    if (foundation[0].length === foundation[1].length === foundation[2].length === foundation[3].length === 13) {return 'winner winner chicken dinner';
    } else {return 'you lose';}
}

init();
render();