'use client'

import { sendGAEvent } from '@next/third-parties/google'

interface ResultDisplayProps {
    imageUrl: string
    platform: string
    generateShareImage: () => void
    generatingShare: boolean
    isDesktop?: boolean
}

export function ResultDisplay({
    imageUrl,
    platform,
    generateShareImage,
    generatingShare,
    isDesktop = false
}: ResultDisplayProps) {
    const containerClass = isDesktop ? "hidden lg:block lg:col-span-3" : "block lg:hidden"
    return (
        <div className={containerClass}>
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col items-center space-y-4">
                    {imageUrl ? (
                        <>
                            <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                                <img
                                    src={imageUrl}
                                    alt="AI 处理后的头像"
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        const link = document.createElement('a')
                                        link.href = imageUrl
                                        link.download = 'ai-avatar.png'
                                        link.click()
                                        // Track download event
                                        sendGAEvent('event', 'download', { platform })
                                        window.umami?.track('download', { platform })
                                    }}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-500 hover:text-blue-600 transition-colors flex items-center hover:bg-gray-50"
                                >
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    下载图片
                                </button>
                                <button
                                    onClick={generateShareImage}
                                    disabled={generatingShare}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-500 hover:text-blue-600 transition-colors flex items-center hover:bg-gray-50 disabled:text-gray-400 disabled:hover:text-gray-400"
                                >
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                        />
                                    </svg>
                                    {generatingShare ? '生成中...' : '分享'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                            <div className="text-center p-4">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="mt-2 text-sm text-gray-400">
                                    等待处理的图片将在这里显示
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 