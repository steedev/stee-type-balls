/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/App.ts":
/*!********************!*\
  !*** ./src/App.ts ***!
  \********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Square__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Square */ "./src/Square.ts");
/* harmony import */ var _Ball__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Ball */ "./src/Ball.ts");


var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        // Create grid binary array
        this.createGrid = function (gridSize) {
            for (var i = 0; i < gridSize; i++) {
                var rowLine = [];
                for (var j = 0; j < gridSize; j++) {
                    rowLine.push(0);
                }
                _this.grid.push(rowLine);
            }
        };
        // Create game table
        this.createGameTable = function () {
            for (var i = 0; i < _this.grid.length; i++) {
                var rowSquare = [];
                var rowCells = [];
                var _loop_1 = function (j) {
                    var square = new _Square__WEBPACK_IMPORTED_MODULE_0__.default(i, j);
                    rowSquare.push(square);
                    rowCells.push(i + "x" + j);
                    // Append all squares to table <HTMLElement>
                    var squareElement = document.getElementById('table');
                    squareElement.appendChild(square.createSquare());
                    // Events
                    square.dv.onclick = function () { return _this.handleSquareClick(square); };
                    square.dv.onmouseenter = function () { return _this.handleSquareEnter(square); };
                    square.dv.onmouseout = function () { return _this.handleSquareOut(square); };
                };
                for (var j = 0; j < _this.grid[i].length; j++) {
                    _loop_1(j);
                }
                _this.squaresTab.push(rowSquare);
                _this.cells.push(rowCells);
            }
        };
        // Create table for balls colors
        this.createColorTable = function () {
            _this.colorsTab = [];
            for (var i = 0; i < _this.grid.length; i++) {
                var rowLine = [];
                for (var j = 0; j < _this.grid[i].length; j++) {
                    rowLine.push('');
                }
                _this.colorsTab.push(rowLine);
            }
            _this.ballsTab.map(function (ball) {
                // Push all colors balls from table to this.colorsTab
                _this.colorsTab[ball.position.y][ball.position.x] = ball.color;
            });
            // console.log(this.colorsTab)
        };
        // Create 3 balls system
        this.createBalls = function () {
            var ballsTab = [];
            for (var i = 0; i < 3; i++) {
                var color = _this.randomColorBall();
                var newBall = new _Ball__WEBPACK_IMPORTED_MODULE_1__.default(color);
                ballsTab.push(newBall);
            }
            // console.log(ballsTab)
            return ballsTab;
        };
        // Create all balls system for Nav display
        this.createAllBalls = function () {
            var allBallsTab = [];
            _this.colors.map(function (color) {
                var newBall = new _Ball__WEBPACK_IMPORTED_MODULE_1__.default(color);
                allBallsTab.push(newBall);
            });
            return allBallsTab;
        };
        // Random color subsystem
        this.randomColorBall = function () { return _this.colors[Math.floor(Math.random() * _this.colors.length)]; };
        this.randomHexColor = function () {
            for (var i = 0; i < 7; i++) {
                var color = '#000000'.replace(/0/g, function () {
                    return (~~(Math.random() * 16)).toString(16);
                });
                _this.colors.push(color);
            }
        };
        this.randomPosition = function () {
            var q = false;
            var y = 0;
            var x = 0;
            while (!q) {
                y = Math.floor(Math.random() * _this.grid.length);
                x = Math.floor(Math.random() * _this.grid[y].length);
                var actualSquare = _this.squaresTab[y][x];
                if (actualSquare.empty == true) {
                    actualSquare.empty = false;
                    _this.grid[y][x] = 1;
                    q = true;
                }
            }
            return { y: y, x: x };
        };
        this.handleBallClick = function (currentBall) {
            if (!_this.pause && _this.checkLocalNeighbors(currentBall)) {
                // Dv properties because it's Ball instance Class
                if (_this.highlight != null)
                    _this.highlight.dv.classList.remove('highlight');
                if (_this.highlight != currentBall) {
                    _this.highlight = currentBall;
                    _this.highlight.dv.classList.add('highlight');
                }
                else
                    _this.highlight = null;
            }
        };
        this.checkLocalNeighbors = function (currentBall) {
            var returned = false;
            var y = currentBall.position.y;
            var x = currentBall.position.x;
            // All false => can't turn
            if (_this.handleEmptyChecker(y - 1, x))
                returned = true;
            if (_this.handleEmptyChecker(y, x + 1))
                returned = true;
            if (_this.handleEmptyChecker(y + 1, x))
                returned = true;
            if (_this.handleEmptyChecker(y, x - 1))
                returned = true;
            return returned;
        };
        this.handleEmptyChecker = function (y, x) {
            try {
                if (_this.grid[y][x] == 0)
                    return true;
                else
                    return false;
            }
            catch (_a) {
                return false;
            }
        };
        this.handleSquareClick = function (currentSquare) {
            // If it's a normal square
            if (currentSquare.empty && _this.highlight != null && _this.canMove) {
                var yH = _this.highlight.position.y;
                var xH = _this.highlight.position.x;
                // Unlight highlighted Ball
                _this.squaresTab[yH][xH].empty = true;
                _this.grid[yH][xH] = 0;
                _this.highlight.dv.classList.remove('highlight');
                _this.highlight.newPosition({ y: currentSquare.y, x: currentSquare.x });
                // NEW POSITION...
                var y = currentSquare.y;
                var x = currentSquare.x;
                _this.grid[y][x] = 1;
                _this.squaresTab[y][x].empty = false;
                _this.squaresTab[y][x].createBall(_this.highlight.dv);
                // Create colors table
                _this.createColorTable();
                var isDeleted = _this.handleCheckDeleted(_this.highlight);
                // Unlink highlighted ball => Func IF scope
                _this.highlight = null;
                _this.pause = true;
                var gameOver = _this.handleCheckEnd();
                if (gameOver != 2) {
                    // Reset Path after TimeOut
                    _this.handleResetPathTimeOut();
                    _this.handleResetPath();
                    _this.pause = false;
                    if (!isDeleted) {
                        // Create balls from Queue on table
                        _this.ballsToTable(_this.ballsQueue);
                        _this.ballsQueue.map(function (ball) {
                            _this.colorsTab[ball.position.y][ball.position.x] = ball.color;
                        });
                        _this.ballsQueue.map(function (ball) {
                            _this.handleCheckDeleted(ball);
                        });
                        //
                        // Create next 3 ball and add to Queue
                        _this.ballsToQueue(_this.createBalls());
                        // Checking gameOver
                        if (gameOver == 1)
                            gameOver = _this.handleCheckEnd();
                        if (gameOver == 2)
                            _this.showScoreGame();
                    }
                }
                else {
                    // console.log('END')
                    _this.showScoreGame();
                }
                // console.log(this.cells)
                // console.log({ y, x })
                // console.table(this.grid)
                // console.log(this.squaresTab)
            }
        };
        this.handleCheckDeleted = function (checkingBall) {
            var ballsToDeleteTab = [];
            // Check DIAGNOALLY [ FROM LEFT TO RIGHT DOWN ]
            ballsToDeleteTab.push(_this.handleCheckDirection(-1, -1, checkingBall));
            // Check UP DOWN
            ballsToDeleteTab.push(_this.handleCheckDirection(-1, 0, checkingBall));
            // Check DIAGNOALLY [ FROM LEFT TO RIGHT UP ]
            ballsToDeleteTab.push(_this.handleCheckDirection(-1, 1, checkingBall));
            // Check LEFT RIGHT
            ballsToDeleteTab.push(_this.handleCheckDirection(0, -1, checkingBall));
            var deleteHighlighted = false;
            ballsToDeleteTab.forEach(function (tab) {
                if (tab.length >= 4) {
                    deleteHighlighted = true;
                    tab.forEach(function (ball) {
                        ball.remove = true;
                    });
                }
            });
            // Cehck if delete for
            if (deleteHighlighted) {
                checkingBall.remove = true;
                // Clear grid
                _this.ballsTab.forEach(function (ball) {
                    if (ball.remove) {
                        _this.grid[ball.position.y][ball.position.x] = 0;
                        _this.squaresTab[ball.position.y][ball.position.x].clearSquare();
                    }
                });
                for (var i = _this.ballsTab.length - 1; i >= 0; i--) {
                    if (_this.ballsTab[i].remove) {
                        _this.ballsTab.splice(i, 1);
                        _this.points++;
                    }
                }
                document.getElementById("points").innerText = "Points: " + _this.points;
                return true;
            }
            else
                return false;
        };
        this.handleCheckDirection = function (posYChange, posXChange, checkingBall) {
            var colorCheck = _this.colorsTab[checkingBall.position.y][checkingBall.position.x];
            var go = true;
            var y = checkingBall.position.y;
            var x = checkingBall.position.x;
            var ballsToDelete = [];
            while (go) {
                y += posYChange;
                x += posXChange;
                try {
                    if (_this.colorsTab[y][x] != colorCheck)
                        go = false;
                    else {
                        _this.ballsTab.forEach(function (ball) {
                            if (ball.position.y == y && ball.position.x == x)
                                ballsToDelete.push(ball);
                        });
                    }
                }
                catch (err) {
                    // console.log(err)
                    go = false;
                }
            }
            go = true;
            y = checkingBall.position.y;
            x = checkingBall.position.x;
            while (go) {
                y -= posYChange;
                x -= posXChange;
                try {
                    if (_this.colorsTab[y][x] != colorCheck)
                        go = false;
                    else {
                        _this.ballsTab.forEach(function (ball) {
                            if (ball.position.y == y && ball.position.x == x)
                                ballsToDelete.push(ball);
                        });
                    }
                }
                catch (err) {
                    // console.log(err)
                    go = false;
                }
            }
            // console.log(ballsToDelete)
            return ballsToDelete;
        };
        // Checking empty Squares
        this.handleCheckEnd = function () {
            var over = 0;
            var count = 0;
            _this.squaresTab.map(function (row) {
                row.map(function (square) {
                    if (square.empty)
                        count++;
                });
            });
            if (count == 3)
                over = 1;
            else if (count < 3)
                over = 2;
            return over;
        };
        // GameOver Score to Firestore and display best games
        this.showScoreGame = function () {
            document.getElementById('game').remove();
            document.getElementById('showScore').style.display = 'flex';
            document.getElementById('showScore').innerText = "Firebase Scores: " + _this.points;
        };
        this.handleSquareEnter = function (currentSquare) {
            if (currentSquare.empty && _this.highlight != null) {
                _this.fastFinder(currentSquare.y, currentSquare.x);
            }
        };
        this.handleSquareOut = function (currentSquare) {
            if (currentSquare.empty && _this.highlight != null) {
                _this.handleResetPath();
            }
        };
        this.handleResetPath = function () {
            _this.path.map(function (path) {
                document.getElementById(path).classList.remove('finder');
                document.getElementById(path).classList.remove('wrongFinder');
            });
        };
        this.handleResetPathTimeOut = function () {
            _this.handleResetPath();
            _this.colorPath('correctFinder');
            setTimeout(function () {
                _this.path.map(function (path) {
                    document.getElementById(path).classList.remove('correctFinder');
                });
            }, 400);
        };
        this.fastFinder = function (row, col) {
            var startPos = { row: _this.highlight.position.y, col: _this.highlight.position.x };
            var queue = [];
            var parentForCell = { key: '', cell: '' };
            // parentForCell[startPos] = { key: startPos, cell: undefined }
            queue.push(startPos);
            while (queue.length > 0) {
                var _a = queue.shift(), row_1 = _a.row, col_1 = _a.col;
                var currentPos = row_1 + "x" + col_1;
                var currentCell = _this.cells[row_1][col_1];
                var neightbors = [
                    { row: row_1 - 1, col: col_1 },
                    { row: row_1, col: col_1 + 1 },
                    { row: row_1 + 1, col: col_1 },
                    { row: row_1, col: col_1 - 1 }
                ];
                for (var i = 0; i < neightbors.length; i++) {
                    var nRow = neightbors[i].row;
                    var nCol = neightbors[i].col;
                    if (nRow < 0 || nRow > _this.cells.length - 1) {
                        continue;
                    }
                    if (nCol < 0 || nCol > _this.cells[nRow].length - 1) {
                        continue;
                    }
                    if (_this.grid[nRow][nCol] === 1) {
                        continue;
                    }
                    var key = nRow + "x" + nCol;
                    if (key in parentForCell || key === startPos.row + "x" + startPos.col) {
                        continue;
                    }
                    parentForCell[key] = { key: currentPos, cell: currentCell };
                    queue.push(neightbors[i]);
                }
                // console.log(neightbors)
                // console.log({ currentPos, currentCell })
            }
            // console.log(parentForCell)
            _this.path = [];
            var current = row + "x" + col;
            // console.log(current)
            _this.path.push(current);
            while (current !== startPos.row + "x" + startPos.col) {
                var cell = parentForCell[current];
                // Key not from normal Table
                if (cell !== undefined) {
                    _this.canMove = true;
                    _this.path.push(cell.key);
                    current = cell.key;
                }
                else {
                    // Stupid mistake makes nice system :)
                    _this.handleResetPath();
                    _this.colorPath('wrongFinder');
                    console.log('ehh, wrong way..');
                    // console.log(this.path)
                    _this.canMove = false;
                    break; // with this break
                }
            }
            _this.colorPath('finder');
        };
        this.colorPath = function (color) {
            for (var i = 0; i < _this.path.length; i++) {
                document.getElementById(_this.path[i]).classList.add(color);
            }
        };
        this.grid = [];
        this.squaresTab = [];
        this.ballsTab = [];
        this.colors = [];
        this.ballsQueue = [];
        this.highlight = null;
        this.cells = [];
        this.path = [];
        this.canMove = true;
        this.colorsTab = [];
        this.pause = false;
        this.points = 0;
        // Create grid
        this.createGrid(9);
        // Create game table
        this.createGameTable();
        // Random Hex colors for Balls
        this.randomHexColor();
        // Rendering balls and queue
        this.ballsToTable(this.createBalls());
        this.ballsToQueue(this.createBalls());
        // Display all actuals colors
        this.displayAllColors(this.createAllBalls());
        // Logs...
        // console.log(this.grid)
        // console.log(this.squaresTab)
        // console.log(this.colors)
    }
    // Balls on table
    Game.prototype.ballsToTable = function (balls) {
        var _this = this;
        balls.forEach(function (ball) {
            var position = _this.randomPosition();
            ball.newPosition(position);
            _this.ballsTab.push(ball);
            _this.squaresTab[ball.position.y][ball.position.x].createBall(ball.createBall());
            ball.dv.onclick = function () { return _this.handleBallClick(ball); };
        });
    };
    Game.prototype.ballsToQueue = function (balls) {
        this.ballsQueue = balls;
        var queue = document.getElementById('queue');
        queue.innerHTML = '';
        balls.map(function (ball) { return queue.appendChild(ball.createBall()); });
    };
    Game.prototype.displayAllColors = function (balls) {
        var displayColors = document.getElementById('allColors');
        displayColors.innerHTML = '';
        balls.map(function (ball) { return displayColors.appendChild(ball.createBall()); });
    };
    return Game;
}());
new Game();


