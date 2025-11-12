'use client'

import React from 'react';
import axios from 'axios';
// import { ImagePlay, ImageDown, Smartphone } from 'lucide-react';

import { unsplashConfig } from '@/lib/firebase';

export default function Unsplash(){
    const [page, setPage] = React.useState(1);
    const [load, setLoad] = React.useState(false);
    const [photoArr, setPArr] = React.useState([]);

    // const [order_by, setOBy] = React.useState('views');
    // const [orient, setOrient] = React.useState('landscape');

    const { url, user_name, public_key } = unsplashConfig;

    const handlePage=()=>{
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
                <div className='text-2xl -mt-1 font-semibold cursor-default'>UnSplash</div>
                {/* <div onClick={changeOrder}>{order_by==='views' ? <ImageDown /> : <ImagePlay />}</div>  */}
                {/* <div onClick={changeOrientation}>{orient==='portrait' ? <Smartphone /> : <Smartphone className='rotate-90' />}</div>  */}
            </h2>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 break-inside-avoid">
                {photoArr.map((it) => <div key={it.id} className='rounded-[15px] m-2'>
                    <img src={it.urls?.full} className='w-[250px] h-auto p-0.5 border-2 border-b-6 rounded-[15px]' />
                </div>)}
            </div>

            <div className='flex flex-row justify-center mt-3'>
                <button className='text-xl p-3 border border-b-3 rounded-[15px]' onClick={() => handlePage()} disabled={load}>Load More</button>
            </div>

        </div>
    );
};