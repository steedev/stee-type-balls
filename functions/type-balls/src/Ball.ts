import { IBall } from './Interfaces'

export default class Ball implements IBall {
    public position: any
    readonly color: string
    public remove: boolean
    public dv: HTMLDivElement

    constructor(color: string) {
        this.position = null
        this.color = color
        this.remove = false
        this.dv = null
    }


    readonly createBall = () => {
        let dv = document.createElement('div')
        dv.className = 'ball'

        dv.style.background = this.color
        this.dv = dv
        return dv
    }

    readonly newPosition = (position: any) => {
        this.position = position
    }
}