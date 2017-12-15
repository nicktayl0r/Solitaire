var suit = ['spade', 'heart', 'club', 'diamond'];
var rank = [1,2,3,4,5,6,7,8,9,10,11,12,13];

var tableauEl = document.getElementById('tableau');
var foundationEl = document.getElementById("foundation");
var wasteEl = document.getElementById("waste");
var stockEl = document.getElementById("stock");

var deck = [];
var stock = [];


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
            console.log(deck.length);
        }
    return stock;
}

