'use client'

import { sendGAEvent } from '@next/third-parties/google'
interface ShareModalProps {
    showShareModal: boolean
    setShowShareModal: (show: boolean) => void
    shareImageUrl: string
    platform: string
}

export function ShareModal({ showShareModal, setShowShareModal, shareImageUrl, platform }: ShareModalProps) {
    if (!showShareModal) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">分享图片</h3>
                        <button
                            onClick={() => setShowShareModal(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="relative">
                        <img
                            src={shareImageUrl}
                            alt="分享图片"
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="text-center text-sm md:hidden text-gray-500">微信里长按图片“转发给朋友”</div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => {
                                const link = document.createElement('a')
                                link.href = shareImageUrl
                                link.download = 'anime-avatar-share.png'
                                link.click()
                                // Track download event
                                sendGAEvent('event', 'share_download', { platform })
                                window.umami?.track('share_download', { platform })
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            保存图片
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 