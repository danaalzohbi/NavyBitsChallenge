interface propsBoard {
  board: string[][];
  onchange: (row: number, col: number, value: string) => void;
  hasConflicts: (
    row: number,
    col: number,
    value: string,
    b: string[][]
  ) => boolean;
  isHint:(row:number,col:number)=>boolean;
  isGeneratedCell:(row:number,col:number)=>boolean;
 
}
function Boards({ board, onchange, hasConflicts,isHint,isGeneratedCell}: propsBoard) {
  // Generate a single cell input
  const createCellInput = (cellIndex: number, rowIndex: number) => {
    const value = board[rowIndex][cellIndex];
    const conflict = hasConflicts(rowIndex, cellIndex, value, board);
    //dynamic class for the bold border of the cell index
    const cellClass = `
      sudoku-cell 
      ${cellIndex % 3 == 0 ? "border-left-bold" : ""}
      ${cellIndex == 8 ? "border-right-bold" : ""}
      ${rowIndex % 3 == 0 ? "border-top-bold" : ""}
      ${rowIndex == 8 ? "border-bottom-bold" : ""}
    `;

    return (
      
      <input
        key={`cell-${rowIndex}-${cellIndex}`}
        value={value}
        className={`sudoku-cell ${cellClass} ${
          conflict ? "conflict-cell" : ""
        }
        ${isHint(rowIndex,cellIndex) ? "hintedCell" : "" } `
      } 
        onChange={(e) => onchange(rowIndex, cellIndex, e.target.value)}
        maxLength={1}
        type="text"
        inputMode="numeric"
        pattern="[1-9]*"
        readOnly={isGeneratedCell(rowIndex,cellIndex)}
      />
    );
  };

  // Generate a single row with 9 cells
  const createRowCells = (rowIndex: number) => (
    <div key={`row-${rowIndex}`} className="sudoku-row">
      {Array.from({ length: 9 }, (_, cellIndex) =>
        createCellInput(cellIndex, rowIndex)
      )}
    </div>
  );

  // Generate 9 rows to make the full board
  return (
    <div className="sudoku-board">
      {Array.from({ length: 9 }, (_, rowIndex) => createRowCells(rowIndex))}
    </div>
  );
}

export default Boards;
