import { ISquare } from './Interfaces'

export default class Square implements ISquare {
    readonly y: number
    readonly x: number
    public empty: boolean
    public dv: HTMLDivElement

    constructor(y: number, x: number) {
        this.y = y
        this.x = x
        this.empty = true
        this.dv = null
    }

    readonly createSquare = () => {
        let dv = document.createElement('div')
        dv.className = 'square'
        dv.id = `${this.y}x${this.x}`

        dv.style.left = `${this.x * 62}px`
        dv.style.top = `${this.y * 62}px`

        this.dv = dv
        return dv
    }

    readonly createBall = (ball: HTMLDivElement) => {
        this.dv.appendChild(ball)
    }

    public clearSquare = () => {
        this.dv.innerText = ''
        this.empty = true
    }
}