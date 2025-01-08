import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "@/libs/jwt";
import connectMongoDB from "@/libs/db";
import User from "@/models/userSchema";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const POST = async (req) => {
    try {
        const data = await req.formData();

        // Validate file
        const image = data.get("file");
        if (!image) {
            return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
        }

        // Convert file to Base64
        const fileBuffer = await image.arrayBuffer();
        const fileUri = `data:${image.type};base64,${Buffer.from(fileBuffer).toString("base64")}`;

        // Validate token
        const token = data.get("token");
        const user = verifyToken(token);
        if (!user) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: "avatars",
            invalidate: true,
        });

        const imageUrl = result.secure_url;

        // Validate required fields
        const requiredFields = ["id", "email", "fname", "lname", "country"];
        for (const field of requiredFields) {
            if (!data.get(field)) {
                return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 });
            }
        }

        // Update user in MongoDB
        const id = data.get("id");
        await connectMongoDB();

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        existingUser.fname = data.get("fname");
        existingUser.lname = data.get("lname");
        existingUser.email = data.get("email");
        existingUser.avatar = imageUrl;
        existingUser.country = data.get("country");

        await existingUser.save();

        return NextResponse.json({ success: true, data: { imageUrl } }, { status: 200 });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
};
