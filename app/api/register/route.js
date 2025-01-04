import connectMongoDB from "@/libs/db";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        const userData = await req.json();

        if (!userData.name || !userData.email || !userData.password || !userData.country) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Check if the email is already in use
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already in use" },
                { status: 400 }
            );
        }

        // Create new user
        const newUser = await User.create(userData);

        return NextResponse.json(
            { message: "Account created successfully", userId: newUser._id },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
