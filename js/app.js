/*----- constants -----*/
let suit = ["spades", "hearts", "clubs", "diamonds"];
let rank = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

/*----- app"s state (variables) -----*/
let deck, stock, tableau, foundation, waste, previousEl;

/*----- cached element references -----*/
let tableauEl = document.getElementById("tableau");
let foundationEl = document.getElementById("foundation");
let wasteEl = document.getElementById("waste");
let stockEl = document.getElementById("stock");

/*----- event listeners -----*/
document.getElementById("restart").addEventListener("click", init);
stockEl.addEventListener("click", addWaste);
wasteEl.addEventListener("mousedown", selectWaste);
tableauEl.addEventListener("mousedown", selectTableau);
tableauEl.addEventListener("mouseup", addTableau);
foundationEl.addEventListener("mouseup", addFoundation);
document.addEventListener("mouseup", chkPlay);

/*----- functions -----*/
function init() {
  deck = [];
  activeCard = [];
  stock = [];
  waste = [];
  tableau = [[], [], [], [], [], [], []];
  foundation = [[], [], [], []];
  makeDeck();
  shuffleDeck();
  makeTableau();
  render();
  displayActive();
}
function render() {
  var tChildren = tableauEl.children;
  var h = 0;
  for (col in tableau) {
    while (tChildren[col].firstChild) {
      tChildren[col].removeChild(tChildren[col].firstChild);
    }
    var i = 0;
    for (card in tableau[col]) {
      if (tableau[col][card].isActive) {
        tChildren[col].innerHTML = `${
          tChildren[col].innerHTML
        }<div id="${h}${i}"class="cards"></div>`;
        tChildren[col].lastChild.style.backgroundImage =
          "url(" + tableau[col][card].imgLink + ")";
      } else {
        tChildren[col].innerHTML = `${
          tChildren[col].innerHTML
        }<div id="${h}${i}"class="cards"></div>`;
        tChildren[col].lastChild.setAttribute(
          "style",
          "background:linear-gradient(135deg, #00ffff 0%,#ff00ff 100%);"
        );
      }
      i++;
    }
    h++;
  }
  while (wasteEl.childElementCount > 0) {
    wasteEl.removeChild(wasteEl.firstChild);
  }
  for (card in waste) {
    waste[card].isActive = false;
    if (card >= waste.length - 3) {
      wasteEl.innerHTML =
        wasteEl.innerHTML + `<div id="7${card}" class="cards"></div>`;
      wasteEl.lastChild.style.backgroundImage =
        "url(" + waste[card].imgLink + ")";
      if (Number(card) === waste.length - 1) waste[card].isActive = true;
    }
  }
  for (arr in foundation) {
    if (!foundation[arr].length) {
      document.getElementById(arr + "f").style.backgroundImage = "url(none)";
      document.getElementById(arr + "f").style.background =
        "linear-gradient(135deg, magenta, cyan)";
    } else {
      document
        .getElementById(arr + "f")
        .setAttribute(
          "style",
          "background-color:cyan; background-size:cover; background-image:url(" +
            foundation[arr][foundation[arr].length - 1].imgLink +
            ");"
        );
    }
  }
  if (!stock.length) {
    stockEl.setAttribute(
      "style",
      "background-color:black; border:3px solid cyan;"
    );
  } else {
    stockEl.setAttribute(
      "style",
      "background:linear-gradient(135deg, #00ffff 0%,#ff00ff 100%); border:2px solid magenta;"
    );
  }
  chkWin();
}
class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.isActive = false;
    var rankName;
    switch (this.rank) {
      case 1:
        rankName = "A";
        break;
      case 10:
        rankName = "r" + rank;
        break;
      case 11:
        rankName = "J";
        break;
      case 12:
        rankName = "Q";
        break;
      case 13:
        rankName = "K";
        break;
      default:
        rankName = "r0" + this.rank;
    }
    this.imgLink =
      "./css/img/" + this.suit + "/" + this.suit + "-" + rankName + ".svg";
  }
}
function makeDeck() {
  for (s in suit) {
    for (r in rank) {
      deck.push(new Card(suit[s], rank[r]));
    }
  }
  return deck;
}
function shuffleDeck() {
  for (var i = 0; i < 52; i++) {
    var randI = Math.floor(Math.random() * deck.length);
    stock.push(deck[randI]);
    deck.splice(randI, 1);
  }
  return stock;
}
function makeTableau() {
  for (t in tableau) {
    while (tableau[t].length <= t) {
      tableau[t].push(stock.pop());
    }
    tableau[t][t].isActive = true;
  }
}
function addFoundation(e) {
  if (activeCard.length === 1) {
    var fTarget = foundation[e.target.id.charAt(0)];
    var isSuit =
      fTarget.length === 0 ||
      fTarget[fTarget.length - 1].suit === activeCard[0].suit;
    var isRank = fTarget.length + 1 === activeCard[0].rank;
    if (!activeCard.length) {
      activeCard.push(fTarget[fTarget.length - 1].pop());
    }
    if (isRank && isSuit) {
      fTarget.push(activeCard.pop());
    } else {
      console.log(previousEl);
    }
  }
  render();
  displayActive(e);
}
function addTableau(e) {
  if (activeCard.length) {
    var tTarget = tableau[e.target.id.charAt(0)];
    if (activeCard[0].rank === 13 && tTarget.length === 0) {
      while (activeCard.length > 0) {
        tTarget.push(activeCard.shift());
      }
    } else {
      var rankChk = activeCard[0].rank + 1 === tTarget[tTarget.length - 1].rank;
      var suitChk =
        suit.indexOf(activeCard[0].suit) %
        2 !==
        suit.indexOf(tTarget[tTarget.length - 1].suit) % 2;
      if (rankChk && suitChk) {
        console.log(rankChk, suitChk);
        while (activeCard.length > 0) {
          tTarget.push(activeCard.shift());
        }
      } else {
        console.log("Failed to add to tableau");
      }
    }
    render();
    displayActive(e);
  }
}
function addWaste(e) {
  if (!activeCard.length) {
    if (stock.length === 0) {
      stock = stock.concat(waste.reverse());
      waste = [];
    } else {
      waste = waste.concat(stock.splice(stock.length - 3).reverse());
    }
  }
  displayActive(e);
  render();
}
function selectTableau(e) {
  previousEl = e.target.parentNode.id;
  if (!activeCard.length) {
    var inArr = e.target.parentNode.className;
    if (inArr === "tableau") {
      var tColumn = e.target.id.charAt(0);
      var tRow = e.target.id.substring(1);
      var canSelect = tableau[tColumn][tRow];
      if (!activeCard.length && canSelect.isActive) {
        activeCard = tableau[tColumn].splice(
          tRow,
          tableau[tColumn].length - tRow
        );
      }
      if (
        !activeCard.length &&
        canSelect === tableau[tColumn][tableau[tColumn].length - 1]
      ) {
        canSelect.isActive = true;
      }
    }
  }
  displayActive(e);
  render();
}
function selectWaste(e) {
  previousEl = e.target.parentNode.id;
  if (!activeCard.length) activeCard.push(waste.pop());
  displayActive(e);
  render();
}
function chkWin() {
  if (
    foundation[0].length +
      foundation[1].length +
      foundation[2].length +
      foundation[3].length ===
    52
  )
    tableauEl.textContent = "Congratulations!";
}
function displayActive(e) {
  var activeCardDom = document.getElementById("active-cards");
  while (activeCardDom.firstChild) {
    activeCardDom.removeChild(activeCardDom.firstChild);
  }
  if (activeCard.length) {
    var shiftX = e.target.clientX - e.target.getBoundingClientRect().left;
    var shiftY = e.target.clientY - e.target.getBoundingClientRect().top;
    document.getElementById("active-cards").style.position = "absolute";
    document.getElementById("active-cards").style.zIndex = 1000;
    if (e.target.id.substring(1) === e.path[1].lastChild.id.substring(1)) {
      document.getElementById("active-cards").appendChild(e.target);
    } else {
      for (child in e.path[1].children) {
        if (e.path[1].childNodes[e.target.id.substring(1)]) {
          document
            .getElementById("active-cards")
            .appendChild(e.path[1].childNodes[e.target.id.substring(1)]);
        }
      }
    }
    moveAt(e.clientX, e.clientY);
    function moveAt(pageX, pageY) {
      document.getElementById("active-cards").style.left = pageX + "px";
      document.getElementById("active-cards").style.top = pageY + "px";
    }
    function onMouseMove(e) {
      moveAt(e.clientX, e.clientY);
    }
    document.addEventListener("mousemove", onMouseMove);
  }
}

function chkPlay() {
  var tTarget = tableau[previousEl.charAt(0)];

  if (activeCard.length) {
    if (previousEl === "waste") {
      waste.push(activeCard.pop());
    } else {
      while (activeCard.length > 0) {
        tTarget.push(activeCard.shift());
      }
      console.log(previousEl);
    }
    alert("that isn't how you play solitaire fam");
  }
  render();
  displayActive();
}
init();
