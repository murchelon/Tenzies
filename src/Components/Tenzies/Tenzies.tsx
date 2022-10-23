import React from 'react';
import './css/Tenzies.css';
import BotaoTenzie from './Components/BotaoTenzie';
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'


function Tenzies() {
    
    type Botao = {
        id: string,
        valor: string,
        lockedState2: number
    };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CONSTANTES 
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const GAME_NUM_BOTOES: number = 12;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// STATES
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    const [log, setLog] = React.useState('');
    
    const [gameMode, setGameMode] = React.useState('INIT');     // INIT | WAIT | RUNNING | END_GAME
    const [gameClicks, setGameClicks] = React.useState(0); 

    const [game, setGame] = React.useState(() => {
        
        let ret = [];

        for (let x=1 ; x <= GAME_NUM_BOTOES ; x++)
        {
            var newBotao: Botao = {
                id: nanoid(),
                valor: "?",
                lockedState2: -1
            };

            // doLog(JSON.stringify(newBotao));
            
            ret.push(newBotao);
        }

        return ret;        
    });


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// EFFECTS
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    React.useEffect(() => {

        setGameMode('WAIT');
        console.log('ok')

    }, [])

    React.useEffect(() => {

        var ret = checkWinner();

        if (ret)
        {  
            setGame(prevGame => prevGame.map(item => {

                return {...item, lockedState2: -2}

            }))

            setGameMode('END_GAME');
        }
                

    }, [game])


    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FUNCOES
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    function novoJogo() {

        setGameMode('RUNNING')

        setGameClicks(0)

        let numbers = getDifRandNum()

        let ret = [];

        for (let x=0 ; x < GAME_NUM_BOTOES ; x++)
        {
            var newBotao: Botao = {
                id: game[x].id,
                valor: String(numbers[x]),
                lockedState2: 0
            };
            
            ret.push(newBotao);
        }

        setGame(ret);
    }

    function rolarDados() {

        addToClick()

        setGame(prevGame => {

            let newGame = prevGame.map(botao => {

                if (botao.lockedState2 === 0)
                {
                    var num: number = Math.floor(Math.random() * 10);
                    botao.valor = String(num);
                    return botao;
                }
                else
                {
                    return botao;
                }

            });

            return newGame
        });

    }

    function recomecar()
    {      
        setGame(prevGame => {
            let ret = [];

            for (let x=1 ; x <= GAME_NUM_BOTOES ; x++)
            {
                var newBotao: Botao = {
                    id: nanoid(),
                    valor: "?",
                    lockedState2: -1
                };
    
                // doLog(JSON.stringify(newBotao));
                
                ret.push(newBotao);
            }
    
            return ret;   
        });
        
        setGameMode('WAIT')      
    }


    function checkWinner()
    {
        
        var allEqual = true;

        for (var x=0 ; x <= game.length - 1 ; x++)
        {
            if (game[x].valor !== game[0].valor)
            {
                allEqual = false;
            }

            if (game[x].lockedState2 !== 1)
            {
                allEqual = false;
            }
        }
        
        return allEqual;
    }
    

    function toggleLocked(id: string) {

        addToClick()

        setGame(prevGame => prevGame.map(item => {

            if (item.id === id) 
            {
                if (item.lockedState2 === -1)
                {
                    return item;
                }
                else if (item.lockedState2 === 0)
                {
                    return {...item, lockedState2: 1}
                }
                else if (item.lockedState2 === 1)
                {
                    return {...item, lockedState2: 0}
                }  
                else
                {
                    // nao entendo a linha abaixo. Nao sei pq.
                    return {...item, lockedState2: -2}
                }
            } 
            else
            {
                return item
            }
        }))
    }
    
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FUNCOES DE SUPORTE
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function runDebug()
    {        
        var newGame = []

        for (var x=0 ; x <= game.length - 1 ; x++)
        {
            var newBotao = {
                ...game[x],
                lockedState2: x<=-1 ? game[x].lockedState2 : 1,
                valor: x<=-1 ? game[x].valor : '0'
            }

            newGame.push(newBotao)
        }

        setGame(newGame)
    }


    function addToClick()
    {
        setGameClicks(prevCount => {
            return prevCount + 1
        });
    }


    function getDifRandNum()   {

        let exitWhile: boolean = false;
        let contaTentativa: number = 0;

        let tempNumbers: number[] = [];

        var num: number = Math.floor(Math.random() * 10);

        for (let x=0 ; x < GAME_NUM_BOTOES ; x++)
        {            
            exitWhile = false;

            while(exitWhile === false) 
            {
                num = Math.floor(Math.random() * 10);

                contaTentativa++;
    
                let localFound: boolean = false;
    
                for (let x=0 ; x < tempNumbers.length ; x++)
                {
                    if (tempNumbers[x] === num)
                    {
                        localFound = true;
                        break;
                    }
                }
    
                if (contaTentativa >= GAME_NUM_BOTOES * 5) 
                {
                    localFound = false
                }

                if (localFound === false)
                {
                    tempNumbers.push(num);
                    exitWhile = true;
                }
            }
        }

        return tempNumbers;
    }


    function doLog(log: string)    {
        setLog(prevLog => {
            return prevLog + '\n' + log
        });
    }


    function limpaLog() {
        setLog('');
    }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// INIT VARS JSX
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    const botoesElem = game.map(botao => {
        return (
            <BotaoTenzie 
                key={botao.id}
                id={botao.id}
                valor={botao.valor}
                lockedState={botao.lockedState2}
                handleClick={toggleLocked}
            />
        );
    });

    var outResults = ''

    if (gameMode === 'WAIT')
    {
        outResults = 'Clique em Jogar! para iniciar'
    }
    else if (gameMode === 'RUNNING')
    {

        var strGameClicks = String(gameClicks)

        if (String(gameClicks).length === 1) {strGameClicks = '00' + String(gameClicks)}
        if (String(gameClicks).length === 2) {strGameClicks = '0' + String(gameClicks)}

        outResults = 'Clicks: ' + strGameClicks
    }
    else if (gameMode === 'END_GAME')
    {
        var strGameClicks = String(gameClicks)

        if (String(gameClicks).length === 1) {strGameClicks = '00' + String(gameClicks)}
        if (String(gameClicks).length === 2) {strGameClicks = '0' + String(gameClicks)}
     
        outResults = 'Você ganhou com ' + strGameClicks + ' clicks!'
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// RETURN JSX
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
    return (
        <div className="App">
           
           
           { gameMode === 'END_GAME' && <Confetti gravity={0.2} wind={0}  /> }

           <div className="logpanel"><pre>{log}</pre></div>
           <div className="backpanel">
            
                <div className="contentArea">
                    
                    <div className="titulo">Tenzies</div>

                    <div className="desc">
                        Jogue os dados até que os números sejam todos iguais. Congele numeros, para que não se alterem, clicando nele. Com quantos cliques você consegue vencer o jogo?
                    </div>

                    <div className="panelButton">
                        {botoesElem}                        
                    </div>

                    { gameMode === 'WAIT' && <button className="app_button" onClick={novoJogo}>Iniciar</button> }
                    { gameMode === 'RUNNING' && <button className="app_button" onClick={rolarDados}>Rolar Dados!</button> }
                    { gameMode === 'END_GAME' && <button className="app_button" onClick={recomecar}>Jogar de Novo!</button> }

                    { <button className="app_button" onClick={runDebug}>Debug</button> }

                    <div className="result">
                        {outResults}
                    </div>

                </div>

           </div>

        </div>        
    );
} 

export default Tenzies;