import { useState } from "react";
import "./styles.css";

function Square({ value, handleClick, isActive }) {
  return (
    <button
      className={isActive ? "toggleSquare" : "square"}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill("+")]);
  const [curMove, setCurMove] = useState(0);
  const [isActive, setIsActive] = useState(Array(9).fill(false));
  const [decr, setDecr] = useState(false);
  const [winner, setWinner] = useState(null);
  // const [movesHistory, setMovesHistory] = useState([]);

  const curSquares = history[curMove];

  function resetActive() {
    setIsActive(Array(9).fill(false));
  }

  function handlePlay(newArr) {
    let newHistory = [];
    if(decr){
      newHistory.push(newArr);

      for(let ind = curMove; ind < history.length; ind++){
        newHistory.push(history[ind]);  
      }

      setHistory(newHistory);
      setCurMove(0);
    }else{
      newHistory = [...history.slice(0, curMove + 1), newArr];
      setHistory(newHistory);
      setCurMove(newHistory.length - 1);
    }

    
    // let prevSquares = history[decr? 0: curMove];
    // let curSquares = newHistory[decr? 0: curMove+1];
    // let move;

    // for(let id=0; id < 9; id++){
    //   if(prevSquares[id] !== curSquares[id]){
    //     move = id; break;
    //   }
    // }

    // let newMovesHistory = [];
    // if(decr){
    //   newMovesHistory.push(move);
    //   for(let ind = curMove; ind < movesHistory.length; ind++){
    //     newMovesHistory.push(movesHistory[ind]);
    //   }
    // }else if(movesHistory.length) newMovesHistory = [...movesHistory.slice(0,curMove), move];
    // else newMovesHistory.push(move);

    // setMovesHistory(newMovesHistory);
  }

  function jumpTo(move) {
    setCurMove(move);
    resetActive();
  }

  function increasing() {
    if(!decr){
      alert("Move History is already in increasing order");
      return;
    }
    history.reverse();
    setDecr(false);
    setCurMove(history.length - 1 - curMove);
    // movesHistory.reverse();
  }

  function decreasing() {
    if(decr){
      alert("Move History is already in decreasing order");
      return;
    }
    history.reverse();
    setDecr(true);
    setCurMove(history.length - 1 - curMove);
    // movesHistory.reverse();
  }

  // function playerToMove(ind){
  //   if(decr)  return ((history.length - ind - 1) % 2) ? "O" : "X"; 
  //   return (ind % 2) ? "O" : "X";
  // }

  // const ToRowColumn = [
  //   [1,1], [1,2], [1,3], [2,1], [2,2], [2,3], [3,1], [3,2], [3,3] 
  // ];

  // function convertToRowColumn(ind){
  //   if(ind === undefined){
  //     console.log(ind); return 0;
  //   }
  //   return ", " + playerToMove(ind) + " at " + "{" + ToRowColumn[ind][0] + " " + ToRowColumn[ind][1]+ "}";
  // }


  const moves = history.map((squares, ind) => {
    let index = decr? history.length - ind - 1: ind; 

    let desc;
    if(ind === curMove) desc = "You are at move #" + index;
    else desc = (index ? "Go to move #" + index: "Go to Game start");
    
    let moveDesc="";
    // if(ind !== curMove){
    //     moveDesc = convertToRowColumn(movesHistory[ind]);
    //     // console.log(ind + " " + curMove);
    // }
    // console.log(movesHistory);

    return (
      <>
        <li key={ind}>
          <button className = "listbuttons" onClick={() => jumpTo(ind)}> {desc}{moveDesc} </button>
        </li>
      </>
    );
  });


  let congo = "";
  if(winner && winner !== undefined) congo = <h3 className="congoMessage"> Congratulations {winner} !! </h3>

  return (
    <>
      <div className = "title">
        <div className = {winner===null? "tictactoe": "toggleTicTacToe"}>
          <h1> Tic Tac Toe </h1>
        </div>

        <div className="congo">
          {congo}
        </div>
      </div>


      <div className="board">
        <Board
          isNext={(decr? history.length - curMove - 1 : curMove) % 2 === 0}
          squares={curSquares}
          onPlay={handlePlay}
          isActive={isActive}
          setWinner = {setWinner}
        />
      </div>


      <div className="other">
        <ol> {moves} </ol>
      </div>


      <div className = "sortBlock">
        <div className = "sort"> 
          <h3> Sort </h3>
        </div>
        
        <div className = "buttons">
          <button className="inc" onClick={increasing}>
            {" "}
            ↑{" "}
          </button>
          <button className="dec" onClick={decreasing}>
            {" "}
            ↓{" "}
          </button>
        </div>
      </div>
    </>
  );
}


function Board({ isNext, squares, onPlay, isActive, setWinner}) {
  let won = calculateWinner(squares, toggleSquare);
  setWinner(won);

  let status;
  if(won === undefined)  status = "DRAW";
  else if (won) status = "And the Winner is: " + won;
  else status = "Player's Turn: " + (isNext ? "X" : "O");

  function handleClick(ind) {
    if (squares[ind] !== "+" || calculateWinner(squares, toggleSquare)) return;

    const newArr = squares.slice();
    newArr[ind] = isNext? "X": "O";
    onPlay(newArr);
  }

  function toggleSquare(id) {
    isActive[id] = true;
  }

  return (
    <>
      <div
        className={won !== null? "toggleStatus" : "status"}
      >
        {" "}
        {status}{" "}
      </div>

      <RenderBoard squares = {squares} handleClick  = {handleClick} isActive = {isActive}/>
    </>
  );
}


function RenderBoard({ squares, handleClick, isActive }) {
    const board = [];

    for(let r = 0; r <= 6; r+=3){
        const boardRow = [];

        for(let ind = r; ind <= r+2; ind++){
            boardRow.push(
                <Square
                value={squares[ind]}
                handleClick={() => handleClick(ind)}
                isActive={isActive[ind]}
                />
            );
        }
        
        let element = <div className="boardRow">{boardRow}</div>;
        board.push(element);
    }
    return board;
}


function calculateWinner(squares, toggleSquare) {
  const winPos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winPos.length; i++) {
    const [x, y, z] = winPos[i];
    if (
      squares[x] !== "+" &&
      squares[x] === squares[y] &&
      squares[y] === squares[z]
    ) {
      toggleSquare(x);
      toggleSquare(y);
      toggleSquare(z);
      return squares[x];
    }
  }

  let filledSquares = 0;
  for (let i = 0; i < 9; i++) if (squares[i] !== "+") filledSquares++;

  if (filledSquares === 9) return undefined;
  return null;
}