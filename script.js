const cardValues = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 10, "Q": 10, "K": 10, "A": 11
};

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

function getAdvice(playerHand, dealerCard) {
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

    if (playerHandInput.length === 0 || !dealerCardInput) {
        document.getElementById("advice-output").innerText = "Please provide valid inputs.";
        return;
    }

    const advice = getAdvice(playerHandInput, dealerCardInput);
    document.getElementById("advice-output").innerText = advice;
});
