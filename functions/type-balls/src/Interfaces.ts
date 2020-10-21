import Square from './Square'
import Ball from './Ball'

export interface Parent {
    key: string
    cell: string
}

export interface PatternRowCol {
    row: number
    col: number
}

export interface IGame {
    grid: number[][]
    squaresTab: Square[][]
    ballsTab: IBall[]
    colors: string[]
    ballsQueue: Ball[]
    highlight: Ball
    cells: any[]
    path: any[]
    canMove: boolean
    colorsTab: string[][]
    pause: boolean
    points: number
}

export interface ISquare {
    y: number
    x: number
    empty: boolean
    dv: HTMLDivElement
}

export interface IBall {
    position: any
    color: string
    remove: boolean
    dv: HTMLDivElement
}