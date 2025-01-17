import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { generateImage } from '../route';

// 初始化 S3 客户端
const S3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: Request) {
    try {
        // 获取上传的文件
        const formData = await request.formData();
        const file = formData.get('image') as File;
        
        if (!file) {
            return NextResponse.json(
                { error: '请上传图片文件' },
                { status: 400 }
            );
        }

        // 生成唯一的文件名
        const timestamp = Date.now();
        const filename = `one/${timestamp}-${file.name}`;
        const bucket = process.env.R2_BUCKET!;

        // 将文件上传到 S3
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log(bucket)

        await S3.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: filename,
                Body: buffer,
                ContentType: file.type,
            })
        );

        // 构建 S3 URL
        const s3Url = `${process.env.R2_PUBLIC_ENDPOINT}/${filename}`;

        // 使用 generateImage 处理图片
        const imageBase64 = await generateImage(s3Url);
        // 从 base64 中提取实际的图片数据
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        return NextResponse.json(
            { te: '处理图片时出错', image: imageBase64 },
        );
        // 返回处理后的图片，设置缓存和类型头
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000',
            },
        });

    } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json(
            { error: '处理图片时出错' },
            { status: 500 }
        );
    }
}
