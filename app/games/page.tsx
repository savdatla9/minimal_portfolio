"use client"

const Games = () => {
    const pageArr = [
        { title: 'Tic Tac Toc Game', link: '/games/xo', icons: 'XO', is2d: true },
        { title: 'Chess Game 2D', link: '/games/chess', icons: '♟️', is2d: true },
        { title: 'Rock Paper Scissors Game', link: '/games/rps', icons: ' 🪨 📃 ✂️ ', is2d: true },
        { title: 'Speed Typing Game', link: '/games/typespeed', icons: '⌨️', is2d: true },
        { title: 'Card Flip Game', link: '/games/cardflip', icons: '🧩', is2d: true  },
        // { title: 'Snake Game 2D', link: '/games/snake', icons: '🐍', is2d: true },
        { title: 'Whack A Hole Game', link: '/games/whackamole', icons: '🔨', is2d: true },
        { title: '2048 Puzzle Game', link: '/games/2048', icons: '🔢', is2d: true },
        { title: 'Guess Dice Number Game', link: '/games/diceroll', icons: '🎲', is2d: true },
        { title: 'Time Reaction Game', link: '/games/timereaction', icons: '⌛', is2d: true },
    ];

    return (
        <div> 
            <h2 className='text-center text-[35px] font-semibold mb-5'> Games 🕹️ </h2>

            <div className='mt-3 flex flex-wrap justify-center gap-[25px]'>
                {pageArr.map((it, idx) =>
                    <div 
                        key={idx} className='border-3 border-b-6 p-5 rounded-[15px] cursor-pointer' 
                        onClick={() => window.location.href=it.link}
                    >
                        <b>{it.title}</b>
                         
                        {it.is2d===true ? <sup 
                            className="font-bold text-md ml-1 italic"
                            >2D</sup> : <sup 
                            className="font-bold text-md ml-1 italic"
                            >3D</sup>
                        }

                        <p className="text-center mt-5 text-[28px]">{it.icons}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Games;