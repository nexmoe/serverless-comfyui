import promptob from './prompt.json';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 定义支持的平台类型
type Platform = 'qq' | 'github' | 'x' | 'upload';

// 导入 AWS S3 相关依赖
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

// 初始化 S3 客户端
const S3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

/**
 * 获取 S3 预签名上传 URL
 * @param s3Key - 文件在 S3 中的键值
 * @returns 包含 s3Key 和预签名 URL 的对象
 */
async function getS3PreSignUrl(s3Key: string) {
    const bucket = process.env.R2_BUCKET!;
    const url = await getSignedUrl(
        S3,
        new PutObjectCommand({ Bucket: bucket, Key: s3Key }),
    );
    return { s3Key, url };
}

/**
 * 根据平台和用户名获取头像 URL
 * @param platform - 平台类型（qq/github/x/upload）
 * @param username - 用户名或 QQ 号
 * @returns 头像 URL
 */
function getAvatarUrl(platform: Platform, username: string): string {
    switch (platform) {
        case 'qq':
            return `https://q1.qlogo.cn/g?b=qq&nk=${username}&s=640`;
        case 'github':
            return `https://unavatar.io/github/${username}`;
        case 'x':
            return `https://unavatar.io/twitter/${username}`;
        case 'upload':
            return username; // 对于上传类型，username 即为 S3 URL
        default:
            throw new Error('不支持的平台');
    }
}

/**
 * GET 请求处理函数
 * 根据平台和用户名获取并处理头像
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const platform = (searchParams.get('platform') || 'qq') as Platform;
    const username = searchParams.get('username') || searchParams.get('qq');

    if (!username) {
        return NextResponse.json(
            { error: '缺少用户名参数' },
            { status: 400 }
        );
    }

    try {
        const avatarUrl = getAvatarUrl(platform, username);
        const imageBase64 = await generateImage(avatarUrl);
        // 从 base64 中提取实际的图片数据
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // 返回处理后的图片，设置缓存和类型头
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: '处理图片时出错' },
            { status: 500 }
        );
    }
}

// 错误日志条目接口
interface LogEntry {
    timestamp: string;
    requestUrl: string;
    error: {
        status: number;
        statusText: string;
        responseHeaders?: Record<string, string>;
        responseBody?: unknown;
    };
}

/**
 * 使用 ComfyUI 生成图片
 * @param imageUrl - 输入图片的 URL
 * @returns Promise<string> - base64 格式的生成图片
 */
async function generateImage(imageUrl: string) {
    // 克隆 prompt 模板并设置输入图片
    const promptData = { ...promptob };
    promptData.prompt["30"].inputs.image = imageUrl;

    // 调用 ComfyUI API
    const url = `${process.env.GONGJI_ENDPOINT}/prompt`;
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(promptData)
    };

    const response = await fetch(url, options);
    const data = await response.json();

    // 错误处理和日志记录
    if (response.status !== 200) {
        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            requestUrl: process.env.GONGJI_ENDPOINT + '/prompt',
            error: {
                status: response.status,
                statusText: response.statusText,
                responseHeaders: Object.fromEntries(response.headers.entries()),
                responseBody: data
            }
        };

        await writeLogToFile(logEntry);
        throw new Error(response.statusText);
    }

    // 返回生成的图片
    if (data.images && data.images.length > 0) {
        return data.images[0];  // 返回 base64 格式图片
    } else {
        throw new Error('没有返回有效的图片数据');
    }
}

/**
 * 将错误日志写入文件
 * @param logEntry - 日志条目
 */
async function writeLogToFile(logEntry: LogEntry) {
    try {
        const logDir = path.join(process.cwd(), 'logs');
        const logFile = path.join(logDir, 'error-logs.json');

        // 确保日志目录存在
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        // 读取现有日志
        let logs: LogEntry[] = [];
        if (fs.existsSync(logFile)) {
            const content = fs.readFileSync(logFile, 'utf8');
            logs = JSON.parse(content);
        }

        // 添加新日志并写入文件
        logs.push(logEntry);
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error('写入错误日志失败：', error);
    }
}

/**
 * POST 请求处理函数
 * 获取 S3 预签名上传 URL
 */
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const key = data.key;

        if (!key) {
            return NextResponse.json(
                { error: '缺少文件名' },
                { status: 400 }
            );
        }

        const s3Key = `${key}`;
        const { url } = await getS3PreSignUrl(s3Key);

        return NextResponse.json({
            uploadUrl: url,
            s3Key: s3Key
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: '生成上传链接失败' },
            { status: 500 }
        );
    }
}
