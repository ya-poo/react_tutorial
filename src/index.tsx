import React, { Component } from "react";
import * as ReactDOM from "react-dom";
import "./style.css";

type SquareType = string | null;

interface SquareProps {
    value: SquareType;
    onClick: () => void;
}

function Square(props: SquareProps) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

interface BoardProps {
    squares: SquareType[];
    onClick: (i: number) => void;
}

class Board extends React.Component<BoardProps> {
    renderSquare(i: number) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

interface History {
    squares: SquareType[];
}

interface GameState {
    history: History[];
    xIsNext: boolean;
    stepNumber: number;
}

class Game extends React.Component<{}, GameState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            history: [{ squares: Array(9).fill(null) }],
            xIsNext: true,
            stepNumber: 0
        };
    }

    handleClick(i: number) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        let squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat({
                squares: squares
            }),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step: number) {
        this.setState({
            stepNumber: step,
            xIsNext: (step & 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((_, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares: SquareType[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(<Game />, document.getElementById("root"));
