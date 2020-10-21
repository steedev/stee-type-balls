import Square from './Square'
import Ball from './Ball'
import { Parent, PatternRowCol, IGame } from './Interfaces'


class Game implements IGame {
    public grid: number[][]
    public squaresTab: Square[][]
    public ballsTab: Ball[]
    public colors: string[]
    public ballsQueue: Ball[]
    public highlight: Ball
    readonly cells: any[]
    public path: any[]
    public canMove: boolean
    public colorsTab: string[][]
    public pause: boolean
    public points: number

    constructor() {
        this.grid = []
        this.squaresTab = []
        this.ballsTab = []
        this.colors = []
        this.ballsQueue = []
        this.highlight = null
        this.cells = []
        this.path = []
        this.canMove = true
        this.colorsTab = []
        this.pause = false
        this.points = 0

        // Create grid
        this.createGrid(9)

        // Create game table
        this.createGameTable()

        // Random Hex colors for Balls
        this.randomHexColor()

        // Rendering balls and queue
        this.ballsToTable(this.createBalls())
        this.ballsToQueue(this.createBalls())

        // Display all actuals colors
        this.displayAllColors(this.createAllBalls())



        // Logs...
        // console.log(this.grid)
        // console.log(this.squaresTab)
        // console.log(this.colors)
    }

    // Create grid binary array
    private createGrid = (gridSize: number) => {
        for (let i = 0; i < gridSize; i++) {
            let rowLine = []
            for (let j = 0; j < gridSize; j++) {
                rowLine.push(0)
            }
            this.grid.push(rowLine)
        }
    }

    // Create game table
    private createGameTable = () => {
        for (let i = 0; i < this.grid.length; i++) {
            const rowSquare: Square[] = []
            const rowCells: any[] = []

            for (let j = 0; j < this.grid[i].length; j++) {
                let square = new Square(i, j)
                rowSquare.push(square)
                rowCells.push(`${i}x${j}`)

                // Append all squares to table <HTMLElement>
                let squareElement = <HTMLElement>document.getElementById('table')
                squareElement.appendChild(square.createSquare())

                // Events
                square.dv.onclick = () => this.handleSquareClick(square)
                square.dv.onmouseenter = () => this.handleSquareEnter(square)
                square.dv.onmouseout = () => this.handleSquareOut(square)
            }
            this.squaresTab.push(rowSquare)
            this.cells.push(rowCells)
        }
    }

    // Create table for balls colors
    private createColorTable = () => {

        this.colorsTab = []

        for (let i = 0; i < this.grid.length; i++) {
            const rowLine: string[] = []

            for (let j = 0; j < this.grid[i].length; j++) {
                rowLine.push('')
            }
            this.colorsTab.push(rowLine)
        }

        this.ballsTab.map(ball => {

            // Push all colors balls from table to this.colorsTab
            this.colorsTab[ball.position.y][ball.position.x] = ball.color
        })

        // console.log(this.colorsTab)
    }

    // Create 3 balls system
    private createBalls = () => {
        let ballsTab: Ball[] = []
        for (let i = 0; i < 3; i++) {
            let color: string = this.randomColorBall()
            let newBall: Ball = new Ball(color)
            ballsTab.push(newBall)
        }
        // console.log(ballsTab)
        return ballsTab
    }

    // Create all balls system for Nav display
    private createAllBalls = () => {
        let allBallsTab: Ball[] = []
        this.colors.map(color => {
            let newBall: Ball = new Ball(color)
            allBallsTab.push(newBall)
        })
        return allBallsTab
    }

    // Random color subsystem
    private randomColorBall = () => this.colors[Math.floor(Math.random() * this.colors.length)]

    private randomHexColor = () => {
        for (let i = 0; i < 7; i++) {
            let color = '#000000'.replace(/0/g, () => {
                return (~~(Math.random() * 16)).toString(16)
            })
            this.colors.push(color)
        }

    }

    // Balls on table
    private ballsToTable(balls: Ball[]) {
        balls.forEach(ball => {
            let position: any = this.randomPosition()
            ball.newPosition(position)

            this.ballsTab.push(ball)
            this.squaresTab[ball.position.y][ball.position.x].createBall(ball.createBall())
            ball.dv.onclick = () => this.handleBallClick(ball)
        })
    }


    private ballsToQueue(balls: Ball[]) {
        this.ballsQueue = balls
        let queue = <HTMLElement>document.getElementById('queue')

        queue.innerHTML = ''
        balls.map(ball => queue.appendChild(ball.createBall()))
    }


    private displayAllColors(balls: Ball[]) {
        let displayColors = <HTMLElement>document.getElementById('allColors')
        displayColors.innerHTML = ''

        balls.map(ball => displayColors.appendChild(ball.createBall()))
    }


