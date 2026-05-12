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

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 px-4 max-w-[1600px] mx-auto">
                {photoArr.map((it) => (
                    <div key={it.id} className="break-inside-avoid mb-6 relative group inline-block w-full border-2 border-b-6 rounded-[15px] overflow-hidden bg-white dark:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <img
                                src={it.urls?.regular || it.urls?.full} 
                                alt={it.alt_description || "Unsplash Photo"}
                                className='w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105'
                                loading="lazy"
                            />
                        </div>
                        <div className="p-3 flex items-center justify-between border-t-2">
                            <div className="flex items-center gap-2 truncate pr-2">
                                {it.user?.profile_image?.small && (
                                    <img 
                                        src={it.user.profile_image.small} 
                                        alt={it.user.name} 
                                        className="w-7 h-7 rounded-full border border-black/10 dark:border-white/10" 
                                        loading="lazy"
                                    />
                                )}
                                <span className="text-sm font-semibold truncate">{it.user?.name || 'Unsplash'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-black/5 dark:bg-white/10 rounded-full whitespace-nowrap">
                                <span className="text-red-500">♥</span>
                                <span>{it.likes || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {pLen > photoArr.length && <div className='flex flex-row justify-center mt-3'>
                <button className='text-xl p-3 border border-b-3 rounded-[15px]' onClick={() => handlePage()} disabled={load}>Load More</button>
            </div>}

        </div>
    );
};