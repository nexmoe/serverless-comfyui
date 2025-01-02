'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { sendGAEvent } from '@next/third-parties/google'
import { use } from 'react'
import { useSearchParams } from 'next/navigation'

interface PageProps {
	params: Promise<{
		id: string
	}>
}

export default function Page({ params }: PageProps) {
	const { id } = use(params)
	const searchParams = useSearchParams()
	useEffect(() => {
		const from = searchParams.get('from')
		if (from === 'qrcode') {
			sendGAEvent('event', 'from_qrcode_scan', { id })
			setTimeout(() => {
				window.umami?.track('from_qrcode_scan', {
					id,
				})
			}, 100)
		}
	}, [id, searchParams])
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<header className="pt-8 pb-6 px-4">
				<div className="max-w-3xl mx-auto text-center space-y-3">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
						查看原图
					</h1>
					<p className="text-lg text-gray-600">这是生成的原始图片，您可以下载或返回首页继续创作</p>
				</div>
			</header>

			<main className="container mx-auto px-4 py-6">
				<div className="max-w-2xl mx-auto">
					<img
						width={512}
						height={512}
						src={`https://hadoop.102417.xyz/uploads/${id}`}
						alt="Generated Image"
						className="w-full h-auto object-cover rounded-2xl shadow-lg overflow-hidden"
					/>
					<div className="p-6">
						<div className="flex items-center justify-center space-x-4">
							<Link
								href="/"
								className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 transition-colors duration-200"
							>
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
								生成你的动漫图片
							</Link>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
