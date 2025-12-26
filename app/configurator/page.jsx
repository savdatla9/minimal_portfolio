'use client'

import { useState } from "react";
import { useSnapshot } from "valtio";
import { StepBack, StepForward } from 'lucide-react';

import { CanvasItem } from "./canvas";
import COverlay from './coverlay';
import { Cap } from './ccanvas';
import CeOverlay from './ceoverlay';
import { Cup } from './cecanvas';
import SOverlay from './soverlay';
import { Shoe } from './scanvas';
import Overlay from "./overlay";
import { BeanBag } from "./bcanvas";
import BOverlay from "./boverlay";

import { state } from "./store";

import './index.css';

export default function configurator(){
    const snap = useSnapshot(state);

    const [idx, setIdx] = useState(0)
    const cArr = ['shirt', 'cap', 'shoe', 'cup', 'beanbag', ];

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

            {snap.title === 'shirt' && <div className="border border-b-3 rounded-xl h-[40vh] bg-[#33333350] dark:bg-[#ffffff50]">
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

            {snap.title === 'cup' && <div className="border border-b-3 rounded-xl h-[50vh] bg-[#33333350] dark:bg-[#ffffff50]">
                <Cup />

                <CeOverlay />
            </div>}

            {snap.title === 'beanbag' && <div className="border border-b-3 rounded-xl h-[50vh] bg-[#33333350] dark:bg-[#ffffff50]">
                <BeanBag />

                <BOverlay />
            </div>}

            {snap.title === '' && <div className="flex justify-center items-center h-[50vh]">
                <p className="text-2xl font-semibold"> Select a product to customize </p>
            </div>}
        </>
    );
};