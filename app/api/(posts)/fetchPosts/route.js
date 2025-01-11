import connectMongoDB from "@/libs/db";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";
import Post from "@/models/postSchema";

export async function GET() {
    await connectMongoDB();



    const posts = await Post.aggregate([
        {
            $lookup: {
                from: "users", // The name of the User collection
                localField: "email", // The field in Post schema
                foreignField: "email", // The field in User schema
                as: "user", // The field name to store the resulting User data
            },
        },
        {
            $unwind: "$user", // Flatten the array to an object (if a match is found)
        },
        {
            $project: {
                _id: 1,
                email: 1,
                content: 1,
                media: 1,
                likes: 1,
                shares: 1,
                visibility: 1,
                isEdited: 1,
                comments: 1,
                createdAt: 1,
                "user._id": 1,
                "user.fname": 1, // Include only the name field from the User collection
                "user.lname": 1, // Include only the name field from the User collection
                "user.avatar": 1, // Include only the avatar field from the User collection
            },
        },
    ]).sort({ dateCreated: -1 });

    return NextResponse.json({ message: "Fetched All Posts", posts: posts }, { status: 200 });
}