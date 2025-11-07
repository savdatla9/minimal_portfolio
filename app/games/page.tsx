'use client'

const Games = () => {
    const pageArr = [
        { title: 'Tic Tac Toc Game', link: '/games/xo' },
        { title: 'Rock Paper Scissors Game', link: '/games/rps' },
        // { title: 'Tic Tac Toc Game', link: '/games/tictactoc' },
        // { title: 'Tic Tac Toc Game', link: '/games/tictactoc' },
    ];

    return (
        <div> 
            <h2 className='text-center text-[30px] font-semibold mb-5'> Games </h2>

            <div className='mt-3 flex flex-wrap justify-evenly'>
                {pageArr.map((it, idx) =>
                    <div key={idx} className='border-3 p-3' onClick={() => window.location.href=it.link}>
                        <b>{it.title}</b>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Games;