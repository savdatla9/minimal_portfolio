'use client'

import React from 'react';
import axios from 'axios';
// import { Eye } from 'lucide-react';

import { unsplashConfig } from '@/lib/firebase';

export default function Unsplash(){
    const [page, setPage] = React.useState(1);
    const [pLen, setPLen] = React.useState(0);
    const [load, setLoad] = React.useState(false);
    const [photoArr, setPArr] = React.useState([]);

    // const [order_by, setOBy] = React.useState('views');
    // const [orient, setOrient] = React.useState('landscape');

    const { url, user_name, public_key } = unsplashConfig;

    function handlePage(){
        setLoad(true);

        axios.get(`${url}users/${user_name}/photos?client_id=${public_key}&page=${page+1}&per_page=20&order_by=views`)
        .then((res) => { 
            setPArr((prev)=> [...prev, ...res.data]); 
            setLoad(false); setPage((prev) => prev+1);
        }).catch((err) => { console.log(err) });
    };

    React.useEffect(()=>{
        setLoad(true);

        axios.get(`${url}users/${user_name}/photos?client_id=${public_key}&page=${page}&per_page=20&order_by=views`)
        .then((res) => { 
            setPArr(res.data); setLoad(false); 
            setPLen(res.data[0].user.total_photos); 
        }).catch((err) => { console.log(err) });
    }, []);

    // const changeOrder = () => {
    //     setOBy(order_by === 'views' ? 'downloads' : 'views');
    // };

    // const changeOrientation = () => {
    //     setOrient(orient === 'landscape' ? 'portrait' : 'landscape');
    // }; 

    return(
        <div>
            <h2 className='flex flex-row flex-wrap justify-center gap-6 p-4'> 
                <div className='text-2xl mt-0.5 font-stretch-75% cursor-default font italic underline'>Unsplash</div>
            </h2>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 justify-items-center">
                {photoArr.map((it) => <div key={it.id} className="relative overflow-hidden rounded-2xl group">
                    <img
                        src={it.urls?.full} 
                        className='w-[200px] h-auto p-0.5 border-2 border-b-6 rounded-[15px]'
                    />
                </div>)}
            </div>

            {pLen > photoArr.length && <div className='flex flex-row justify-center mt-3'>
                <button className='text-xl p-3 border border-b-3 rounded-[15px]' onClick={() => handlePage()} disabled={load}>Load More</button>
            </div>}

        </div>
    );
};