    private randomPosition = () => {
        let q = false
        let y: number = 0
        let x: number = 0

        while (!q) {
            y = Math.floor(Math.random() * this.grid.length)
            x = Math.floor(Math.random() * this.grid[y].length)

            const actualSquare = this.squaresTab[y][x]

            if (actualSquare.empty == true) {
                actualSquare.empty = false
                this.grid[y][x] = 1
                q = true
            }
        }
        return { y, x }
    }

    private handleBallClick = (currentBall: Ball) => {
        if (!this.pause && this.checkLocalNeighbors(currentBall)) {

            // Dv properties because it's Ball instance Class
            if (this.highlight != null) this.highlight.dv.classList.remove('highlight')
            if (this.highlight != currentBall) {
                this.highlight = currentBall
                this.highlight.dv.classList.add('highlight')
            } else this.highlight = null
        }
    }

    private checkLocalNeighbors = (currentBall: Ball) => {
        let returned: boolean = false

        const y = currentBall.position.y
        const x = currentBall.position.x



        // All false => can't turn
        if (this.handleEmptyChecker(y - 1, x)) returned = true
        if (this.handleEmptyChecker(y, x + 1)) returned = true
        if (this.handleEmptyChecker(y + 1, x)) returned = true
        if (this.handleEmptyChecker(y, x - 1)) returned = true


        return returned

    }

    private handleEmptyChecker = (y: number, x: number) => {
        try {
            if (this.grid[y][x] == 0)
                return true; else return false
        }
        catch { return false }
    }


    private handleSquareClick = (currentSquare: Square) => {

        // If it's a normal square
        if (currentSquare.empty && this.highlight != null && this.canMove) {

            let yH: number = this.highlight.position.y
            let xH: number = this.highlight.position.x

            // Unlight highlighted Ball
            this.squaresTab[yH][xH].empty = true
            this.grid[yH][xH] = 0
            this.highlight.dv.classList.remove('highlight')
            this.highlight.newPosition({ y: currentSquare.y, x: currentSquare.x })


            // NEW POSITION...
            let y: number = currentSquare.y
            let x: number = currentSquare.x

            this.grid[y][x] = 1
            this.squaresTab[y][x].empty = false
            this.squaresTab[y][x].createBall(this.highlight.dv)


            // Create colors table
            this.createColorTable()

            let isDeleted: boolean = this.handleCheckDeleted(this.highlight)


            // Unlink highlighted ball => Func IF scope
            this.highlight = null

            this.pause = true


            let gameOver: number = this.handleCheckEnd()

            if (gameOver != 2) {


                // Reset Path after TimeOut
                this.handleResetPathTimeOut()
                this.handleResetPath()

                this.pause = false
                if (!isDeleted) {

                    // Create balls from Queue on table
                    this.ballsToTable(this.ballsQueue)

                    this.ballsQueue.map(ball => {
                        this.colorsTab[ball.position.y][ball.position.x] = ball.color
                    })

                    this.ballsQueue.map(ball => {
                        this.handleCheckDeleted(ball)
                    })


                    //


                    // Create next 3 ball and add to Queue
                    this.ballsToQueue(this.createBalls())

                    // Checking gameOver
                    if (gameOver == 1) gameOver = this.handleCheckEnd()
                    if (gameOver == 2) this.showScoreGame()


                }
            } else {
                // console.log('END')
                this.showScoreGame()
            }




            // console.log(this.cells)
            // console.log({ y, x })
            // console.table(this.grid)
            // console.log(this.squaresTab)



        }
    }

    private handleCheckDeleted = (checkingBall: Ball) => {
        const ballsToDeleteTab: Ball[][] = []

        // Check DIAGNOALLY [ FROM LEFT TO RIGHT DOWN ]
        ballsToDeleteTab.push(this.handleCheckDirection(-1, -1, checkingBall))

        // Check UP DOWN
        ballsToDeleteTab.push(this.handleCheckDirection(-1, 0, checkingBall))

        // Check DIAGNOALLY [ FROM LEFT TO RIGHT UP ]
        ballsToDeleteTab.push(this.handleCheckDirection(-1, 1, checkingBall))

        // Check LEFT RIGHT
        ballsToDeleteTab.push(this.handleCheckDirection(0, -1, checkingBall))


        let deleteHighlighted: boolean = false

        ballsToDeleteTab.forEach(tab => {
            if (tab.length >= 4) {
                deleteHighlighted = true
                tab.forEach(ball => {
                    ball.remove = true
                })
            }
        })

        // Cehck if delete for
        if (deleteHighlighted) {
            checkingBall.remove = true

            // Clear grid
            this.ballsTab.forEach(ball => {
                if (ball.remove) {
                    this.grid[ball.position.y][ball.position.x] = 0
                    this.squaresTab[ball.position.y][ball.position.x].clearSquare()
                }
            })
            for (let i = this.ballsTab.length - 1; i >= 0; i--) {
                if (this.ballsTab[i].remove) {
                    this.ballsTab.splice(i, 1)
                    this.points++
                }
            }
            document.getElementById("points").innerText = "Points: " + this.points
            return true
        }
        else
            return false
    }

