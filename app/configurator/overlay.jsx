'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { AiFillCamera } from 'react-icons/ai';
import { useSnapshot } from 'valtio';

import { state } from './store';

export default function Overlay() {
    const snap = useSnapshot(state);

    const transition = { type: 'spring', duration: 0.8 };
    
    const config = {
        initial: { x: -100, opacity: 0, transition: { ...transition, delay: 0.5 } },
        animate: { x: 0, opacity: 1, transition: { ...transition, delay: 0 } },
        exit: { x: -100, opacity: 0, transition: { ...transition, delay: 0 } },
    };

    return (
        <div style={{ position: 'relative', top: 0, left: 0, width: '100%', height: '100%' }}>
            <AnimatePresence>
                <motion.section key="custom" className='setss' {...config}>
                    <Customizer />
                </motion.section>
            </AnimatePresence>
        </div>
    );
};

function Customizer() {
    const snap = useSnapshot(state);

    const handleSnapShot = () => {
        const link = document.createElement('a');
        link.setAttribute('download', 'shirt.png');
        link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'));
        link.click();
    };

    return (
        <div className="customizer">
            <div className="color-options">
                {snap.colors.map((color) => (
                    <div key={color} className={`circle`} style={{ background: color }} onClick={() => (state.color = color)}></div>
                ))}
            </div>
            
            <div className="decals">
                <div className="decals--container">
                    {snap.decals.map((decal) => (
                        <div key={decal} className={`decal`} onClick={() => (state.decal = decal)}>
                            <img src={decal + '_thumb.png'} alt="brand" />
                        </div>
                    ))}
                </div>
            </div>
            
            <button
                className="share btn"
                onClick={handleSnapShot}
            >
                <AiFillCamera size="1.3em" />
            </button>
        </div>
    );
};