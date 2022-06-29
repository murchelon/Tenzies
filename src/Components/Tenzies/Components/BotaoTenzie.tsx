import React from 'react';
import './css/BotaoTenzie.css';

type BotaoTenzieProps = {
    id: string;
    valor: string;
    lockedState: number;
    handleClick: any;
}

function BotaoTenzie(props: BotaoTenzieProps) {

    let outStyle = '';

    if (props.lockedState === -1)
    {
        outStyle = 'botaoNumeroInit';
    }
    else if (props.lockedState === -2)
    {
        outStyle = 'botaoNumeroWin';
    }
    else if (props.lockedState === 0)
    {
        outStyle = 'botaoNumero';
    }
    else if (props.lockedState === 1)
    {
        outStyle = 'botaoNumeroLocked';
    }


    if ((props.lockedState === -1) || (props.lockedState === -2) )
    {
        return <button className={outStyle}>{props.valor}</button>
    }
    else
    {
        return <button className={outStyle} onClick={(event) => {props.handleClick(props.id)}}>{props.valor}</button>
    }  


}

export default BotaoTenzie;
