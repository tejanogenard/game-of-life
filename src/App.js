import React, { useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import { glider, spaceships, oscillator } from '../src/presets'
import produce from 'immer'

const numRows = 25;
const numCols = 25;

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
  ];

  const buildEmptyGrid = () => {
    const rows = []
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows
  }


function App() {
  const [grid, setGrid] = useState(() => {
    return buildEmptyGrid()
  })

  const [running, setRunning] = useState(false)
  const runningRef = useRef(running)
  runningRef.current = running

  // log the generations 
  const [ gen, setGen ] = useState(0);

  //set game speed 
  const [ speed, setSpeed ] = useState(1000)
  


  const runSimulation = useCallback(() => { // simulation function 
    if(!runningRef.current) {
        return
    }
    setGen(generation => generation + 1)
    setGrid(g => {
        return produce(g, gridCopy => {
          for (let i = 0; i < numRows; i++) {
            for (let k = 0; k < numCols; k++) {
              let neighbors = 0;
              operations.forEach(([x, y]) => {
                const newI = i + x;
                const newK = k + y;
                if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                  neighbors += g[newI][newK];
                }
              });
              if (neighbors < 2 || neighbors > 3) {
                gridCopy[i][k] = 0;
              } else if (g[i][k] === 0 && neighbors === 3) {
                gridCopy[i][k] = 1;
              }
            }
          }
        });
      });
      setTimeout(runSimulation, speed);
    }, [speed]);



  return (
    <>
    <h1>THE GAME OF LIFE</h1>
         
    <p className="about">
    1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    </p>
    <p className="about">
    2. Any live cell with two or three live neighbours lives on to the next generation.
    </p>
    <p className="about">
    3. Any live cell with more than three live neighbours dies, as if by overpopulation. 
    </p>
    <p className="about">
    4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    </p>
    
      <div className = 'grid' style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            
            <div
              key={`${i} - ${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k] = grid[i][k] ? 0 : 1
                })
                setGrid(newGrid)
              }}
              style={{
                width: 20, 
                height: 20,
                backgroundColor: grid[i][k] ? "gold" : undefined,
                border: 'double .1px white',
                boxShadow: grid[i][k] ? '0px 0px 50px #663399' : undefined
              }}
            />
          ))
          
        )}      
      </div>

    <div className = 'generation-counter'>Generation:{gen}</div>

    <div className = 'gamemode-controls'>
    <Button variant="outlined" color="secondary"  onClick={() => {
        setRunning(!running)
        if(!running){
            runningRef.current = true
            runSimulation()
        }}}>
      {running ? 'stop' : 'start'}
      </Button>
      <Button variant="outlined" color="secondary" onClick={() =>{ setGrid(buildEmptyGrid()); setGen(0)}}>clear</Button> 
    </div>

     <div className ="presets">
      <Button variant="outlined" color="secondary"  
           onClick={() =>{
           const rows = []
           for (let i = 0; i < numRows; i++) {
             rows.push(Array.from(Array(numCols), () => Math.random() > .8 ? 1: 0))
           }
           setGrid(rows)
           setGen(0)
      }}>
        random
      </Button>
      
      <Button variant="outlined" color="secondary" onClick={() => setGrid(glider)}><div>Gliders</div></Button>
      <Button variant="outlined" color="secondary" onClick={() => setGrid(spaceships)}><div>Spaceships</div></Button>
      <Button variant="outlined" color="secondary" onClick={() => setGrid(oscillator)}><div>Oscillators</div></Button>
    </div>


      <div className='speed-control'>
          <Button variant="outlined" color="secondary"   onClick={() => setSpeed(1000)}>normal</Button>
          <Button variant="outlined" color="secondary"   onClick={() => setSpeed(100)}>fast</Button>
          <Button variant="outlined" color="secondary"   onClick={() => setSpeed(10)}>super fast</Button>
      </div>

    </>
  );
}
export default App;