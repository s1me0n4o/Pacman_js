// window console document

"use strict";

const maze = [
        "*** ************* **********",
        "*** *************    *******",
        "*** ********* ****** *******",
        "*** *********        *******",
        "    ****   ** *******       ",
        "*** **** * ** ******* ******",
        "*** **** * *    ***** ******",
        "***      *   **       ******",
        "*** ************* **********"
    ],
    ballChar = " ",
    wallChar = "*";

function createGame(pacmanSelector, mazeSelector) {
    // all variables in the start!
    var canvasPacman = document.querySelector(pacmanSelector),
        ctxPacman = canvasPacman.getContext("2d"),
        mazeCanvas = document.querySelector(mazeSelector),
        ctxMaze = mazeCanvas.getContext("2d"),
        isMouthOpen = false,
        pacman = {
            "x": 0,
            "y": 125,
            "size": 28,
            "speed": 1
        },
        balls = [],
        walls = [],
        dir = 0,
        KeyCodeToDir = {
            "37": 2,
            "38": 3,
            "39": 0,
            "40": 1
        },
        dirDeltas = [{
            "x": +1,
            "y": 0,
        }, {
            "x": 0,
            "y": +1,
        }, {
            "x": -1,
            "y": 0,
        }, {
            "x": 0,
            "y": -1,
        }],
        cols = maze[0].length,
        rows = maze.length;
    // 0 - > right;
    // 1 - > down;
    // 2 - > left;
    // 3 - > up;
    mazeCanvas.width = (cols + 1) * pacman.size;
    mazeCanvas.height = (rows + 1) * pacman.size;

    canvasPacman.width = (cols + 1) * pacman.size;
    canvasPacman.height = (rows + 1) * pacman.size;
    // var x = 150;
    var steps = 0;
    const stepsToCangeTheMouth = 15;

    // 45
    // x* Math.PI / 180
    function gLoop() {
        const offset = 5;
        ctxPacman.clearRect(pacman.x - offset, pacman.y - offset, pacman.size + offset * 2, pacman.size + offset * 2);

        drawPacman();
        steps += 1;
        if (0 === (steps % stepsToCangeTheMouth)) {
            isMouthOpen = !isMouthOpen;
        }

        balls.forEach(function(ball, index) {
            if (areCollinding(pacman, ball)) {
                ctxMaze.clearRect(ball.x, ball.y, ball.size, ball.size);
                balls.splice(index, 1);
                console.log(`Eated ball ${JSON.stringify(ball)}`);
            }
        });

        var isPacmanCollidingWithWall = false;
        var futurePosition = {
            "x": pacman.x + dirDeltas[dir].x + 1,
            "y": pacman.y + dirDeltas[dir].y + 1,
            "size": pacman.size - 2
        };

        walls.forEach(function(wall) {
            if (areCollinding(futurePosition, wall) || areCollinding(wall, futurePosition)) {
                isPacmanCollidingWithWall = true;
            }
        });

        if (!isPacmanCollidingWithWall) {
            if (updatePacmanPosition()) {
                ctxPacman.clearRect(0, 0, canvasPacman.width, canvasPacman.height);
            }
        }


        window.requestAnimationFrame(gLoop);
    }

    function positionToBounds(obj) {
        var sizes = {
            "top": obj.y,
            "left": obj.x,
            "bottom": obj.y + obj.size,
            "right": obj.x + obj.size
        };
        return sizes;
    }

    function isBetween(value, min, max) {
        return min <= value && value <= max;
    }

    function areCollinding(obj1, obj2) {
        var size1 = positionToBounds(obj1),
            size2 = positionToBounds(obj2);
        return (isBetween(size2.left, size1.left, size1.right) ||
                isBetween(size2.right, size1.left, size1.right)) &&
            (isBetween(size2.top, size1.top, size1.bottom) ||
                isBetween(size2.bottom, size1.top, size1.bottom));
    }

    function drawBall(ctx, ballToDraw) {
        ctx.fillStyle = "orange";
        ctx.beginPath();
        var x = ballToDraw.x + ballToDraw.size / 2;
        var y = ballToDraw.y + ballToDraw.size / 2;
        var size = ballToDraw.size / 2;
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();

    }

    function drawPacman() {
        var deltaRadians;
        ctxPacman.beginPath();
        ctxPacman.fillStyle = "orange";
        if (isMouthOpen) {
            var x = pacman.x + pacman.size / 2;
            var y = pacman.y + pacman.size / 2;
            var size = pacman.size / 2;
            deltaRadians = dir * Math.PI / 2;
            ctxPacman.arc(x, y, size, deltaRadians + Math.PI / 4, deltaRadians + 7 * Math.PI / 4);
            ctxPacman.lineTo(x, y);
        } else {
            drawBall(ctxPacman, pacman);
        }
        ctxPacman.fill();

    }

    function updatePacmanPosition() {
        pacman.x += dirDeltas[dir].x * pacman.speed;
        pacman.y += dirDeltas[dir].y * pacman.speed;
        // to start over if go out of the border

        if (pacman.x < 0 || pacman.x >= canvasPacman.width ||
            pacman.y < 0 || pacman.y >= canvasPacman.height) {
            pacman.x = (pacman.x + canvasPacman.width) % canvasPacman.width;
            pacman.y = (pacman.y + canvasPacman.height) % canvasPacman.height;
            return true;
        }
        return false;
    }


    document.body.addEventListener("keydown", function(ev) {
        // ev.preventDefault();
        if (!KeyCodeToDir.hasOwnProperty(ev.keyCode)) {
            console.log("wrong")
            return;
        }
        dir = KeyCodeToDir[ev.keyCode];
        console.log(dir);
    });

    function drawMaze(ctx, maze, cellSize) {
        var row,
            col,
            cell,
            obj,
            balls = [],
            walls = [],
            wallImage = document.getElementById("wallImage");

        for (row = 0; row < maze.length; row += 1) {
            for (col = 0; col < maze[row].length; col += 1) {
                cell = maze[row][col];
                if (cell === ballChar) {
                    obj = {
                        "x": col * cellSize + cellSize / 4,
                        "y": row * cellSize + cellSize / 4,
                        "size": cellSize / 2
                    };
                    balls.push(obj);

                    drawBall(ctx, obj);
                } else if (cell === wallChar) {
                    obj = {
                        "x": col * cellSize,
                        "y": row * cellSize,
                        "size": cellSize
                    };
                    ctx.drawImage(wallImage, obj.x, obj.y, cellSize, cellSize);
                    walls.push(obj);
                }
            }
        }
        return [
            balls,
            walls
        ];
    }
    return {
        "start": function() {
            [balls, walls] = drawMaze(ctxMaze, maze, pacman.size + 3);
            gLoop();
        }
    }


}