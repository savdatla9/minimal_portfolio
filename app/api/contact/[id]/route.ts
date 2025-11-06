'use server'

import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";

export async function PUT(req: Request, { params }: { params: { id: string } })  {
    const id = params.id;
    const data = await req.json();

    const ref = doc(db, "items", id);
    const res = await updateDoc(ref, data);
    // const snap = await getDoc(ref);

    return NextResponse.json({ message: 'Mail Trashed', test: res, status: 204 });
};