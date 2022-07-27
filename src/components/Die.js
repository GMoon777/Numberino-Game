import React from 'react'

export default function Die(props) {
      const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return (
        
        <div className="die" style={styles} onClick={props.time ? props.holdDice : null}>
                <div className="die-num">
                {props.gameState !== "New" ? props.value : "?"}
             </div>
        </div>
    )
}