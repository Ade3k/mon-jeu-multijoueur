const socket = io(); // Initialisation de la connexion Socket.io

const cells = document.querySelectorAll('.cell');
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let currentPlayerSymbol = ''; // 'X' pour le joueur 1, 'O' pour le joueur 2
let currentPlayerIndex = 0; // 0 pour le joueur 1, 1 pour le joueur 2
let currentRoom = ''; // Assurez-vous de définir currentRoom lors de la connexion au salon

// Réception des messages du serveur
socket.on('message', (data) => {
    switch (data.type) {
        case 'gameStart':
            board = data.board;
            updateBoard(board);
            break;

        case 'yourTurn':
            document.getElementById('message').textContent = 'C\'est ton tour!';
            updateBoard(data.board);
            break;

        case 'boardUpdate':
            updateBoard(data.board);
            break;

        case 'win':
            document.getElementById('message').textContent = 'Vous avez gagné!';
            updateBoard(data.board);
            isGameActive = false;
            break;

        case 'draw':
            document.getElementById('message').textContent = 'Match nul!';
            updateBoard(data.board);
            isGameActive = false;
            break;

        default:
            console.log('Message non géré:', data);
    }
});

// Écoute de l'événement startGame pour afficher l'avatar et le nom de l'adversaire
socket.on('startGame', ({ player1, player2 }) => {
    // Afficher les informations des joueurs
    const opponent = (player1.id === socket.id) ? player2 : player1;

    document.getElementById('opponentAvatar').src = opponent.avatar;
    document.getElementById('opponentAvatar').style.display = 'block'; // Afficher l'avatar
    document.getElementById('opponentUsername').textContent = `Adversaire : ${opponent.username}`;

    // Déterminer qui commence
    currentPlayerIndex = player1.id === socket.id ? 0 : 1;
    currentPlayerSymbol = currentPlayerIndex === 0 ? 'X' : 'O';
    document.getElementById('message').textContent = `C'est à ${player1.username} de jouer!`;
});

// Fonction pour mettre à jour le plateau de jeu
function updateBoard(currentBoard) {
    cells.forEach((cell, index) => {
        cell.textContent = currentBoard[index];
        if (!cell.textContent) {
            cell.addEventListener('click', () => handleCellClick(index), { once: true });
        }
    });
}

// Fonction pour gérer le clic sur une cellule
function handleCellClick(index) {
    if (!isGameActive || board[index] !== '') return;

    // Émettre le mouvement et l'index choisi
    socket.emit('move', { index, room: currentRoom }); // currentRoom doit être défini lors de la connexion au salon

    board[index] = currentPlayerSymbol;
    updateBoard(board);
    
    // Passer le tour au joueur suivant
    currentPlayerIndex = (currentPlayerIndex + 1) % 2; 
    document.getElementById('message').textContent = currentPlayerIndex === 0 ? 'C\'est à joueur 1 de jouer!' : 'C\'est à joueur 2 de jouer!';
}

// Écoute de l'événement pour le redémarrage du jeu
document.getElementById('restartButton').addEventListener('click', () => {
    socket.emit('restart');
    isGameActive = true;
});
