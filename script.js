// Game state
let gameState = {
    mode: null, // 'host' or 'player'
    roomCode: null,
    numberRange: 90,
    availableNumbers: [],
    drawnNumbers: [],
    playerCard: [],
    markedNumbers: [],
    firebaseListener: null
};

// ============ FIREBASE HELPERS ============

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function checkFirebaseReady() {
    if (!window.firebaseDB) {
        alert('⚠️ Firebase chưa được cấu hình!\n\nVui lòng xem README.md để biết cách setup Firebase.');
        return false;
    }
    return true;
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
    // Clean up Firebase listener
    if (gameState.firebaseListener) {
        gameState.firebaseListener();
    }

    // Delete room if host
    if (gameState.mode === 'host' && gameState.roomCode && window.firebaseDB) {
        const roomRef = window.firebaseRef(window.firebaseDB, `rooms/${gameState.roomCode}`);
        window.firebaseRemove(roomRef);
    }

    // Reset game state
    gameState = {
        mode: null,
        roomCode: null,
        numberRange: 90,
        availableNumbers: [],
        drawnNumbers: [],
        playerCard: [],
        markedNumbers: [],
        firebaseListener: null
    };

    // Hide all modes
    document.getElementById('host-mode').style.display = 'none';
    document.getElementById('player-mode').style.display = 'none';

    // Show mode selection
    document.getElementById('mode-selection').style.display = 'block';

    // Reset host mode
    document.getElementById('game-settings').style.display = 'block';
    document.getElementById('game-active').style.display = 'none';
    document.getElementById('current-number').textContent = '-';
    document.getElementById('drawn-list').innerHTML = '';

    // Reset player mode
    document.getElementById('card-settings').style.display = 'block';
    document.getElementById('player-card').style.display = 'none';
    document.getElementById('loto-card').innerHTML = '';
    document.getElementById('room-code-input').value = '';
}

// ============ HOST MODE ============

function startGame() {
    if (!checkFirebaseReady()) return;

    const range = parseInt(document.getElementById('number-range').value);
    gameState.numberRange = range;
    gameState.availableNumbers = [];
    gameState.drawnNumbers = [];
    gameState.roomCode = generateRoomCode();

    // Create array of numbers from 1 to range
    for (let i = 1; i <= range; i++) {
        gameState.availableNumbers.push(i);
    }

    // Shuffle the numbers
    shuffleArray(gameState.availableNumbers);

    // Create room in Firebase
    const roomRef = window.firebaseRef(window.firebaseDB, `rooms/${gameState.roomCode}`);
    window.firebaseSet(roomRef, {
        numberRange: range,
        currentNumber: null,
        drawnNumbers: [],
        createdAt: Date.now(),
        status: 'active'
    });

    // Show game active screen
    document.getElementById('game-settings').style.display = 'none';
    document.getElementById('game-active').style.display = 'block';
    document.getElementById('room-code').textContent = gameState.roomCode;
    document.getElementById('remaining-count').textContent = gameState.availableNumbers.length;
    document.getElementById('current-number').textContent = '-';
    document.getElementById('drawn-list').innerHTML = '';
}

function drawNumber() {
    if (gameState.availableNumbers.length === 0) {
        alert('Đã quay hết tất cả các số!');
        return;
    }

    // Draw the next number
    const number = gameState.availableNumbers.shift();
    gameState.drawnNumbers.push(number);

    // Update Firebase
    const roomRef = window.firebaseRef(window.firebaseDB, `rooms/${gameState.roomCode}`);
    window.firebaseUpdate(roomRef, {
        currentNumber: number,
        drawnNumbers: gameState.drawnNumbers,
        lastUpdate: Date.now()
    });

    // Update display
    document.getElementById('current-number').textContent = number;
    document.getElementById('remaining-count').textContent = gameState.availableNumbers.length;

    // Update drawn numbers list
    updateDrawnNumbersList();

    // Disable button if no more numbers
    if (gameState.availableNumbers.length === 0) {
        document.getElementById('draw-btn').disabled = true;
        document.getElementById('draw-btn').textContent = 'Đã hết số!';
    }
}

function updateDrawnNumbersList() {
    const drawnList = document.getElementById('drawn-list');
    drawnList.innerHTML = '';

    // Display in reverse order (latest first)
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
    if (confirm('Bạn có chắc muốn chơi lại từ đầu?')) {
        // Delete old room
        if (gameState.roomCode && window.firebaseDB) {
            const roomRef = window.firebaseRef(window.firebaseDB, `rooms/${gameState.roomCode}`);
            window.firebaseRemove(roomRef);
        }

        // Reset
        document.getElementById('game-settings').style.display = 'block';
        document.getElementById('game-active').style.display = 'none';
        gameState.availableNumbers = [];
        gameState.drawnNumbers = [];
        gameState.roomCode = null;
        document.getElementById('draw-btn').disabled = false;
        document.getElementById('draw-btn').textContent = 'Quay số tiếp';
    }
}

// ============ PLAYER MODE ============

