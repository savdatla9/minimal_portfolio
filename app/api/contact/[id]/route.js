'use server'

import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore"; 

export async function PUT(req){
  const { id } = req.query;

  const gameRef = doc(db, 'messages', id);

  if (!id) return NextResponse.json({ error: "Missing id", status: 400 });

  try {
    const { isDone } = req.body;

    await updateDoc(gameRef, { isDone });

    return NextResponse.json({ message: 'Mail Trashed', status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating game', status: 500, data: [] });
  };
};  