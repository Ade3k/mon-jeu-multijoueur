// Lancer le serveur sur le port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// Vérifier la victoire
function checkWin(board) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
        [0, 4, 8], [2, 4, 6],            // Diagonales
    ];

    return winConditions.some(condition => 
        board[condition[0]] !== '' &&
        board[condition[0]] === board[condition[1]] &&
        board[condition[1]] === board[condition[2]]
    );
}

// Vérifier le match nul
function checkDraw(board) {
    return board.every(cell => cell !== '');
}