'use server'

import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { 
    addDoc, getDocs,
    collection, serverTimestamp 
} from "firebase/firestore";

export async function GET() {
    const querySnap = await getDocs(collection(db, 'messages'));
  
    const mArr = querySnap.docs.map((doc) => ({
        id: doc.id, ...doc.data(),
    }));

    return NextResponse.json({ 
        message: 'Mails received', messages: mArr, 
        length: mArr.length, status: 200 
    });
};

export async function POST(request)  {
    const body = await request.json();

    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
    };

    if(body.name===''){
        return NextResponse.json({ error: 'Enter your Name', status: 400 });
    }else if(body.email===''){
        return NextResponse.json({ error: 'Enter your Email', status: 400 });
    }else if(isEmail(body.email)===false){
        return NextResponse.json({ error: 'Enter valid Email', status: 400 });
    }else if(body.message===''){
        return NextResponse.json({ error: 'Enter your Message', status: 400 });
    };

    const docRef = await addDoc(collection(db, "messages"), {
        name: body.name,  email: body.email,
        message: body.message, isDone: false,
        createdAt: serverTimestamp(),
    });

    return NextResponse.json({ message: 'Mail Sent', mail_id: docRef.id, status: 201 });
};