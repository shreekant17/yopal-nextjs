import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "@/libs/jwt";
import Post from "@/models/postSchema";
import connectMongoDB from "@/libs/db";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    try {
        // Convert file to base64 string
        const base64String = await file.arrayBuffer().then((buffer) =>
            Buffer.from(buffer).toString("base64")
        );

        // Upload to Cloudinary (using base64 string)
        const uploadResponse = await cloudinary.uploader.upload(
            `data:${file.type};base64,${base64String}`,
            { folder: "posts" }
        );

        // Extract uploaded file URL
        const mediaUrl = uploadResponse.secure_url;

        // Token verification and database save (optional)
        const token = formData.get("token");
        if (token) {
            const user = verifyToken(token);
            const email = user.email;
            const content = formData.get("content");
            const type = formData.get("type");

            const post = {
                email: email,
                content: content,
                type: type,
                media: mediaUrl,
            };

            await connectMongoDB();
            await Post.create(post);
        }

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