function joinRoom() {
    if (!checkFirebaseReady()) return;

    const roomCode = document.getElementById('room-code-input').value.trim().toUpperCase();

    if (roomCode.length !== 6) {
        alert('Vui lòng nhập mã phòng gồm 6 ký tự!');
        return;
    }

    // Check if room exists
    const roomRef = window.firebaseRef(window.firebaseDB, `rooms/${roomCode}`);
    window.firebaseOnValue(roomRef, (snapshot) => {
        const roomData = snapshot.val();

        if (!roomData || roomData.status !== 'active') {
            alert('Phòng không tồn tại hoặc đã kết thúc!');
            return;
        }

        // Join room
        gameState.roomCode = roomCode;
        gameState.numberRange = roomData.numberRange;

        // Generate player card
        generateCardForRoom();

        // Listen to room updates
        listenToRoomUpdates();

        // Show player card
        document.getElementById('card-settings').style.display = 'none';
        document.getElementById('player-card').style.display = 'block';
        document.getElementById('player-room-code').textContent = roomCode;
        document.getElementById('player-current-number').textContent = roomData.currentNumber || '-';

    }, { onlyOnce: true });
}

function listenToRoomUpdates() {
    const roomRef = window.firebaseRef(window.firebaseDB, `rooms/${gameState.roomCode}`);

    gameState.firebaseListener = window.firebaseOnValue(roomRef, (snapshot) => {
        const roomData = snapshot.val();

        if (!roomData) {
            alert('Phòng đã bị xóa hoặc kết thúc!');
            backToModeSelection();
            return;
        }

        // Update current number display
        if (roomData.currentNumber) {
            document.getElementById('player-current-number').textContent = roomData.currentNumber;

            // Show notification
            showNumberNotification(roomData.currentNumber);

            // Auto-mark if number is on player's card
            autoMarkNumber(roomData.currentNumber);
        }
    });
}

function showNumberNotification(number) {
    // Check if number is on player's card
    const hasNumber = gameState.playerCard.includes(number);

    if (hasNumber) {
        // Flash the screen or show notification
        const body = document.body;
        body.style.backgroundColor = '#10b981';
        setTimeout(() => {
            body.style.backgroundColor = '';
        }, 300);
    }
}

function autoMarkNumber(number) {
    // Optional: Automatically mark the number if it's on the card
    if (gameState.playerCard.includes(number) && !gameState.markedNumbers.includes(number)) {
        // Uncomment to enable auto-mark
        // toggleMark(number);
    }
}

function generateCardForRoom() {
    gameState.markedNumbers = [];

    if (gameState.numberRange === 90) {
        generateCard90();
    } else if (gameState.numberRange === 75) {
        generateCard75();
    }

    updateMarkedCount();
}

function regenerateCard() {
    if (confirm('Tạo bảng mới? Bạn sẽ mất các đánh dấu hiện tại.')) {
        generateCardForRoom();
    }
}

function generateCard90() {
    // Traditional Italian Tombola card: 3 rows x 9 columns
    // Each row has 5 numbers and 4 empty spaces
    // Each column represents a range of numbers (col 0: 1-9, col 1: 10-19, etc.)

    const card = [];
    const lotoCard = document.getElementById('loto-card');
    lotoCard.innerHTML = '';
    lotoCard.className = 'loto-card grid-90';

    // Create 3 rows
    for (let row = 0; row < 3; row++) {
        const rowNumbers = [];

        // For each column (0-8), decide if this column should have a number in this row
        const columnsWithNumbers = getRandomColumns(9, 5); // 5 numbers per row

        for (let col = 0; col < 9; col++) {
            if (columnsWithNumbers.includes(col)) {
                // Generate number for this column
                const min = col === 0 ? 1 : col * 10;
                const max = col === 8 ? 90 : (col + 1) * 10 - 1;
                const number = getRandomNumber(min, max, card);
                rowNumbers.push(number);
                card.push(number);
            } else {
                rowNumbers.push(null); // Empty cell
            }
        }

        // Sort numbers within each row (only the numbers, keep nulls in place)
        const numbersOnly = rowNumbers.filter(n => n !== null).sort((a, b) => a - b);
        let numIndex = 0;
        for (let i = 0; i < rowNumbers.length; i++) {
            if (rowNumbers[i] !== null) {
                rowNumbers[i] = numbersOnly[numIndex++];
            }
        }

        // Add cells to DOM
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
    // American Bingo card: 5x5 with FREE space in center
    // Column B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75

    const card = [];
    const lotoCard = document.getElementById('loto-card');
    lotoCard.innerHTML = '';
    lotoCard.className = 'loto-card grid-75';

    const ranges = [
        [1, 15],   // B
        [16, 30],  // I
        [31, 45],  // N
        [46, 60],  // G
        [61, 75]   // O
    ];

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');

            // Free space in center
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
        // Unmark
        gameState.markedNumbers.splice(index, 1);
        cells.forEach(cell => {
            if (parseInt(cell.textContent) === number) {
                cell.classList.remove('marked');
            }
        });
    } else {
        // Mark
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

// ============ UTILITY FUNCTIONS ============

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
            // Find first available number in range
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

// ============ KEYBOARD SHORTCUTS ============

document.addEventListener('keydown', function(event) {
    // Space bar to draw number (in host mode)
    if (event.code === 'Space' && gameState.mode === 'host') {
        const gameActive = document.getElementById('game-active');
        if (gameActive.style.display === 'block') {
            event.preventDefault();
            drawNumber();
        }
    }
});
