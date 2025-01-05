
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
        // Convert file to buffer
        const data = await req.formData();
          const file = await data.get("file");
          const fileBuffer = await file.arrayBuffer();
        
          var mime = image.type; 
          var encoding = 'base64'; 
          var base64Data = Buffer.from(fileBuffer).toString('base64');
          var fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

        // Upload to Cloudinary
        

         const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {

          var result = cloudinary.uploader.upload(fileUri, {
            invalidate: true,
              folder: "posts"
          })
            .then((result) => {
              console.log(result);
              resolve(result);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
      });
    };

    const result = await uploadToCloudinary();
        const mediaUrl = result.secure_url;

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
