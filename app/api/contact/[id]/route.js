'use server'

import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
// import { doc, collection, updateDoc } from "firebase/firestore"; 

export async function PUT(req){
    noStore();

    const url = new URL(req.url);
  
    const id = url.searchParams.get("id"); // ✅ when using ?id=...
  
    if (!id) return NextResponse.json({ error: "Missing id", status: 400 });

    try{
        await db.collection("messages").doc(id).set(body, { merge: true });
        
        const updated = await db.collection("messages").doc(id).get();
        
        // return NextResponse.json({ ok: true, data: { id: updated.id, ...updated.data() } });

        return NextResponse.json({ message: 'Mail Trashed', id: updated, status: 204, param: id });
    }catch(err){
        return NextResponse.json({ error: err, status: 400, param: id, data: body });
    }; 
};  