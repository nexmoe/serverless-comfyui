'use client'

import { MainForm } from './components/MainForm'

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* 顶部标题区 */}
			<header className="pt-8 pb-6 px-4">
				<div className="max-w-3xl mx-auto text-center space-y-3">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
						AI 动漫头像魔法师
					</h1>
					<p className="text-lg text-gray-600">看看你的头像在宫崎骏动漫里会是什么样</p>
					<p className="text-sm text-blue-600 font-medium flex items-center justify-center">
						<span className="mr-2">✨</span>
						首个基于家用闲置 3090 显卡的 AI 头像生成服务
					</p>
					<div className="inline-flex items-center justify-center gap-4 text-xs bg-white px-6 py-2 rounded-full shadow-sm">
						<span className="flex items-center text-green-600">
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
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							节能环保
						</span>
						<span className="flex items-center text-blue-600">
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
									d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
								/>
							</svg>
							分布式节点
						</span>
						<span className="flex items-center text-purple-600">
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
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
							智能调度系统
						</span>
					</div>
				</div>
			</header>
			<main className="container mx-auto px-4 py-6">
				<MainForm />
			</main>
		</div>
	)
}
