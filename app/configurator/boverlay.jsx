'use client'

import { AiFillCamera } from 'react-icons/ai';
import { useSnapshot } from "valtio";

import { state } from "./store";

export default function BOverlay() {
    const snap = useSnapshot(state);

    const handleSnapShot = () => {
        const link = document.createElement('a');
        link.setAttribute('download', 'beanBag.png');
        link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'));
        link.click();
    };

    return (
        <>
            <div className="flex flex-wrap justify-center items-end gap-3 z-10 w-25" style={{ position: 'absolute', top: '25%', right: '5%' }}>
                <div className="decals pt-2 z-20">
                    <div className='flex flex-wrap justify-center gap-2.5'>
                        {snap.bean.map((decal, idx) => (
                            <div key={idx} className='decal' onClick={() => (state.beanbag = decal)}>
                                <img src={'/' + decal + '.png'} alt="brand" className='rounded-2xl' />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className='border border-b-3 p-1 rounded-md text-center uppercase'
                    onClick={handleSnapShot}
                >
                    <AiFillCamera size="1.25rem" />
                </button>
            </div>
        </>
    );
};