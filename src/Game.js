import React from 'react'
import Die from './components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import scoreDownloader from './utils/ScoreDownloader'
import './style.css'

export default function Game() {
    const [level, setLevel] = React.useState(1)
    const [time, setTime] = React.useState(0);
    const [title, setTitle] = React.useState("Numberino")
    const [timeColor, setTimeColor] = React.useState("#3ffc00")
    const [difficulty, setDifficulty] = React.useState(10)
    const [gameState, setGameState] = React.useState("New")
    const [dice, setDice] = React.useState(allNewDice())

    const exportRef = React.useRef();
    const intervalRef = React.useRef();

    const mainContStyle = {
        backgroundColor: gameState === "Lost" ? "#ff3d3d" : "#F5F5F5"
    }
    const timeStyle = {
        color: timeColor
    }


    React.useEffect(() => {
        clearTimeout(intervalRef.current)
        clock()
    });


    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTime(0)
            if (gameState !== "Won") {
                setDifficulty(dif => dif + 5)
                setLevel(level => level + 1)
                setTitle("Level Complete!")
                setGameState("Won")

            }
        }

    }, [dice, gameState])

    function clock() {
        if (time > 0 && gameState !== "Lost") {
            applyTimeColor()
            function applyTimeColor() {

                if (time >= 7) {
                    setTimeColor("#33ff00")
                }
                else if (time >= 4) {
                    setTimeColor("#fac400")
                }
                else {
                    setTimeColor("#fa0000")
                }
            }
            const id = setTimeout(() => {
                setTime(time - 1)
            }, 1000);
            intervalRef.current = id;
        }

        else if (gameState !== "New" && gameState !== "Won") {
            if (gameState !== "Lost") {
                setDifficulty(10)
                setGameState("Lost")
                setTitle("Game Over!")
            }

        }
    }


    function generateNewDice() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        let newDice = []
        for (let i = 0; i < difficulty; i++) {
            newDice.push(generateNewDice())

        }
        return newDice
    }


    function timeAdjuster() {

        if (level >= 3) {
            setTime(8)
        }
        else if (level >= 5) {
            setTime(7)
        }
        else if (level >= 7) {
            setTime(6)
        }
        else if (level >= 10) {
            setTime(5)
        }
        else {
            setTime(10)
        }
    }

    async function rollDice() {
        clearTimeout(intervalRef.current)
        if (gameState === "Lost") {
            setLevel(1)
            timeAdjuster()
            setGameState("Playing")
            setDice(allNewDice())
        }
        if (gameState === "Won") {
            setGameState("Playing")
            setDice(allNewDice())
            timeAdjuster()
        }
        if (title === "Game Over!" || "Level Complete!") {
            setTitle("Numberino")
        }
        if (gameState === "Playing" || gameState === "New") {
            setGameState("Playing")
            timeAdjuster()
            const heldDice = dice.filter(die => die.isHeld)
            const unHeldDice = dice.filter(die => !die.isHeld)
            let test1 = []
            let test2 = []
            let allShownHeld = false
            for (let i = 0; i < heldDice.length; i++) {
                test1.push(heldDice[i].value)
            }

            for (let i = 0; i < unHeldDice.length; i++) {
                test2.push(unHeldDice[i].value)
            }

            for (let i = 0; i < test2.length; i++) {
                if (test1.includes(test2[i])) {
                    allShownHeld = true
                }
            }

            if (allShownHeld) {
                setTime(0)
            }
            else {
                setDice(oldDice => oldDice.map(die => {
                    return die.isHeld ?
                        die :
                        generateNewDice()
                }))
            }


        }

    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        }

        ))
    }

    const diceElements = dice.map(die => (
        <Die
            value={die.value}
            gameState={gameState}
            key={die.id}
            isHeld={die.isHeld}
            time={time}
            holdDice={() => holdDice(die.id)} />
    ))
    return (

        <main style={mainContStyle} ref={exportRef}>
            {gameState === "Won" && <Confetti />}
            <div className="mainHeaderCont">

                {gameState !== "Lost" ? `Level ${level}` : `You Reached Level ${level}`}
                <div className="mainHeaderTimeTitleCont">
                    <div className="mainHeaderTitleText">
                        {gameState === "Playing" ? "Time Remaining" : title}
                    </div>
                    <div className="mainHeaderTimeText" style={timeStyle}>
                        {gameState === "Playing" ? "(" + time + ")" : null}
                    </div>
                </div>

                <div className="mainHeaderDescText">
                    {gameState === "New" ? "Click the dice to hold a number, roll when all matching dice are held before the time runs out." : null}
                </div>

            </div>

            <div className="diceCont">
                {diceElements}
            </div>

            <div className="btnCont">
                <button
                    className="main-rollBtn"
                    onClick={rollDice}>
                    {gameState !== "Won" && (gameState === "Lost" ? "Again?" : "Roll")}
                    {gameState === "Won" && "Next Level"}
                </button>

                {gameState === "Lost" && <button className="main-rollBtn" onClick={() => scoreDownloader(exportRef, `I Reached Level ${level} in Numberino`)}>Share Score</button>}
            </div>
        </main>
    )
}