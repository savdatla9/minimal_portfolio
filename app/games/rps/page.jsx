'use client'

import { useState } from "react";

const choices = ["Rock 🪨", "Paper 📃", "Scissors ✂️"];

const RockPaper = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("");

  const handlePlay = (choice) => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    
    setUserChoice(choice);  setComputerChoice(randomChoice);

    calculateWinner(choice, randomChoice);
  };

  const calculateWinner = (user, computer) => {
    if(user === computer){
      setResult("draw");
    }else if(
      (user === "Rock 🪨" && computer === "Scissors ✂️") ||
      (user === "Paper 📃" && computer === "Rock 🪨") ||
      (user === "Scissors ✂️" && computer === "Paper 📃")
    ){
      setResult("win");
    }else{
      setResult("lose");
    };
  };

  const handleReset = () => {
    setResult(''); setUserChoice('');
    setComputerChoice('');
  }

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        marginTop: "80px",
      }}
    >
      <h1>🪨 • 📃 • ✂️</h1>

      <div style={{ margin: "30px 0" }}>
        {choices.map((choice) => (
            <button
                key={choice} onClick={() => handlePlay(choice)}
                style={{
                    margin: "10px", padding: "10px 20px",
                    fontSize: "18px", borderRadius: "8px",
                    border: "1px solid #444", cursor: "pointer",
                }}
            >
                {choice}
            </button>
        ))}
      </div>

      {userChoice && (
        <>
          <p className="m-2">
            <strong>Your choice:</strong> {userChoice}
          </p>

          <p className="m-2">
            <strong>Computer’s choice:</strong> {computerChoice}
          </p>
          
          <h2 className="text-xl font-semibold m-1" style={result==='win'?{color: 'green'}:result==='lose'?{color: 'red'}:{color: 'grey'}} >
            {result==='win' ? 'You Win!' : result==='lose' ? 'You Lose!' : result==='draw' && "It's a Draw!"}
          </h2>

          <button onClick={handleReset} className="border-solid border-2 border-b-5 rounded-xl p-4 text-30 font-semibold">
            Restart Game
          </button>
        </>
      )}
    </div>
  );
};

export default RockPaper;