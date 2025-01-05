import cloudinary from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// The POST method will handle the file upload
export async function POST(request) {
    const formData = await request.formData();
    const file = formData.get('file');
    return NextResponse.json({ cloudname: process.env.CLOUDINARY_CLOUD_NAME }, { status: 200 });
    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the file to Cloudinary
    try {
        const result = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer); // End the stream with the file buffer
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
