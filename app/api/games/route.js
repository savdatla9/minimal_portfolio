'use server'

import { db } from "@/lib/firebase";
// import { NextResponse } from "next/server";
import { addDoc, getDocs, collection } from "firebase/firestore";

export async function GET(req, res) {
    const querySnap = await getDocs(collection(db, 'games'));
  
    const gArr = querySnap.docs.map((doc) => ({
        id: doc.id, ...doc.data(),
    }));

    return res.status(200).json({ 
        message: 'Games List', 
        games: gArr, 
        length: gArr.length
    });
};

export async function POST(request, res)  {
    const body = await request.json();

    if(body.name===''){
        return res.status(400).json({ error: 'Enter Game Name' });
    }else if(body.highscore<0){
        return res.status(400).json({ error: 'Enter Valid Game Highscore' });
    }else if(body.views<0){
        return res.status(400).json({ error: 'Enter Valid Game Views' });
    };

    const docRef = await addDoc(collection(db, "games"), {
        name: body.name,  highscore: body.highscore,
        views: body.views, 
    });

    return res.status(201).json({ message: 'New Game Created', game_id: docRef.id });
};