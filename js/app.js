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
document.getElementById('game').addEventListener('click', selectCard);
stockEl.addEventListener('click', addWaste);
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
    console.log()
    var h = 0;
    for(col in tableau){
        while(tChildren[col].firstChild) {
            tChildren[col].removeChild(tChildren[col].firstChild);
        }
        var i=0;
        for(card in tableau[col]) {

           if(tableau[col][card].isActive){ 
               tChildren[col].innerHTML = `${tChildren[col].innerHTML}<div id='${h}${i}'class='cards'>${tableau[col][card].rank} of ${tableau[col][card].suit}</div>`;
            } else { 
                tChildren[col].innerHTML = `${tChildren[col].innerHTML}<div id='${h}${i}'class='cards'></div>`;
            }
            i++;
        } 
        h++;    
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
    }
}
function addFoundation(e) {
    if(activeCard.length === 1){
        var fTarget = foundation[e.target.id.charAt(0)];
        var isSuit = ((fTarget.length === 0) || (fTarget[fTarget.length-1].suit === activeCard[0].suit));
        var isRank = fTarget.length + 1 === activeCard[0].rank;
        if  (isRank && isSuit) {
                fTarget.push(activeCard.shift());
        }
        console.log(foundation);
        render();    
    }
}
function addTableau(e) {
    if(activeCard.length >= 1) {
        var tTarget = tableau[e.target.id.charAt(0)];
        var rankChk = activeCard[0].rank+1 === tTarget[tTarget.length-1].rank;
        var suitChk = suit.indexOf(activeCard[0].suit)%2 !== suit.indexOf(tTarget[tTarget.length-1].suit)%2;
        console.log(`activeCard rank is ${activeCard[0].rank}`);
        console.log(`rank check returns ${rankChk}`);
        console.log(`suitChk returns ${suitChk}`);
        if((activeCard[0].rank === 13 && tTarget.length === 0) || (rankChk && suitChk)){
               while(activeCard.length > 0){
                   tTarget.push(activeCard.shift());
               }
            console.log(tTarget);
        }
        render();
    } 
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
    console.log(e.target.parentNode);
    var inArr = e.target.parentNode.className;
    if(inArr === 'tableau'){
        var tColumn = e.target.id.charAt(0);
        var tRow = e.target.id.charAt(1);
        var canSelect = tableau[tColumn][tRow];
        console.log(tColumn);
        console.log(tRow);
        console.log(canSelect);

        if(!activeCard.length && canSelect.isActive) {
            activeCard = tableau[tColumn].splice(tRow, tableau[tColumn].length-tRow);
        }
        if(!activeCard.length && canSelect === tableau[tColumn][tableau[tColumn].length-1]){
            canSelect.isActive = true;
        }
    } else if(inArr === 'waste' && !activeCard.length){
         activeCard.push(waste.pop());
    } else if(inArr === 'foundation'){
        return foundation;
    }
    render();
}
function chkWin() {
    if (foundation[0].length === foundation[1].length === foundation[2].length === foundation[3].length === 13) {
        console.log('winner winner chicken dinner');
    }
}
init();

//add king to empty tableau column
//* setting a lose condition
//b click and drag functionality
//c css image library link
//d general styling
//e undo button