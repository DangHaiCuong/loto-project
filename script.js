// Game state
let gameState = {
    mode: null, // 'host' or 'player'
    numberRange: 90,
    availableNumbers: [],
    drawnNumbers: [],
    playerCard: [],
    markedNumbers: [],
    playerName: null,
    gameListener: null,
    notificationListener: null
};

// Global game path in Firebase
const GAME_PATH = 'game';

// ============ UTILITY FUNCTIONS ============

function checkFirebaseReady() {
    if (!window.firebaseDB) {
        alert('⚠️ Firebase chưa được cấu hình!\n\nVui lòng xem FIREBASE_SETUP.md để biết cách setup Firebase.');
        return false;
    }
    return true;
}

function generatePlayerName() {
    const adjectives = ['Vui', 'Nhanh', 'May', 'Khéo', 'Giỏi', 'Thông', 'Lanh', 'Tinh'];
    const nouns = ['Mắn', 'Tay', 'Lành', 'Ý', 'Trí', 'Khôn', 'Lợi'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
}

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
        listenToGame();
    }
}

function backToModeSelection() {
    // Clean up listeners
    if (gameState.gameListener) {
        gameState.gameListener();
    }
    if (gameState.notificationListener) {
        gameState.notificationListener();
    }

    // Reset
    gameState = {
        mode: null,
        numberRange: 90,
        availableNumbers: [],
        drawnNumbers: [],
        playerCard: [],
        markedNumbers: [],
        playerName: null,
        gameListener: null,
        notificationListener: null
    };

    // Hide all modes
    document.getElementById('host-mode').style.display = 'none';
    document.getElementById('player-mode').style.display = 'none';
    document.getElementById('mode-selection').style.display = 'block';

    // Reset displays
    document.getElementById('game-settings').style.display = 'block';
    document.getElementById('game-active').style.display = 'none';
    document.getElementById('waiting-screen').style.display = 'block';
    document.getElementById('player-card').style.display = 'none';
}

// ============ HOST MODE ============

function startGame() {
    if (!checkFirebaseReady()) return;

    const range = parseInt(document.getElementById('number-range').value);
    gameState.numberRange = range;
    gameState.availableNumbers = [];
    gameState.drawnNumbers = [];

    // Create and shuffle numbers
    for (let i = 1; i <= range; i++) {
        gameState.availableNumbers.push(i);
    }
    shuffleArray(gameState.availableNumbers);

    // Create game in Firebase
    const gameRef = window.firebaseRef(window.firebaseDB, GAME_PATH);
    window.firebaseSet(gameRef, {
        numberRange: range,
        currentNumber: null,
        drawnNumbers: [],
        status: 'active',
        createdAt: Date.now()
    });

    // Listen to notifications
    listenToNotifications();

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

    // Update Firebase
    const gameRef = window.firebaseRef(window.firebaseDB, GAME_PATH);
    window.firebaseUpdate(gameRef, {
        currentNumber: number,
        drawnNumbers: gameState.drawnNumbers,
        lastUpdate: Date.now()
    });

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

function listenToNotifications() {
    const notifRef = window.firebaseRef(window.firebaseDB, `${GAME_PATH}/notifications`);

    gameState.notificationListener = window.firebaseOnValue(notifRef, (snapshot) => {
        const notifications = snapshot.val();
        const notifList = document.getElementById('notification-list');
        notifList.innerHTML = '';

        if (!notifications) {
            document.getElementById('notifications').style.display = 'none';
            return;
        }

        document.getElementById('notifications').style.display = 'block';

        const notifArray = Object.entries(notifications).map(([id, data]) => ({
            id,
            ...data
        })).sort((a, b) => b.timestamp - a.timestamp);

        notifArray.forEach(notif => {
            const item = document.createElement('div');
            item.className = `notification-item ${notif.type}`;

            const playerName = document.createElement('span');
            playerName.textContent = `${notif.type === 'cho' ? '🔔 CHỜ' : '🏆 KINH'}: ${notif.playerName}`;

            const timestamp = document.createElement('span');
            const date = new Date(notif.timestamp);
            timestamp.textContent = date.toLocaleTimeString('vi-VN');

            item.appendChild(playerName);
            item.appendChild(timestamp);
            notifList.appendChild(item);
        });
    });
}

function resetGame() {
    if (confirm('Chơi lại từ đầu? Mọi người sẽ mất bảng hiện tại.')) {
        const gameRef = window.firebaseRef(window.firebaseDB, GAME_PATH);
        window.firebaseRemove(gameRef);

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

function listenToGame() {
    if (!checkFirebaseReady()) return;

    const gameRef = window.firebaseRef(window.firebaseDB, GAME_PATH);

    gameState.gameListener = window.firebaseOnValue(gameRef, (snapshot) => {
        const gameData = snapshot.val();

        if (!gameData || gameData.status !== 'active') {
            // No game running
            document.getElementById('waiting-screen').style.display = 'block';
            document.getElementById('player-card').style.display = 'none';
            return;
        }

        // Game is active
        if (!gameState.playerCard.length) {
            // Generate card first time
            gameState.numberRange = gameData.numberRange;
            gameState.playerName = generatePlayerName();
            generateCardForRoom();

            document.getElementById('waiting-screen').style.display = 'none';
            document.getElementById('player-card').style.display = 'block';
        }

        // Update current number
        if (gameData.currentNumber) {
            document.getElementById('player-current-number').textContent = gameData.currentNumber;

            // Flash if number is on card
            if (gameState.playerCard.includes(gameData.currentNumber)) {
                flashScreen();
            }
        }
    });
}

function flashScreen() {
    const body = document.body;
    const originalBg = body.style.background;
    body.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
    setTimeout(() => {
        body.style.background = originalBg;
    }, 300);
}

function generateCardForRoom() {
    gameState.markedNumbers = [];

    if (gameState.numberRange === 90) {
        generateCard90();
    } else if (gameState.numberRange === 75) {
        generateCard75();
    }

    document.getElementById('card-serial').textContent = generateSerial();
    updateMarkedCount();
}

function regenerateCard() {
    if (confirm('Đổi vé mới? Bạn sẽ mất các đánh dấu hiện tại.')) {
        generateCardForRoom();
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

// ============ ANNOUNCEMENTS ============

function announceWaiting() {
    if (!checkFirebaseReady()) return;
    if (!gameState.playerName) {
        alert('Chưa có trò chơi đang diễn ra!');
        return;
    }

    const notifRef = window.firebaseRef(window.firebaseDB, `${GAME_PATH}/notifications`);
    const newNotif = window.firebasePush(notifRef);

    window.firebaseSet(newNotif, {
        type: 'cho',
        playerName: gameState.playerName,
        timestamp: Date.now()
    });

    const btn = document.getElementById('cho-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Đã gửi!';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

function announceWin() {
    if (!checkFirebaseReady()) return;
    if (!gameState.playerName) {
        alert('Chưa có trò chơi đang diễn ra!');
        return;
    }

    if (confirm('Bạn chắc chắn đã thắng chưa? Quản trò sẽ kiểm tra!')) {
        const notifRef = window.firebaseRef(window.firebaseDB, `${GAME_PATH}/notifications`);
        const newNotif = window.firebasePush(notifRef);

        window.firebaseSet(newNotif, {
            type: 'kinh',
            playerName: gameState.playerName,
            timestamp: Date.now()
        });

        const btn = document.getElementById('kinh-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '🎉 Đã báo thắng!';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 3000);

        // Celebration
        document.body.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
        setTimeout(() => {
            document.body.style.background = '';
        }, 1000);
    }
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
