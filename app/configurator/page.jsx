'use client'

import { useSnapshot } from "valtio";
import { StepBack, StepForward } from 'lucide-react';

import { CanvasItem } from "./canvas";
import COverlay from './coverlay';
import { Cap } from './ccanvas';
import SOverlay from './soverlay';
import { Shoe } from './scanvas';
import Overlay from "./overlay";
import { state } from "./store";

import './index.css';
import { useState } from "react";

export default function configurator(){
    const snap = useSnapshot(state);

    const [idx, setIdx] = useState(0)
    const cArr = ['shirt', 'cap', 'shoe'];

    const handleBack = (indx) => {
        if(indx>0){
            setIdx(indx);

            state.title = cArr[indx];
        }else{
            setIdx(0);

            state.title = cArr[0];
        };
    };

    const handleMove = (indx) => {
        if(indx<cArr.length){
            setIdx(indx);

            state.title = cArr[indx];
        }else{
            setIdx(cArr.length-1);

            state.title = cArr[cArr.length-1];
        };
    };

    return(
        <>
            <div className="font-semibold text-3xl flex justify-center items-center p-2 uppercase gap-3"> 
                {idx>0 && <p onClick={()=>handleBack(idx-1)}> <StepBack /> </p>}
                    {snap.title} 
                {idx<cArr.length-1 && <p onClick={()=>handleMove(idx+1)}> <StepForward /> </p>} 
            </div>

            {snap.title === 'shirt' && <div className="border border-b-3 rounded-xl h-[40vh]">
                <CanvasItem />

                <Overlay />
            </div>}

            {snap.title === 'shoe' && <div className="border border-b-3 rounded-xl h-[50vh] bg-[#33333350] dark:bg-[#ffffff50]">
                <Shoe />

                <SOverlay />
            </div>}

            {snap.title === 'cap' && <div className="border border-b-3 rounded-xl h-[50vh] bg-[#33333350] dark:bg-[#ffffff50]">
                <Cap />

                <COverlay />
            </div>}
        </>
    );
};