'use client'

export function TechnicalSupport() {
    return (
        <div className="p-6">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                    <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                    </svg>
                    <span className="font-medium text-gray-700">
                        <a
                            className="text-blue-500 underline"
                            href="https://www.gongjiyun.com/"
                            target="_blank"
                        >
                            共绩算力
                        </a>
                        提供技术支持
                    </span>
                </div>

                {/* 资源利用统计 */}
                <div className="grid grid-cols-3 gap-4 py-3">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">1000+</div>
                        <div className="text-xs text-gray-500">闲置电脑</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">85%</div>
                        <div className="text-xs text-gray-500">资源利用率</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">24h</div>
                        <div className="text-xs text-gray-500">全天在线</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                        新一代分布式 GPU 计算平台，通过整合闲置家用电脑算力，为 AI
                        应用提供高性能支持
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                            节能环保
                        </span>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                            资源共享
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">
                            算力智能调度
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
} 