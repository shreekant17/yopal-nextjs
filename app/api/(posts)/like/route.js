import Post from "@/models/postSchema";
import { NextResponse } from "next/server";
import { verifyToken } from "@/libs/jwt";
import { cookies } from "next/headers";

export const POST = async (req) => {
    try {
        const { postId } = await req.json();

        const cookieStore = await cookies();
        const token = cookieStore.get("token").value;

        if (!postId || !token) {
            return NextResponse.json({ message: "Invalid input" }, { status: 400 });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({ message: "Post not found." }, { status: 404 });
        }

        const user = await verifyToken(token);
        const userId = user.userId;

        // Check if the user has already liked the post
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            // Add like if not already liked
            post.likes.push(userId);
        } else {
            // Remove like if already liked
            post.likes.splice(likeIndex, 1);
        }

        // Save the updated post
        await post.save();

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (err) {
        console.error("Error in liking post:", err);
        return NextResponse.json({ message: "Failed" }, { status: 500 });
    }
};
