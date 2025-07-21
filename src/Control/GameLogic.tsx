import { useEffect, useState } from "react";
import Boards from "../Components/Boards";

function GameLogic() {
  const initialBoard = Array.from({ length: 9 }, () => Array(9).fill(""));
  const [v, setValue] = useState<string[][]>(initialBoard);

  type Difficulty = "easy" | "medium" | "hard";
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  useEffect(() => generateRandomBoard(difficulty), [difficulty]);
  //for generating randomly the puzzel
  let randomBoard = Array.from({ length: 9 }, () => Array(9).fill(""));

  const [randomBoardState, setRandomState] = useState<string[][]>(randomBoard);

  const oldBoard = Array.from({ length: 9 }, () => Array(9).fill(""));
  const [oldBoardValue, setOldBoard] = useState<string[][]>(oldBoard);
     
  //for hint
  let hint = [0];
  const [hintedCell, setHint] = useState<number[]>(hint);
const[hintValue,setHintValue]=useState(0);
 const[hintCounter,setHintCounter]=useState(0);

  const handleChange = (row: number, col: number, value: string) => {
    if (!/^[1-9]?$/.test(value)) return;
    const newBoard = v.map((r) => [...r]);
    newBoard[row][col] = value;
    setValue(newBoard);
  };

  const HasConflict = (
    row: number,
    col: number,
    value: string,
    b: string[][]
  ) => {
    if (value === "") return false;

    // Check row
    for (let i = 0; i < 9; i++) {
      if (b[row][i] === value && i !== col) return true;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (b[r][col] === value && r !== row) return true;
    }

    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r !== row && c !== col && b[r][c] === value) return true;
      }
    }

    return false;
  };
  //check if the board is valid
  const IsBoardValid = () => {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        const value = v[row][column];
        if (!value || HasConflict(row, column, value, v)) return false;
      }
    }
    return true;
  };
  //clear board
  const clearBoard = () => {
    setValue(oldBoardValue);
    setHint([0]);
  };
  //hard medium and easy
  const SetDificulty = (level: string, board: string[][]) => {
    let d = 0;
    switch (level) {
      case "hard":
        d = 65;
        setHintValue(5);
        setHintCounter(0);
        break;
      case "easy":
        d = 15;
        setHintValue(0);
        setHintCounter(0);
        break;
      case "medium":
        d = 35;
        setHintValue(3);
        setHintCounter(0);
        break;
      default:
        d = 25;
    }
    const b = board.map((r) => [...r]);

    for (let i = 0; i < d; i++) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);
      if (b[row][col] != "") b[row][col] = "";
      else i--;
    }
    return b;
  };
  //generate randomly a board
  const generateRandomBoard = (level: Difficulty) => {
    //1-recursion:show if has conflict for a specific value
    const fillCell = (pos: number): boolean => {
      if (pos == 81) return true;
      const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].sort(
        () => Math.random() - 0.5
      );
      const row = Math.floor(pos / 9); // 0/9=0 1/9=0...
      const col = pos % 9; //0%9=0 1%9=1...
      for (const d of digits) {
        if (!HasConflict(row, col, d, randomBoard)) {
          randomBoard[row][col] = d.toString();
          if (fillCell(pos + 1)) return true;
        }
      }
      //brj3 la wara 5twe bjreb r2m tene
      randomBoard[row][col] = "";
      return false;
    };
    fillCell(0);
    setRandomState(randomBoard);
    randomBoard = SetDificulty(level, randomBoard);
    setValue(randomBoard);
    setOldBoard(randomBoard);
  };
  //solve the board
  const solveBoard = () => {
    setValue(randomBoardState);
  };
  const OnChangeDificulty = (level: Difficulty) => {
    setDifficulty(level);
    generateRandomBoard(level);
  };

  //hint button
  const hintCell = () => {
    let temp = v.map((r) => [...r]);
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if(hintValue>hintCounter){
    if (v[row][col] == "") {
      setHintCounter(hintCounter+1);
      temp[row][col] = randomBoardState[row][col];
      setValue(temp);
      let h = [row, col];
      setHint(h);
    } else hintCell();
  }else alert("no more hint!!");
  };
  const isHint = (row: number, col: number) => {
    if (hintedCell[0] == row && hintedCell[1] == col) {
      return true;
    }
    return false;
  };
  const isGeneratedCell=(row:number,col:number)=>{
    if(oldBoardValue[row][col]=="")return false;
    else return true;
  }
  return (
    <>
      <div className="container">
        <Boards
          board={v}
          hasConflicts={HasConflict}
          onchange={handleChange}
          isHint={isHint}
          isGeneratedCell={isGeneratedCell}
        />
        <br></br>
        <div className="radioGroup">
          game level :
          <input
            type="radio"
            name="difficulty"
            value="easy"
            checked={difficulty === "easy"}
            onChange={() => {
              OnChangeDificulty("easy");
            }}
          />
          &nbsp;Easy
          <input
            type="radio"
            name="difficulty"
            value="medium"
            checked={difficulty === "medium"}
            onChange={() => {
              OnChangeDificulty("medium");
            }}
          />
          &nbsp;Medium
          <input
            type="radio"
            name="difficulty"
            value="hard"
            checked={difficulty === "hard"}
            onChange={() => {
              OnChangeDificulty("hard");
            }}
          />
          &nbsp;Hard
        </div>
      </div>
      <div className="btnDiv">
        <button
          className="BtnCheck"
          onClick={() =>
            alert(IsBoardValid() ? "Correct!" : "There are mistakes!")
          }
        >
          Check solution
          <svg
            className="svg1"
            viewBox="0 0 800 800"
            enable-background="new 0 0 800 800"
            id="GUIDE"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path d="M676.637,183.386c0.002-0.002,0.004-0.004,0.005-0.005L522.549,29.287c-3.619-3.62-8.62-5.86-14.145-5.86H137.5 c-11.046,0-20,8.954-20,20v713.146c0,11.046,8.954,20,20,20h525c11.046,0,20-8.954,20-20V197.522 C682.5,192.407,680.426,187.203,676.637,183.386z M642.5,736.573h-485V63.427h342.62l114.096,114.095l-85.812,0v-41.788 c0-11.046-8.954-20-20-20s-20,8.954-20,20v61.788c0,11.046,8.954,20,20,20c0,0,92.404,0,134.096,0V736.573z"></path>{" "}
                <path
                  className="path1"
                  d="M295.217,224.417l-39.854,39.855l-5.697-5.697c-7.811-7.811-20.473-7.811-28.283,0c-7.811,7.81-7.811,20.473,0,28.284 l19.84,19.84c3.75,3.751,8.838,5.858,14.142,5.858c5.305,0,10.392-2.107,14.143-5.858l53.996-53.999 c7.81-7.811,7.81-20.474-0.001-28.284C315.69,216.606,303.027,216.606,295.217,224.417z"
                ></path>{" "}
                <path
                  className="path1"
                  d="M557.831,312.557h6.646c11.046,0,20-8.954,20-20s-8.954-20-20-20h-6.646c-11.046,0-20,8.954-20,20 S546.785,312.557,557.831,312.557z"
                ></path>{" "}
                <path
                  className="path1"
                  d="M367.389,272.557c-11.046,0-20,8.954-20,20s8.954,20,20,20h129.609c11.046,0,20-8.954,20-20s-8.954-20-20-20H367.389z"
                ></path>{" "}
                <path
                  className="path1"
                  d="M557.831,435.552h6.646c11.046,0,20-8.954,20-20s-8.954-20-20-20h-6.646c-11.046,0-20,8.954-20,20 S546.785,435.552,557.831,435.552z"
                ></path>{" "}
                <path
                  className="path1"
                  d="M496.998,395.552H367.389c-11.046,0-20,8.954-20,20s8.954,20,20,20h129.609c11.046,0,20-8.954,20-20 S508.044,395.552,496.998,395.552z"
                ></path>{" "}
                <path
                  className="path2"
                  d="M557.831,558.547h6.646c11.046,0,20-8.954,20-20s-8.954-20-20-20h-6.646c-11.046,0-20,8.954-20,20 S546.785,558.547,557.831,558.547z"
                ></path>{" "}
                <path
                  className="path2"
                  d="M496.998,518.547H367.389c-11.046,0-20,8.954-20,20s8.954,20,20,20h129.609c11.046,0,20-8.954,20-20 S508.044,518.547,496.998,518.547z"
                ></path>{" "}
                <path
                  className="path1"
                  d="M557.831,681.542h6.646c11.046,0,20-8.954,20-20s-8.954-20-20-20h-6.646c-11.046,0-20,8.954-20,20 S546.785,681.542,557.831,681.542z"
                ></path>{" "}
                <path
                  className="path1"
                  d="M496.998,641.542H367.389c-11.046,0-20,8.954-20,20s8.954,20,20,20h129.609c11.046,0,20-8.954,20-20 S508.044,641.542,496.998,641.542z"
                ></path>{" "}
                <path
                  className="path1"
                  d="M255.363,435.552c5.304,0,10.392-2.107,14.142-5.858l53.996-53.996c7.811-7.811,7.811-20.475,0-28.285 s-20.473-7.811-28.283,0l-39.854,39.855l-5.697-5.698c-7.81-7.81-20.474-7.812-28.284-0.001s-7.811,20.474-0.001,28.284 l19.84,19.841C244.972,433.444,250.059,435.552,255.363,435.552z"
                ></path>{" "}
                <path
                  className="path2"
                  d="M234.239,511.547l-12.856,12.857c-7.81,7.811-7.81,20.474,0.001,28.284c3.905,3.905,9.023,5.857,14.142,5.857 s10.237-1.952,14.143-5.858l12.855-12.855l12.856,12.855c3.904,3.906,9.023,5.858,14.142,5.858s10.237-1.952,14.142-5.858 c7.811-7.811,7.811-20.473,0-28.283l-12.855-12.857l12.856-12.857c7.81-7.811,7.81-20.474-0.001-28.284 c-7.811-7.81-20.474-7.81-28.284,0.001l-12.856,12.856l-12.857-12.856c-7.811-7.811-20.473-7.811-28.283,0s-7.811,20.474,0,28.283 L234.239,511.547z"
                ></path>{" "}
                <path
                  className="path1"
                  d="M295.217,593.4l-39.854,39.855l-5.697-5.697c-7.811-7.811-20.473-7.811-28.283,0c-7.811,7.81-7.811,20.473,0,28.283 l19.84,19.84c3.75,3.752,8.838,5.858,14.142,5.858c5.305,0,10.392-2.107,14.143-5.858l53.996-53.998 c7.81-7.811,7.81-20.474-0.001-28.284C315.69,585.59,303.027,585.59,295.217,593.4z"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </button>
        <button className="BtnClearBoard" onClick={() => clearBoard()}>
          Clear board
          <svg
            className="svg2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                opacity="0.5"
                d="M14.9522 3C13.9146 3 13.0796 3.83502 11.4096 5.50506L6.5 10.4146L13.5854 17.5L18.4949 12.5904C20.165 10.9204 21 10.0854 21 9.04776C21 8.01013 20.165 7.1751 18.4949 5.50506C16.8249 3.83502 15.9899 3 14.9522 3Z"
                fill="#1C274C"
              ></path>{" "}
              <path
                d="M13.5854 17.5001L6.5 10.4147L5.50506 11.4096C3.83502 13.0796 3 13.9147 3 14.9523C3 15.9899 3.83502 16.825 5.50506 18.495C7.1751 20.165 8.01013 21.0001 9.04776 21.0001C10.0854 21.0001 10.9204 20.165 12.5904 18.495L13.5854 17.5001Z"
                fill="#1C274C"
              ></path>{" "}
              <g opacity="0.5">
                {" "}
                <path
                  d="M9.03264 21H9C9.01086 21.0003 9.02174 20.9999 9.03264 21Z"
                  fill="#1C274C"
                ></path>{" "}
                <path
                  d="M9.06287 21C9.85928 20.9938 10.5389 20.4938 11.5734 19.5L21 19.5C21.4142 19.5 21.75 19.8358 21.75 20.25C21.75 20.6642 21.4142 21 21 21H9.06287Z"
                  fill="#1C274C"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </button>
        <button className="solveBoard" onClick={() => solveBoard()}>
          Solve board
          <svg className="svg3" viewBox="0 0 512 512">
            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
          </svg>
        </button>
        <button className="BtnHint" onClick={() => hintCell()}>
          Hint
          <svg
            className="svg"
            width="28px"
            height="28px"
            viewBox="-2.4 -2.4 28.80 28.80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#000000"
            stroke-width="0.00024000000000000003"
            transform="matrix(1, 0, 0, 1, 0, 0)"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#CCCCCC"
              stroke-width="0.4800000000000001"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.29298 3.29289C2.90246 3.68342 2.90246 4.31658 3.29298 4.70711L4.29298 5.70711C4.68351 6.09763 5.31667 6.09763 5.7072 5.70711C6.09772 5.31658 6.09772 4.68342 5.7072 4.29289L4.7072 3.29289C4.31667 2.90237 3.68351 2.90237 3.29298 3.29289ZM19.293 3.29289C19.6835 2.90237 20.3167 2.90237 20.7072 3.29289C21.0977 3.68342 21.0977 4.31658 20.7072 4.70711L19.7072 5.70711C19.3167 6.09763 18.6835 6.09763 18.293 5.70711C17.9025 5.31658 17.9025 4.68342 18.293 4.29289L19.293 3.29289ZM19.7072 14.2929L20.7072 15.2929C21.0977 15.6834 21.0977 16.3166 20.7072 16.7071C20.3167 17.0976 19.6835 17.0976 19.293 16.7071L18.293 15.7071C17.9025 15.3166 17.9025 14.6834 18.293 14.2929C18.6835 13.9024 19.3167 13.9024 19.7072 14.2929ZM3.29298 16.7071C2.90246 16.3166 2.90246 15.6834 3.29298 15.2929L4.29298 14.2929C4.68351 13.9024 5.31667 13.9024 5.7072 14.2929C6.09772 14.6834 6.09772 15.3166 5.7072 15.7071L4.7072 16.7071C4.31667 17.0976 3.68351 17.0976 3.29298 16.7071ZM20.4142 11C20.9665 11.0001 21.4142 10.5524 21.4142 10.0001C21.4143 9.44781 20.9666 9.00007 20.4143 9.00003L20.0001 9C19.4478 8.99996 19.0001 9.44765 19 9.99993C19 10.5522 19.4477 11 20 11L20.4142 11ZM2 10.2072C2.00004 10.7595 2.44779 11.2072 3.00007 11.2071L3.41428 11.2071C3.96657 11.2071 4.41425 10.7593 4.41421 10.207C4.41417 9.65474 3.96643 9.20705 3.41414 9.20709L2.99993 9.20712C2.44765 9.20716 1.99996 9.65491 2 10.2072ZM15.4366 14.9189C16.9865 13.8341 18 12.0354 18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10C6 12.0354 7.0135 13.8341 8.56337 14.9189C8.21123 15.3497 8 15.9002 8 16.5C8 17.7099 8.85949 18.7191 10.0012 18.9502C10.0004 18.9667 10 18.9833 10 19C10 19.5523 10.4477 20 11 20H13C13.5523 20 14 19.5523 14 19C14 18.9833 13.9996 18.9667 13.9988 18.9502C15.1405 18.7191 16 17.7099 16 16.5C16 15.9002 15.7888 15.3497 15.4366 14.9189ZM12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14ZM12 16H11.9146H10.5C10.2239 16 10 16.2239 10 16.5C10 16.7761 10.2239 17 10.5 17H11.9146H12.0854H13.5C13.7761 17 14 16.7761 14 16.5C14 16.2239 13.7761 16 13.5 16H12.0854H12Z"
                fill="#000000"
              ></path>{" "}
            </g>
          </svg>
        </button>
      </div>
    </>
  );
}

export default GameLogic;