    private handleCheckDirection = (posYChange: number, posXChange: number, checkingBall: Ball) => {
        let colorCheck: string = this.colorsTab[checkingBall.position.y][checkingBall.position.x]
        let go: boolean = true

        let y: number = checkingBall.position.y
        let x: number = checkingBall.position.x

        let ballsToDelete: Ball[] = []
        while (go) {
            y += posYChange
            x += posXChange
            try {
                if (this.colorsTab[y][x] != colorCheck)
                    go = false
                else {
                    this.ballsTab.forEach(ball => {
                        if (ball.position.y == y && ball.position.x == x)
                            ballsToDelete.push(ball)
                    })
                }
            }
            catch (err) {
                // console.log(err)
                go = false
            }
        }
        go = true
        y = checkingBall.position.y
        x = checkingBall.position.x
        while (go) {
            y -= posYChange
            x -= posXChange
            try {
                if (this.colorsTab[y][x] != colorCheck)
                    go = false
                else {
                    this.ballsTab.forEach(ball => {
                        if (ball.position.y == y && ball.position.x == x)
                            ballsToDelete.push(ball)
                    })

                }
            }
            catch (err) {
                // console.log(err)
                go = false
            }
        }
        // console.log(ballsToDelete)
        return ballsToDelete
    }


    // Checking empty Squares
    private handleCheckEnd = () => {
        let over: number = 0
        let count: number = 0

        this.squaresTab.map(row => {
            row.map(square => {
                if (square.empty)
                    count++
            })
        })

        if (count == 3) over = 1
        else if (count < 3) over = 2


        return over

    }

    // GameOver Score to Firestore and display best games
    private showScoreGame = () => {
        document.getElementById('game').remove()
        document.getElementById('showScore').style.display = 'flex'
        document.getElementById('showScore').innerText = "Firebase Scores: " + this.points
    }

    private handleSquareEnter = (currentSquare: Square) => {

        if (currentSquare.empty && this.highlight != null) {
            this.fastFinder(currentSquare.y, currentSquare.x)
        }
    }

    private handleSquareOut = (currentSquare: Square) => {

        if (currentSquare.empty && this.highlight != null) {
            this.handleResetPath()
        }
    }

    private handleResetPath = () => {
        this.path.map(path => {
            document.getElementById(path).classList.remove('finder')
            document.getElementById(path).classList.remove('wrongFinder')
        })
    }

    private handleResetPathTimeOut = () => {
        this.handleResetPath()
        this.colorPath('correctFinder')

        setTimeout(() => {

            this.path.map(path => {
                document.getElementById(path).classList.remove('correctFinder')
            })
        }, 400)

    }

    private fastFinder = (row, col) => {
        const startPos: PatternRowCol = { row: this.highlight.position.y, col: this.highlight.position.x }

        const queue = []
        const parentForCell: Parent = { key: '', cell: '' }

        // parentForCell[startPos] = { key: startPos, cell: undefined }

        queue.push(startPos)


        while (queue.length > 0) {

            const { row, col } = queue.shift()

            const currentPos: string = `${row}x${col}`
            const currentCell = this.cells[row][col]

            const neightbors: any[] = [
                { row: row - 1, col },
                { row, col: col + 1 },
                { row: row + 1, col },
                { row, col: col - 1 }

            ]

            for (let i = 0; i < neightbors.length; i++) {
                const nRow: number = neightbors[i].row
                const nCol: number = neightbors[i].col

                if (nRow < 0 || nRow > this.cells.length - 1) {
                    continue
                }

                if (nCol < 0 || nCol > this.cells[nRow].length - 1) {
                    continue
                }

                if (this.grid[nRow][nCol] === 1) {
                    continue
                }

                const key: string = `${nRow}x${nCol}`

                if (key in parentForCell || key === `${startPos.row}x${startPos.col}`) {
                    continue
                }

                parentForCell[key] = { key: currentPos, cell: currentCell }

                queue.push(neightbors[i])
            }



            // console.log(neightbors)
            // console.log({ currentPos, currentCell })
        }
        // console.log(parentForCell)

        this.path = []
        let current: string = `${row}x${col}`
        // console.log(current)

        this.path.push(current)
        while (current !== `${startPos.row}x${startPos.col}`) {

            const cell: Parent = parentForCell[current]

            // Key not from normal Table
            if (cell !== undefined) {
                this.canMove = true
                this.path.push(cell.key)
                current = cell.key
            }
            else {

                // Stupid mistake makes nice system :)
                this.handleResetPath()
                this.colorPath('wrongFinder')


                console.log('ehh, wrong way..')
                // console.log(this.path)
                this.canMove = false
                break // with this break
            }

        }
        this.colorPath('finder')

    }

    private colorPath = (color: string) => {
        for (let i = 0; i < this.path.length; i++) {
            document.getElementById(this.path[i]).classList.add(color)
        }
    }

}

new Game()