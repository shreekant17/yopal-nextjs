import connectMongoDB from "@/libs/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Message from "@/models/messageSchema";
import { db } from "@/libs/firestore"; // Adjust path as necessary
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
    try {
        const data = await req.formData();
        const sender = data.get("sender");
        const receiver = data.get("receiver");
        const text = data.get("text");

        if (!sender || !receiver) {
            return NextResponse.json({ error: "User IDs are required" }, { status: 400 });
        }

        // Save message in MongoDB
        await connectMongoDB();
        const message = { sender, receiver, text };
        await Message.create(message);

        // Save message in Firestore
        const messageRef = collection(db, "messages");
        await addDoc(messageRef, {
            sender,
            receiver,
            text,
            timestamp: new Date().toISOString(), // Add a timestamp for sorting
        });

        return NextResponse.json({ message: "Message Sent" }, { status: 200 });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
