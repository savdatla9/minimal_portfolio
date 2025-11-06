'use client'

import React from 'react';
import axios from 'axios';

export default function Unsplash(){
    const [order_by, setOBy] = React.useState('views');
    const [orient, setOrient] = React.useState('portrait');

    React.useEffect(()=>{
        axios.get(`/api/unsplash/photos?&per_page=20&order_by=${order_by}&orientation=${orient}`)
        .then((res) => { console.log(res) })
        .catch((err) => { console.log(err) });
    }, []);

    return(
        <div>
            <h2>UnSplash</h2>
        </div>
    );
};