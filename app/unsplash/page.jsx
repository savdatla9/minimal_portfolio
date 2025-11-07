'use client'

import React from 'react';
import axios from 'axios';
import { ImagePlay, ImageDown, Smartphone,  } from 'lucide-react';

import { unsplashConfig } from '@/lib/firebase';

export default function Unsplash(){
    const [photoArr, setPArr] = React.useState([]);
    const [order_by, setOBy] = React.useState('views');
    // const [orient, setOrient] = React.useState('landscape');

    const { url, user_name, public_key } = unsplashConfig;

    React.useEffect(()=>{
        axios.get(`${url}users/${user_name}/photos?client_id=${public_key}&per_page=20&order_by=${order_by}`)
        .then((res) => { console.log(res.data); setPArr(res.data) })
        .catch((err) => { console.log(err) });
    }, [order_by]);

    const changeOrder = () => {
        setOBy(order_by === 'views' ? 'downloads' : 'views');
    };

    // const changeOrientation = () => {
    //     setOrient(orient === 'landscape' ? 'portrait' : 'landscape');
    // }; 

    return(
        <div>
            <h2 className='flex flex-row flex-wrap justify-center gap-6 p-4'> 
                <div className='text-2xl -mt-1 font-semibold cursor-default'>UnSplash</div> 
            
                <div onClick={changeOrder}>{order_by==='views' ? <ImageDown /> : <ImagePlay />}</div> 
                {/* <div onClick={changeOrientation}>{orient==='portrait' ? <Smartphone /> : <Smartphone className='rotate-90' />}</div>  */}
            </h2>

            <div className='flex flex-wrap gap-2'>
                {photoArr.map((it) => <div key={it.id} className='rounded-[15px]'>
                    <img src={it.urls.full} className='w-[250px] h-auto p-0.5 border-2 border-b-6 rounded-[15px]' />
                </div>)}
            </div>

        </div>
    );
};