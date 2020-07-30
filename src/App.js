import React, { useState, useCallback, useRef } from 'react';
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

    console.log(speed)

  return (
    <>
    <div>THE GAME OF LIFE</div>
      <div style={{
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
                border: 'solid 1px black',
                boxShadow: grid[i][k] ? '0px 0px 50px #663399' : undefined
              }}
            />
          ))
        )}        
      </div>

      <button onClick={() => {
        setRunning(!running)
        if(!running){
            runningRef.current = true
            runSimulation()
        }}}>
      {running ? 'stop' : 'start'}
      </button>

      <button onClick={() =>{
           const rows = []
           for (let i = 0; i < numRows; i++) {
             rows.push(Array.from(Array(numCols), () => Math.random() > .8 ? 1: 0))
           }
           setGrid(rows)
           setGen(0)
      }}>
        random
      </button>

      <button onClick={() =>{ setGrid(buildEmptyGrid()); setGen(0)}}>clear</button>
      <button onClick={() => setGrid(glider)}><div>Gliders</div></button>
      <button onClick={() => setGrid(spaceships)}><div>Spaceships</div></button>
      <button onClick={() => setGrid(oscillator)}><div>Oscillators</div></button>

      <div className='speed-control'>
                <button className={speed === 10 ? "current" : undefined} onClick={() => setSpeed(10)}>2x</button>
            </div>
      <div>Generation:{gen}</div>
    </>
  );
}
export default App;