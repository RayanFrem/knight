document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const pathDisplay = document.getElementById('path');
    let knightPosition = [0, 0];
    let animationInProgress = false;

    function initializeBoard() {
        chessboard.innerHTML = '';
        pathDisplay.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.id = `square-${row}-${col}`;
                square.className = `square ${((row + col) % 2 === 0) ? 'white' : 'black'}`;
                chessboard.appendChild(square);
            }
        }
        updateKnightPosition(knightPosition[0], knightPosition[1]);
    }

    function knightMoves(start, end) {
        const moves = [[2, 1], [1, 2], [-1, -2], [-2, -1], [-2, 1], [1, -2], [-1, 2], [2, -1]];
        const queue = [[start, [start]]];
        const visited = new Set();
        visited.add(start.toString());

        while (queue.length) {
            const [position, path] = queue.shift();
            if (position[0] === end[0] && position[1] === end[1]) return path;

            moves.forEach(([dx, dy]) => {
                const nextPos = [position[0] + dx, position[1] + dy];
                if (nextPos[0] >= 0 && nextPos[0] < 8 && nextPos[1] >= 0 && nextPos[1] < 8 && !visited.has(nextPos.toString())) {
                    visited.add(nextPos.toString());
                    queue.push([nextPos, [...path, nextPos]]);
                }
            });
        }

        return [];
    }

    function updateKnightPosition(row, col) {
        document.querySelectorAll('.knight').forEach(knight => knight.classList.remove('knight'));
        const newKnightSquare = document.getElementById(`square-${row}-${col}`);
        newKnightSquare.classList.add('knight');
        knightPosition = [row, col];
    }

    function animateKnightPath(path) {
        let step = 0;
        function moveNext() {
            if (step < path.length) {
                const [row, col] = path[step];
                updateKnightPosition(row, col);
                step++;
                setTimeout(moveNext, 500);
            } else {
                animationInProgress = false; 
            }
        }
        moveNext();
    }

    chessboard.addEventListener('click', event => {
        if (animationInProgress) return; 
        const square = event.target;
        if (!square.classList.contains('square')) return;
        const [row, col] = square.id.split('-').slice(1).map(Number);
        const path = knightMoves(knightPosition, [row, col]);
        animationInProgress = true;
        updatePathDisplay(path);
        animateKnightPath(path);
    });

    function updatePathDisplay(path) {
        pathDisplay.innerHTML = '<strong>Path:</strong><br>';
        path.forEach(step => pathDisplay.innerHTML += `[${step[0]}, ${step[1]}] <br>`);
    }

    document.getElementById('reset').addEventListener('click', () => {
        knightPosition = [0, 0];
        initializeBoard();
    });

    initializeBoard();
});
