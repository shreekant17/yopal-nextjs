import connectMongoDB from "@/libs/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Post from "@/models/postSchema";
import Message from "@/models/messageSchema";

export async function POST(req) {
    try {

        const data = await req.formData();
        const sender = data.get("sender")
        const receiver = data.get("receiver")
        const text = data.get("text")

        if (!sender || !receiver) {
            return NextResponse.json({ error: "User IDs is required" }, { status: 400 });
        }

        await connectMongoDB();

        // Convert userId to ObjectId
        //sender = new mongoose.Types.ObjectId(sender);
        //receiver = new mongoose.Types.ObjectId(receiver);

        const message = {
            sender: sender,
            receiver: receiver,
            text: text
        }

        await Message.create(message);



        return NextResponse.json({ message: "Message Sent" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