/***/ }),

/***/ "./src/Ball.ts":
/*!*********************!*\
  !*** ./src/Ball.ts ***!
  \*********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
var Ball = /** @class */ (function () {
    function Ball(color) {
        var _this = this;
        this.createBall = function () {
            var dv = document.createElement('div');
            dv.className = 'ball';
            dv.style.background = _this.color;
            _this.dv = dv;
            return dv;
        };
        this.newPosition = function (position) {
            _this.position = position;
        };
        this.position = null;
        this.color = color;
        this.remove = false;
        this.dv = null;
    }
    return Ball;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ball);


/***/ }),

/***/ "./src/Square.ts":
/*!***********************!*\
  !*** ./src/Square.ts ***!
  \***********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
var Square = /** @class */ (function () {
    function Square(y, x) {
        var _this = this;
        this.createSquare = function () {
            var dv = document.createElement('div');
            dv.className = 'square';
            dv.id = _this.y + "x" + _this.x;
            dv.style.left = _this.x * 62 + "px";
            dv.style.top = _this.y * 62 + "px";
            _this.dv = dv;
            return dv;
        };
        this.createBall = function (ball) {
            _this.dv.appendChild(ball);
        };
        this.clearSquare = function () {
            _this.dv.innerText = '';
            _this.empty = true;
        };
        this.y = y;
        this.x = x;
        this.empty = true;
        this.dv = null;
    }
    return Square;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Square);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/App.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=game.bundle.js.map