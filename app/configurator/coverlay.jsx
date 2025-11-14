'use client'

import { HexColorPicker } from 'react-colorful';
import { AiFillCamera } from 'react-icons/ai';
import { useSnapshot } from "valtio";
import { useState } from 'react';

import { state } from "./store";

export default function COverlay() {
    const snap = useSnapshot(state);

    const clArr = [ 'cap', 'plastic' ];

    const [select, setSelect] = useState(null);

    const handleSelect = (body) => {
        setSelect(body); 
    };

    const handleColor = (e) => {
        state[select] = e;
    };

    const handleSnapShot = () => {
        const link = document.createElement('a');
        link.setAttribute('download', 'cap.png');
        link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'));
        link.click();
    };

    return (
        <>
            <div className="flex flex-wrap justify-center items-end gap-3 z-10 w-25" style={{ position: 'absolute', top: '25%', right: '5%' }}>
                {clArr.map((it, idx) => <div 
                    onClick={() => handleSelect(it)} key={idx}
                    className='border border-b-3 p-1 rounded-md text-center font-normal text-sm uppercase'
                >
                    {it}
                </div>)}

                <button
                    // className="share btn"
                    className='border border-b-3 p-1 rounded-md text-center uppercase'
                    onClick={handleSnapShot}
                >
                    <AiFillCamera size="1.25rem" />
                </button>
            </div>

            {select!==null && <div style={{position: 'absolute', bottom: '5%'}}> 
                <HexColorPicker color={snap[select]} onChange={handleColor} /> 
            </div>}
        </>
    );
};