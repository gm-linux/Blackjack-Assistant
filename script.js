const cardValues = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 10, "Q": 10, "K": 10, "A": 11
};

function initializeDecks(numDecks) {
    const deck = {};
    const ranks = Object.keys(cardValues);

    ranks.forEach(rank => {
        deck[rank] = numDecks * 4; // 4 of each card per deck
    });

    return deck;
}

function calculateHandValue(cards) {
    let total = 0;
    let aces = 0;

    cards.forEach(card => {
        total += cardValues[card.toUpperCase()] || 0;
        if (card.toUpperCase() === "A") aces++;
    });

    while (total > 21 && aces > 0) {
        total -= 10; // Count Ace as 1 instead of 11
        aces--;
    }

    return total;
}

function adjustDeck(deck, cards) {
    cards.forEach(card => {
        const cardKey = card.toUpperCase();
        if (deck[cardKey]) {
            deck[cardKey]--;
        }
    });
}

function calculateOdds(deck) {
    const totalCards = Object.values(deck).reduce((sum, count) => sum + count, 0);
    const odds = {};

    Object.keys(deck).forEach(card => {
        odds[card] = ((deck[card] / totalCards) * 100).toFixed(2); // Percentages
    });

    return odds;
}

function getAdvice(playerHand, dealerCard, numDecks) {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = cardValues[dealerCard.toUpperCase()] || 0;

    if (playerValue > 21) return "Bust! You lose.";
    if (playerValue === 21) return "Blackjack! Stand.";

    if (playerHand.length === 2 && playerHand[0] === playerHand[1]) {
        if (playerValue === 16 || playerValue === 14) return "Split.";
    }

    if (playerValue <= 11) return "Hit.";
    if (playerValue >= 17) return "Stand.";

    if (playerValue >= 12 && playerValue <= 16) {
        if (dealerValue >= 7) return "Hit.";
        return "Stand.";
    }

    return "Error calculating advice.";
}

document.getElementById("calculate-btn").addEventListener("click", () => {
    const playerHandInput = document.getElementById("player-hand").value.split(",").map(card => card.trim());
    const dealerCardInput = document.getElementById("dealer-card").value.trim();
    const numDecks = parseInt(document.getElementById("num-decks").value);

    if (playerHandInput.length === 0 || !dealerCardInput || isNaN(numDecks)) {
        document.getElementById("advice-output").innerText = "Please provide valid inputs.";
        return;
    }

    // Initialize and adjust the deck
    const deck = initializeDecks(numDecks);
    adjustDeck(deck, [...playerHandInput, dealerCardInput]);

    // Calculate advice
    const advice = getAdvice(playerHandInput, dealerCardInput, numDecks);
    document.getElementById("advice-output").innerText = advice;

    // Calculate odds
    const odds = calculateOdds(deck);
    const oddsOutput = Object.entries(odds).map(([card, percentage]) => `${card}: ${percentage}%`).join(", ");
    document.getElementById("odds-output").innerText = `Odds of drawing each card: ${oddsOutput}`;
});
