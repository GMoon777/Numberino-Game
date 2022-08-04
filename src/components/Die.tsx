import React from 'react'
import { DieProps } from '../utils/interfaces'


interface DieCompProps extends DieProps {
    holdDice: any;
    gameState: string;
    time: number;
 }
  

export function Die(props: DieCompProps) {
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