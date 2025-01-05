import fs from "fs";
import path from "path";
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
        // Save file temporarily in Vercel's writable /tmp directory
        const tempDir = "/tmp"; // Writable directory in Vercel
        const tempFilePath = path.join(tempDir, file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(tempFilePath, buffer);

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(tempFilePath, {
            folder: "posts",
            use_filename: true,
            unique_filename: false,
            resource_type: "auto",
        });


        // Extract uploaded file URL
        const mediaUrl = uploadResponse.secure_url;

        // Delete temporary file
        fs.unlinkSync(tempFilePath);

        // Handle token verification and save post details
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

        return NextResponse.json({ Message: "Success", mediaUrl: mediaUrl, status: 201 });
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ Message: "Failed", error, key = process.env.CLOUDINARY_API_KEY, status: 500 });
    }
};
