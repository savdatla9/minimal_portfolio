// app/api/contact/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function PUT(req, { params }) {
  try {
    const { id } = params || {};

    console.log('id -->', id);
    
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { isDone } = body;
    if (typeof isDone !== "boolean") {
      return NextResponse.json({ error: "isDone must be boolean" }, { status: 400 });
    }

    const ref = doc(db, "messages", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    await updateDoc(ref, { isDone });
    return NextResponse.json({ id, isDone, updated: true }, { status: 200 });
  } catch (e) {
    console.error("PUT /api/contact/[id] error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}