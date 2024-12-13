const cardValues = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 10, "Q": 10, "K": 10, "A": 11
};

// Initialize selected cards
let playerHand = [];
let dealerCard = null;

// Generate card buttons
function generateCardButtons(containerId, clickHandler) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear container before adding buttons
    Object.keys(cardValues).forEach(card => {
        const button = document.createElement("button");
        button.innerText = card;
        button.classList.add("card-button");
        button.addEventListener("click", () => clickHandler(card, button));
        container.appendChild(button);
    });
}

// Update player hand display
function updatePlayerHandDisplay() {
    document.getElementById("player-hand-display").innerText = 
        `Selected Hand: ${playerHand.length > 0 ? playerHand.join(", ") : "None"}`;
}

// Update dealer card display
function updateDealerCardDisplay() {
    document.getElementById("dealer-card-display").innerText = 
        `Selected Dealer Card: ${dealerCard || "None"}`;
}

// Handle player card selection
function handlePlayerCardSelection(card, button) {
    if (playerHand.includes(card)) {
        playerHand = playerHand.filter(c => c !== card);
        button.classList.remove("selected");
    } else {
        playerHand.push(card);
        button.classList.add("selected");
    }
    updatePlayerHandDisplay();
    calculateAndDisplayResults();
}

// Handle dealer card selection
function handleDealerCardSelection(card, button) {
    const prevSelected = document.querySelector("#dealer-card-buttons button.selected");
    if (prevSelected) prevSelected.classList.remove("selected");

    dealerCard = card;
    button.classList.add("selected");
    updateDealerCardDisplay();
    calculateAndDisplayResults();
}

// Calculate and display results (advice and odds)
function calculateAndDisplayResults() {
    const numDecks = parseInt(document.getElementById("num-decks").value);
    if (playerHand.length === 0 || !dealerCard) {
        document.getElementById("advice-output").innerText = "Please select your cards.";
        document.getElementById("odds-output").innerText = "Select your cards above to see odds.";
        return;
    }

    const deck = initializeDecks(numDecks);
    adjustDeck(deck, [...playerHand, dealerCard]);

    const advice = getAdvice(playerHand, dealerCard);
    const odds = calculateOdds(deck);

    document.getElementById("advice-output").innerText = `Advice: ${advice}`;
    const oddsOutput = Object.entries(odds).map(([card, percentage]) => `${card}: ${percentage}%`).join(", ");
    document.getElementById("odds-output").innerText = `Odds: ${oddsOutput}`;
}

// Initialize deck composition
function initializeDecks(numDecks) {
    const deck = {};
    Object.keys(cardValues).forEach(rank => {
        deck[rank] = numDecks * 4; // 4 of each card per deck
    });
    return deck;
}

// Adjust deck composition
function adjustDeck(deck, cards) {
    cards.forEach(card => {
        const cardKey = card.toUpperCase();
        if (deck[cardKey]) {
            deck[cardKey]--;
        }
    });
}

// Calculate odds
function calculateOdds(deck) {
    const totalCards = Object.values(deck).reduce((sum, count) => sum + count, 0);
    const odds = {};

    Object.keys(deck).forEach(card => {
        odds[card] = ((deck[card] / totalCards) * 100).toFixed(2); // Percentages
    });

    return odds;
}

// Get advice
function getAdvice(playerHand, dealerCard) {
    const playerValue = playerHand.reduce((sum, card) => sum + cardValues[card], 0);
    const dealerValue = cardValues[dealerCard];

    if (playerValue > 21) return "Bust! You lose.";
    if (playerValue === 21) return "Blackjack! Stand.";
    if (playerValue >= 17) return "Stand.";
    if (playerValue <= 11) return "Hit.";
    if (playerValue >= 12 && dealerValue >= 7) return "Hit.";
    return "Stand.";
}

// Add event listener to update results on deck change
document.getElementById("num-decks").addEventListener("change", calculateAndDisplayResults);

// Initialize buttons
generateCardButtons("player-hand-buttons", handlePlayerCardSelection);
generateCardButtons("dealer-card-buttons", handleDealerCardSelection);
