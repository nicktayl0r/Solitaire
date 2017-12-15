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
/*----- functions -----*/

function init() {
    tableau = [[],[],[],[],[],[],[]];
    foundation = [[],[],[],[]];
    deck = [];
    stock = [];
    waste = [];
    makeDeck();
    shuffleDeck();
    makeTableau();   
}

function render(){
    //update arrays
    // one div for each item in array
    //check the win conditions
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

init();
render();