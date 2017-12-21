/*----- constants -----*/
var suit = ['spades', 'hearts', 'clubs', 'diamonds'];
var rank = [1,2,3,4,5,6,7,8,9,10,11,12,13];
/*----- app's state (variables) -----*/
var deck, stock, tableau, foundation, waste;
/*----- cached element references -----*/
var tableauEl = document.getElementById('tableau');
var foundationEl = document.getElementById("foundation");
var wasteEl = document.getElementById("waste");
var stockEl = document.getElementById("stock");
/*----- event listeners -----*/
document.getElementById('tableau').addEventListener('click', selectTableau);
stockEl.addEventListener('click', addWaste);
wasteEl.addEventListener('click', selectWaste)
document.getElementById('restart').addEventListener('click',init);
tableauEl.addEventListener('click', addTableau);
foundationEl.addEventListener('click', addFoundation);
/*----- functions -----*/
function init() {
    deck = [];
    activeCard = [];
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
    var h = 0;
    for(col in tableau){
        while(tChildren[col].firstChild) {
            tChildren[col].removeChild(tChildren[col].firstChild);
        }
        var i=0;
        for(card in tableau[col]) {
           if(tableau[col][card].isActive){
               tChildren[col].innerHTML = `${tChildren[col].innerHTML}<div id='${h}${i}'class='cards'></div>`;
               tChildren[col].lastChild.style.backgroundImage = "url("+tableau[col][card].imgLink+")"; 
            } else { 
                tChildren[col].innerHTML = `${tChildren[col].innerHTML}<div id='${h}${i}'class='cards'></div>`;
            }
            i++;
        } 
        h++;    
    }
    while(wasteEl.childElementCount>0){
         wasteEl.removeChild(wasteEl.firstChild);
    } 
    for(card in waste) {
        waste[card].isActive = false;
        if (card >= waste.length-3) {
            //console.log(waste[0]);
            wasteEl.innerHTML = wasteEl.innerHTML +`<div id='7${card}' class='cards'></div>`;
            wasteEl.lastChild.style.backgroundImage = "url("+waste[card].imgLink+")";
            // console.log(wChildren[card])
            if(Number(card) === waste.length-1) waste[card].isActive = true; 
        }
    }
    for(arr in foundation) {
        if(!foundation[arr].length){
            document.getElementById(arr+'f').style.backgroundImage = "url(none)";
        } else {
            document.getElementById(arr+'f').style.backgroundImage = "url("+foundation[arr][foundation[arr].length-1].imgLink+")"
        }
    }       
    chkWin();
}
class Card {
    constructor(suit, rank) {
	    this.suit = suit;
	    this.rank = rank;
        this.isActive = false;
        this.rankTranslator = function() {
           var rankName;
           switch(this.rank){
               case 1:
                   rankName = 'A';
                   break;
               case 10:
                   rankName = 'r'+rank;
                   break;    
               case 11:
                   rankName = 'J';
                   break;
               case 12:
                   rankName = 'Q';
                   break;
               case 13:
                   rankName = 'K';
                   break;
               default:
                   rankName = 'r0'+this.rank;
           }
           this.imgLink = './css/img/' + this.suit + '/'+this.suit+'-'+ rankName+'.svg';
       };
       this.rankTranslator();     
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
    }
}
function addFoundation(e) {
    if(activeCard.length === 1){
        var fTarget = foundation[e.target.id.charAt(0)];
        var isSuit = ((fTarget.length === 0) || (fTarget[fTarget.length-1].suit === activeCard[0].suit));
        var isRank = fTarget.length + 1 === activeCard[0].rank;
        if(!activeCard.length) {
                activeCard.push(fTarget[fTarget.length-1].pop())
            }
        if  (isRank && isSuit) {
                e.target = `${activeCard[0].rank} of ${activeCard[0].suit}`;
                fTarget.push(activeCard.pop());
            }
            render();    
    }
}
function addTableau(e) {
    if(activeCard.length >= 1) {
        var tTarget = tableau[e.target.id.charAt(0)];
        if(activeCard[0].rank === 13 && tTarget.length === 0){
            while(activeCard.length > 0){
                tTarget.push(activeCard.shift());
            render();
            }
        }
        var rankChk = activeCard[0].rank+1 === tTarget[tTarget.length-1].rank;
        var suitChk = suit.indexOf(activeCard[0].suit)%2 !== suit.indexOf(tTarget[tTarget.length-1].suit)%2;
        if((rankChk && suitChk)){
            while(activeCard.length > 0){
                   tTarget.push(activeCard.shift());
            }
            render();
        }
    } 
}
function addWaste(e) {
    if(!activeCard.length){
        if(stock.length === 0) {
            stock = stock.concat(waste.reverse());
            waste = []; 
        } else {
            waste = waste.concat(stock.splice(stock.length-3).reverse());
        }
    }
    render();
}
function selectTableau(e){
    if(!activeCard.length){
        var inArr = e.target.parentNode.className;
        if(inArr === 'tableau'){
            var tColumn = e.target.id.charAt(0);
            var tRow = e.target.id.charAt(1);
            var canSelect = tableau[tColumn][tRow];
            if(!activeCard.length && canSelect.isActive) {
                activeCard = tableau[tColumn].splice(tRow, tableau[tColumn].length-tRow);
            }
            if(!activeCard.length && canSelect === tableau[tColumn][tableau[tColumn].length-1]){
                canSelect.isActive = true;
            }
        }
    }

    render();
}
function selectWaste(e){
    if(!activeCard.length){
        activeCard.push(waste.pop());
    }
    render();
}
function chkWin() {
    if (foundation[0].length === foundation[1].length === foundation[2].length === foundation[3].length === 13) {console.log('winner winner chicken dinner');}
}
init();

//b logical bug with multiple  cards from the waste array, single digit id lookup bug
//c setting a lose condition
//d click and drag functionality
//e peer review checklist
//* general styling
//* e undo button