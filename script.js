// Game state
let gameState = {
    mode: null, // 'host' or 'player'
    numberRange: 90,
    availableNumbers: [],
    drawnNumbers: [],
    playerCard: [],
    markedNumbers: []
};

// ============ UTILITY FUNCTIONS ============

function generateSerial() {
    return `VN-${Date.now().toString(36).toUpperCase()}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomNumber(min, max, excludeArray) {
    let num;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
        attempts++;
        if (attempts > maxAttempts) {
            for (let i = min; i <= max; i++) {
                if (!excludeArray.includes(i)) {
                    num = i;
                    break;
                }
            }
            break;
        }
    } while (excludeArray.includes(num));

    return num;
}

function getRandomColumns(total, count) {
    const columns = [];
    while (columns.length < count) {
        const col = Math.floor(Math.random() * total);
        if (!columns.includes(col)) {
            columns.push(col);
        }
    }
    return columns.sort((a, b) => a - b);
}

// ============ MODE SELECTION ============

function selectMode(mode) {
    gameState.mode = mode;
    document.getElementById('mode-selection').style.display = 'none';

    if (mode === 'host') {
        document.getElementById('host-mode').style.display = 'block';
    } else if (mode === 'player') {
        document.getElementById('player-mode').style.display = 'block';
    }
}

function backToModeSelection() {
    // Reset
    gameState = {
        mode: null,
        numberRange: 90,
        availableNumbers: [],
        drawnNumbers: [],
        playerCard: [],
        markedNumbers: []
    };

    // Hide all modes
    document.getElementById('host-mode').style.display = 'none';
    document.getElementById('player-mode').style.display = 'none';
    document.getElementById('mode-selection').style.display = 'block';

    // Reset displays
    document.getElementById('game-settings').style.display = 'block';
    document.getElementById('game-active').style.display = 'none';
    document.getElementById('card-settings').style.display = 'block';
    document.getElementById('player-card').style.display = 'none';
}

// ============ HOST MODE ============

function startGame() {
    const range = parseInt(document.getElementById('number-range').value);
    gameState.numberRange = range;
    gameState.availableNumbers = [];
    gameState.drawnNumbers = [];

    // Create and shuffle numbers
    for (let i = 1; i <= range; i++) {
        gameState.availableNumbers.push(i);
    }
    shuffleArray(gameState.availableNumbers);

    // Show game screen
    document.getElementById('game-settings').style.display = 'none';
    document.getElementById('game-active').style.display = 'block';
    document.getElementById('remaining-count').textContent = gameState.availableNumbers.length;
    document.getElementById('drawn-count').textContent = 0;
    updateLED('0', '0');
}

function drawNumber() {
    if (gameState.availableNumbers.length === 0) {
        alert('Đã quay hết tất cả các số!');
        return;
    }

    const number = gameState.availableNumbers.shift();
    gameState.drawnNumbers.push(number);

    // Animate LED with rolling effect
    animateLED(number);

    // Update display
    document.getElementById('remaining-count').textContent = gameState.availableNumbers.length;
    document.getElementById('drawn-count').textContent = gameState.drawnNumbers.length;

    // Update history
    updateDrawnNumbersList();

    // Disable if done
    if (gameState.availableNumbers.length === 0) {
        document.getElementById('draw-btn').disabled = true;
        document.getElementById('draw-btn').textContent = '🎉 Đã hết số!';
    }
}

function animateLED(finalNumber) {
    const tens = Math.floor(finalNumber / 10);
    const ones = finalNumber % 10;

    // Rolling animation
    let rolls = 0;
    const maxRolls = 15;

    const interval = setInterval(() => {
        const randomTens = Math.floor(Math.random() * 10);
        const randomOnes = Math.floor(Math.random() * 10);
        updateLED(randomTens, randomOnes);

        rolls++;
        if (rolls >= maxRolls) {
            clearInterval(interval);
            updateLED(tens, ones);
        }
    }, 50);
}

function updateLED(tens, ones) {
    document.getElementById('led-tens').textContent = tens;
    document.getElementById('led-ones').textContent = ones;
}

function updateDrawnNumbersList() {
    const drawnList = document.getElementById('drawn-list');
    drawnList.innerHTML = '';

    const reversedDrawn = [...gameState.drawnNumbers].reverse();

    reversedDrawn.forEach((num, index) => {
        const numDiv = document.createElement('div');
        numDiv.className = 'number-item';
        if (index === 0) {
            numDiv.classList.add('latest');
        }
        numDiv.textContent = num;
        drawnList.appendChild(numDiv);
    });
}

function resetGame() {
    if (confirm('Chơi lại từ đầu?')) {
        document.getElementById('game-settings').style.display = 'block';
        document.getElementById('game-active').style.display = 'none';
        gameState.availableNumbers = [];
        gameState.drawnNumbers = [];
        document.getElementById('draw-btn').disabled = false;
        document.getElementById('draw-btn').textContent = '🎲 Quay số tiếp';
        updateLED('0', '0');
    }
}

// ============ PLAYER MODE ============

function generatePlayerCard() {
    const cardType = parseInt(document.getElementById('player-card-type').value);
    gameState.numberRange = cardType;
    gameState.markedNumbers = [];

    if (cardType === 90) {
        generateCard90();
    } else if (cardType === 75) {
        generateCard75();
    }

    document.getElementById('card-serial').textContent = generateSerial();
    document.getElementById('card-settings').style.display = 'none';
    document.getElementById('player-card').style.display = 'block';
    updateMarkedCount();
}

function regenerateCard() {
    if (confirm('Đổi vé mới? Bạn sẽ mất các đánh dấu hiện tại.')) {
        const cardType = gameState.numberRange;
        gameState.markedNumbers = [];

        if (cardType === 90) {
            generateCard90();
        } else if (cardType === 75) {
            generateCard75();
        }

        document.getElementById('card-serial').textContent = generateSerial();
        updateMarkedCount();
    }
}

function generateCard90() {
    const card = [];
    const lotoCard = document.getElementById('loto-card');
    lotoCard.innerHTML = '';
    lotoCard.className = 'loto-card grid-90';

    for (let row = 0; row < 3; row++) {
        const rowNumbers = [];
        const columnsWithNumbers = getRandomColumns(9, 5);

        for (let col = 0; col < 9; col++) {
            if (columnsWithNumbers.includes(col)) {
                const min = col === 0 ? 1 : col * 10;
                const max = col === 8 ? 90 : (col + 1) * 10 - 1;
                const number = getRandomNumber(min, max, card);
                rowNumbers.push(number);
                card.push(number);
            } else {
                rowNumbers.push(null);
            }
        }

        const numbersOnly = rowNumbers.filter(n => n !== null).sort((a, b) => a - b);
        let numIndex = 0;
        for (let i = 0; i < rowNumbers.length; i++) {
            if (rowNumbers[i] !== null) {
                rowNumbers[i] = numbersOnly[numIndex++];
            }
        }

        rowNumbers.forEach(num => {
            const cell = document.createElement('div');
            if (num === null) {
                cell.className = 'number-cell empty';
            } else {
                cell.className = 'number-cell';
                cell.textContent = num;
                cell.onclick = () => toggleMark(num);
            }
            lotoCard.appendChild(cell);
        });
    }

    gameState.playerCard = card;
}

function generateCard75() {
    const card = [];
    const lotoCard = document.getElementById('loto-card');
    lotoCard.innerHTML = '';
    lotoCard.className = 'loto-card grid-75';

    const ranges = [
        [1, 15], [16, 30], [31, 45], [46, 60], [61, 75]
    ];

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');

            if (row === 2 && col === 2) {
                cell.className = 'number-cell marked';
                cell.textContent = 'FREE';
                cell.onclick = null;
            } else {
                const [min, max] = ranges[col];
                const number = getRandomNumber(min, max, card);
                card.push(number);

                cell.className = 'number-cell';
                cell.textContent = number;
                cell.onclick = () => toggleMark(number);
            }

            lotoCard.appendChild(cell);
        }
    }

    gameState.playerCard = card;
}

function toggleMark(number) {
    const index = gameState.markedNumbers.indexOf(number);
    const cells = document.querySelectorAll('.number-cell');

    if (index > -1) {
        gameState.markedNumbers.splice(index, 1);
        cells.forEach(cell => {
            if (parseInt(cell.textContent) === number) {
                cell.classList.remove('marked');
            }
        });
    } else {
        gameState.markedNumbers.push(number);
        cells.forEach(cell => {
            if (parseInt(cell.textContent) === number) {
                cell.classList.add('marked');
            }
        });
    }

    updateMarkedCount();
}

function clearMarks() {
    gameState.markedNumbers = [];
    const cells = document.querySelectorAll('.number-cell');
    cells.forEach(cell => {
        if (cell.textContent !== 'FREE') {
            cell.classList.remove('marked');
        }
    });
    updateMarkedCount();
}

function updateMarkedCount() {
    document.getElementById('marked-count').textContent = gameState.markedNumbers.length;
}

// ============ KEYBOARD SHORTCUTS ============

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && gameState.mode === 'host') {
        const gameActive = document.getElementById('game-active');
        if (gameActive.style.display === 'block') {
            event.preventDefault();
            drawNumber();
        }
    }
});
