document.addEventListener('DOMContentLoaded', () => {
 // Mayan symbols (using emojis for simplicity)
            const symbols = [
                '🌽', '🐍', '🏺', '🌞',
                '🌙', '🌊', '🔱', '🏹'
            ];
            
            // Game state
            let gameState = {
                cards: [],
                flippedCards: [],
                matchedPairs: 0,
                moves: 0,
                gameStarted: false,
                timer: 0,
                timerInterval: null
            };
            
            // DOM Elements
            const gameBoard = document.getElementById('gameBoard');
            const movesDisplay = document.getElementById('moves');
            const matchesDisplay = document.getElementById('matches');
            const timerDisplay = document.getElementById('timer');
            const resetBtn = document.getElementById('resetBtn');
            const hintBtn = document.getElementById('hintBtn');
            
            // Initialize game
            initGame();
            
            function initGame() {
                // Clear game board
                gameBoard.innerHTML = '';
                gameState.cards = [];
                gameState.flippedCards = [];
                gameState.matchedPairs = 0;
                gameState.moves = 0;
                gameState.gameStarted = false;
                gameState.timer = 0;
                
                // Stop any existing timer
                if (gameState.timerInterval) {
                    clearInterval(gameState.timerInterval);
                    gameState.timerInterval = null;
                }
                
                // Update displays
                movesDisplay.textContent = gameState.moves;
                matchesDisplay.textContent = gameState.matchedPairs;
                timerDisplay.textContent = `${gameState.timer}s`;
                
                // Create card pairs
                let gameCards = [];
                symbols.forEach(symbol => {
                    gameCards.push(symbol);
                    gameCards.push(symbol);
                });
                
                // Shuffle cards
                shuffleArray(gameCards);
                
                // Create card elements
                gameCards.forEach((symbol, index) => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.dataset.index = index;
                    card.dataset.symbol = symbol;
                    
                    const cardFront = document.createElement('div');
                    cardFront.classList.add('card-front');
                    cardFront.textContent = '?';
                    
                    const cardBack = document.createElement('div');
                    cardBack.classList.add('card-back');
                    cardBack.textContent = symbol;
                    
                    card.appendChild(cardFront);
                    card.appendChild(cardBack);
                    
                    card.addEventListener('click', flipCard);
                    gameBoard.appendChild(card);
                    
                    // Store card reference
                    gameState.cards.push({
                        element: card,
                        symbol: symbol,
                        matched: false
                    });
                });
            }
            
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }
            
            function flipCard() {
                const cardIndex = parseInt(this.dataset.index);
                const card = gameState.cards[cardIndex];
                
                // Don't allow flipping if already matched or already flipped
                if (card.matched || this.classList.contains('flipped') || 
                    gameState.flippedCards.length >= 2) {
                    return;
                }
                
                // Start timer on first move
                if (!gameState.gameStarted) {
                    startTimer();
                    gameState.gameStarted = true;
                }
                
                // Flip card
                this.classList.add('flipped');
                gameState.flippedCards.push(card);
                
                // Check for match when two cards are flipped
                if (gameState.flippedCards.length === 2) {
                    gameState.moves++;
                    movesDisplay.textContent = gameState.moves;
                    
                    const card1 = gameState.flippedCards[0];
                    const card2 = gameState.flippedCards[1];
                    
                    if (card1.symbol === card2.symbol) {
                        // Match found
                        card1.matched = true;
                        card2.matched = true;
                        gameState.matchedPairs++;
                        matchesDisplay.textContent = gameState.matchedPairs;
                        
                        // Clear flipped cards
                        gameState.flippedCards = [];
                        
                        // Check for win
                        if (gameState.matchedPairs === symbols.length) {
                            endGame();
                        }
                    } else {
                        // No match, flip back after delay
                        setTimeout(() => {
                            card1.element.classList.remove('flipped');
                            card2.element.classList.remove('flipped');
                            gameState.flippedCards = [];
                        }, 1000);
                    }
                }
            }
            
            function startTimer() {
                gameState.timerInterval = setInterval(() => {
                    gameState.timer++;
                    timerDisplay.textContent = `${gameState.timer}s`;
                }, 1000);
            }
            
            function endGame() {
                clearInterval(gameState.timerInterval);
                
                setTimeout(() => {
                    alert(`Congratulations! You've matched all pairs in ${gameState.moves} moves and ${gameState.timer} seconds!`);
                }, 500);
            }
            
            function showHint() {
                // Find all unmatched cards
                const unmatchedCards = gameState.cards.filter(card => !card.matched && !card.element.classList.contains('flipped'));
                
                if (unmatchedCards.length === 0) return;
                
                // Randomly select a card to show briefly
                const randomIndex = Math.floor(Math.random() * unmatchedCards.length);
                const card = unmatchedCards[randomIndex];
                
                card.element.classList.add('flipped');
                
                setTimeout(() => {
                    card.element.classList.remove('flipped');
                }, 1000);
            }
            
            // Event listeners
            resetBtn.addEventListener('click', initGame);
            hintBtn.addEventListener('click', showHint);
        });