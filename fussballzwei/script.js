document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('spielCanvas');
    const ctx = canvas.getContext('2d');
    
    const playersBlue = [];
    const playersYellow = [];
    const numPlayers = 11;
    const playerRadius = 20; // Durchmesser ungefähr 4 cm
    const ballRadius = 15; // Durchmesser ungefähr 3 cm
    let ballX = canvas.width / 2; // Horizontal zentriert
    let ballY = canvas.height / 2; // Vertikal zentriert
    let ballSpeedX = 0;
    let ballSpeedY = 0;
    
    // Erstelle orangeSpieler
    for (let i = 0; i < numPlayers; i++) {
        playersBlue.push({
            id: i + 1, // Spieler-ID
            x: (canvas.width / (numPlayers + 1)) * (i + 1), // Gleichmäßig über die Breite verteilen
            y: canvas.height / 4, // Vertikal zentriert oben
            radius: playerRadius,
            color: 'orange',
            dx: 0,
            dy: 0
        });
    }
    
    // Erstelle gelbe Spieler
    for (let i = 0; i < numPlayers; i++) {
        playersYellow.push({
            id: i + 1, // Spieler-ID
            x: (canvas.width / (numPlayers + 1)) * (i + 1), // Gleichmäßig über die Breite verteilen
            y: canvas.height * (3 / 4), // Vertikal zentriert unten
            radius: playerRadius,
            color: 'yellow',
            dx: 0,
            dy: 0
        });
    }
    
    const goalWidth = 100; // Breite des Tores
    const goalHeight = 50; // Höhe des Tores
    
    let activePlayerIdBlue = 1; // ID des aktiven blauen Spielers
    let activePlayerIdYellow = 1; // ID des aktiven gelben Spielers
    
    function drawPlayers() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Blaue Spieler zeichnen
        playersBlue.forEach(function(player) {
            drawPlayer(player);
        });
        
        // Gelbe Spieler zeichnen
        playersYellow.forEach(function(player) {
            drawPlayer(player);
        });
        
        // Ball zeichnen
        drawBall();
    }
    
    function drawPlayer(player) {
        // Gesicht
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.closePath();
        // Augen
        const eyeRadius = 5;
        ctx.beginPath();
        ctx.arc(player.x - 8, player.y - 5, eyeRadius, 0, Math.PI * 2);
        ctx.arc(player.x + 8, player.y - 5, eyeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
        // Mund
        ctx.beginPath();
        ctx.arc(player.x, player.y + 5, 10, 0, Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        // Nase
        ctx.beginPath();
        ctx.moveTo(player.x, player.y - 2);
        ctx.lineTo(player.x + 2, player.y + 2);
        ctx.lineTo(player.x - 2, player.y + 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
        // Nummerierung
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(player.id, player.x, player.y + player.radius + 14);
    }
    
    function drawBall() {
        // Ball zeichnen
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
    
    function drawGoals() {
        // Oben
        ctx.fillStyle = 'white';
        ctx.fillRect((canvas.width - goalWidth) / 2, 0, goalWidth, goalHeight);
        // Unten
        ctx.fillRect((canvas.width - goalWidth) / 2, canvas.height - goalHeight, goalWidth, goalHeight);
    }
    
    function updatePlayerPosition() {
        const activePlayerBlue = playersBlue.find(player => player.id === activePlayerIdBlue);
        const activePlayerYellow = playersYellow.find(player => player.id === activePlayerIdYellow);
        
        if (activePlayerBlue) {
            activePlayerBlue.x += activePlayerBlue.dx;
            activePlayerBlue.y += activePlayerBlue.dy;
        }
        
        if (activePlayerYellow) {
            activePlayerYellow.x += activePlayerYellow.dx;
            activePlayerYellow.y += activePlayerYellow.dy;
        }
        
        // Begrenze den Spieler innerhalb des Canvas
        playersBlue.concat(playersYellow).forEach(player => {
            if (player.x < player.radius) {
                player.x = player.radius;
            }
            if (player.x > canvas.width - player.radius) {
                player.x = canvas.width - player.radius;
            }
            if (player.y < player.radius) {
                player.y = player.radius;
            }
            if (player.y > canvas.height - player.radius) {
                player.y = canvas.height - player.radius;
            }
        });
    }
    
    function updateBallPosition() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        // Kollision mit den Seitenwänden
        if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
            ballSpeedX = -ballSpeedX;
        }
        // Kollision mit den oberen und unteren Wänden
        if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
    }
    
    function updateCanvas() {
        drawPlayers();
        drawGoals();
        updatePlayerPosition();
        updateBallPosition();
        requestAnimationFrame(updateCanvas); // Kontinuierlich aktualisieren
    }
    
    // Event Listener für Tastatureingaben
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'ArrowUp':
                movePlayer('up');
                break;
            case 'ArrowDown':
                movePlayer('down');
                break;
            case 'ArrowLeft':
                movePlayer('left');
                break;
            case 'ArrowRight':
                movePlayer('right');
                break;
        }
    });
    
    function movePlayer(direction) {
        let activePlayer;
        if (activePlayerIdBlue) {
            activePlayer = playersBlue.find(player => player.id === activePlayerIdBlue);
        } else {
            activePlayer = playersYellow.find(player => player.id === activePlayerIdYellow);
        }
        
        if (!activePlayer) return;
        
        switch (direction) {
            case 'up':
                activePlayer.dy = -2;
                break;
            case 'down':
                activePlayer.dy = 2;
                break;
            case 'left':
                activePlayer.dx = -2;
                break;
            case 'right':
                activePlayer.dx = 2;
                break;
        }
    }
    
    document.addEventListener('keyup', function(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                stopPlayer('vertical');
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                stopPlayer('horizontal');
                break;
        }
    });
    
    function stopPlayer(direction) {
        let activePlayer;
        if (activePlayerIdBlue) {
            activePlayer = playersBlue.find(player => player.id === activePlayerIdBlue);
        } else {
            activePlayer = playersYellow.find(player => player.id === activePlayerIdYellow);
        }
        
        if (!activePlayer) return;
        
        if (direction === 'vertical') {
            activePlayer.dy = 0;
        } else if (direction === 'horizontal') {
            activePlayer.dx = 0;
        }
    }
    
    // Event Listener für Klickereignisse auf Spieler
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Finde den orangen Spieler, der geklickt wurde
        const clickedPlayerBlue = playersBlue.find(player => {
            return Math.sqrt((mouseX - player.x) ** 2 + (mouseY - player.y) ** 2) <= player.radius;
        });
        if (clickedPlayerBlue) {
            activePlayerIdBlue = clickedPlayerBlue.id;
            activePlayerIdYellow = null;
        }
        
        // Finde den gelben Spieler, der geklickt wurde
        const clickedPlayerYellow = playersYellow.find(player => {
            return Math.sqrt((mouseX - player.x) ** 2 + (mouseY - player.y) ** 2) <= player.radius;
        });
        if (clickedPlayerYellow) {
            activePlayerIdYellow = clickedPlayerYellow.id;
            activePlayerIdBlue = null;
        }
        
        // Kollision mit dem Ball
        if (Math.sqrt((mouseX - ballX) ** 2 + (mouseY - ballY) ** 2) <= ballRadius) {
            ballSpeedX = Math.random() < 0.5 ? -1 : 1;
            ballSpeedY = Math.random() < 0.5 ? -1 : 1;
        }
    });
    
    // Canvas initialisieren
    updateCanvas();
});

