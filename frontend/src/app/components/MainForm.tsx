'use client'

import { useState } from 'react'
import { sendGAEvent } from '@next/third-parties/google'
import { LoadingSpinner } from './LoadingSpinner'
import { PlatformSelector } from './PlatformSelector'
import { ImageUploader } from './ImageUploader'
import { ResultDisplay } from './ResultDisplay'
import { ShareModal } from './ShareModal'
import { TechnicalSupport } from './TechnicalSupport'
import QRCode from 'qrcode'

type Platform = 'qq' | 'github' | 'x' | 'upload'

export function MainForm() {
	const [platform, setPlatform] = useState<Platform>('upload')
	const [username, setUsername] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [loadingStage, setLoadingStage] = useState('')
	const [generatingShare, setGeneratingShare] = useState(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [shareImageUrl, setShareImageUrl] = useState<string>('')
	const [showShareModal, setShowShareModal] = useState(false)
	const [uniqueId, setUniqueId] = useState('')
	const uploadFile = async (file: File, uniqueId: string) => {
		console.log('uploadFile', file.name, uniqueId)
		
		const response = await fetch('/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				key: `uploads/${uniqueId}`,
			}),
		})

		if (!response.ok) {
			throw new Error('获取上传链接失败')
		}

		const { uploadUrl, s3Key, publicUrl } = await response.json()
		console.log('uploadUrl', uploadUrl)

		const uploadResponse = await fetch(uploadUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': file.type,
			},
			body: file,
		})

		if (uploadResponse.ok) {
			console.log('File uploaded successfully!')
		} else {
			console.error('Failed to upload file.')
		}
		console.log('s3Key', s3Key)

		return publicUrl
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const tempId = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 15)
		setUniqueId(tempId)
		if (platform === 'upload') {
			if (!selectedFile) {
				setError('请选择要上传的图片')
				return
			}
		} else if (!username) {
			setError('请输入用户名')
			return
		}

		sendGAEvent('event', 'generation_start', { platform })
		window.umami?.track('generation_start', {
			platform,
		})
		setLoading(true)
		setError('')
		setImageUrl('')

		try {
			let finalUsername = username
			if (platform === 'upload') {
				setLoadingStage('📤 正在上传图片...')
				finalUsername = await uploadFile(selectedFile!, tempId)
			}

			setLoadingStage('🤖 AI 正在处理头像...')
			const timeStart = Date.now()
			const response = await fetch(`/api?platform=${platform}&username=${finalUsername}`)
			const timeEnd = Date.now()
			if (!response.ok) {
				sendGAEvent('event', 'ai_error', { platform })
				window.umami?.track('ai_error', {
					platform,
				})
				throw new Error('处理失败')
			}

			setLoadingStage('🎉 生成成功，准备展示图片...')
			const blob = await response.blob()
			const url = URL.createObjectURL(blob)
			setLoadingStage('🎉 处理完成！')
			setImageUrl(url)
			const timeElapsed = ((timeEnd - timeStart) / 1000).toFixed(0)
			console.log('处理时间：', timeElapsed, '秒')

			sendGAEvent('event', 'generation_success', { platform, timeElapsed })
			window.umami?.track('generation_success', {
				platform,
				timeElapsed,
			})
		} catch {
			setError('处理图片时出错，请尝试重试')
			sendGAEvent('event', 'generation_error', { platform })
			window.umami?.track('generation_error', {
				platform,
			})
		} finally {
			setLoading(false)
			setLoadingStage('')
		}
	}

	const generateShareImage = async () => {
		if (!imageUrl) return

		setGeneratingShare(true)
		sendGAEvent('event', 'share_start', { platform })
		window.umami?.track('share_start', {
			platform,
		})
		try {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			if (!ctx) throw new Error('无法创建 canvas context')

			const img = new Image()
			img.crossOrigin = 'anonymous'
			await new Promise((resolve, reject) => {
				img.onload = resolve
				img.onerror = reject
				img.src = imageUrl
			})

			const qrSize = 150
			const padding = 20
			const descriptionHeight = 60
			canvas.width = img.width
			canvas.height = img.height + qrSize + padding * 3

			ctx.drawImage(img, 0, 0)

			ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
			ctx.fillRect(0, img.height, canvas.width, qrSize + padding * 3 + descriptionHeight)

			ctx.fillStyle = '#444444'
			ctx.font = '32px Arial'
			ctx.textAlign = 'left'
			ctx.fillText('我的宫崎骏动漫形象，扫码看原图 👉', 64, img.height + padding + 70)

			ctx.font = '24px Arial'
			ctx.fillStyle = '#888888'
			ctx.textAlign = 'left'
			ctx.fillText('首个基于家用闲置算力的 AI 头像生成服务', 64, img.height + padding + 120)
			console.log('uniqueId', uniqueId)
			// 生成二维码
			const qrCodeDataUrl = await QRCode.toDataURL(platform === 'upload' ? `https://hadoop.nexmoe.com/origin/${uniqueId}?from=qrcode` : 	`https://hadoop.nexmoe.com/?from=qrcode`, {
				width: 150,
				margin: 0,
				color: {
					dark: '#444444',
					light: '#ffffff'
				}
			})
			const qrImg = new Image()
			qrImg.crossOrigin = 'anonymous'
			await new Promise((resolve, reject) => {
				qrImg.onload = resolve
				qrImg.onerror = reject
				qrImg.src = qrCodeDataUrl
			})

			const qrX = canvas.width - qrSize - padding - 10
			const qrY = img.height + padding + 10
			ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

			const shareImageUrl = canvas.toDataURL('image/png')
			setShareImageUrl(shareImageUrl)
			setShowShareModal(true)

			sendGAEvent('event', 'share_success', { platform })
			window.umami?.track('share_success', {  
				platform,
			})
		} catch (err) {
			console.error('生成分享图片失败：', err)
			setError('生成分享图片失败')
			sendGAEvent('event', 'share_error', { platform })
			window.umami?.track('share_error', {
				platform,
			})
		} finally {
			setGeneratingShare(false)
		}
	}

	return (
		<div className="max-w-5xl mx-auto">
			<ShareModal
				showShareModal={showShareModal}
				setShowShareModal={setShowShareModal}
				shareImageUrl={shareImageUrl}
				platform={platform}
			/>
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<PlatformSelector platform={platform} setPlatform={setPlatform} />

							<div className="space-y-2">
								{platform === 'upload' ? (
									<ImageUploader
										selectedFile={selectedFile}
										setSelectedFile={setSelectedFile}
										setUsername={setUsername}
										setError={setError}
									/>
								) : (
									<>
										<label
											htmlFor="username"
											className="block text-sm font-medium text-gray-700 flex items-center"
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
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
											{platform === 'qq' ? '输入 QQ 号码' : `输入 ${platform} 用户名`}
										</label>
										<input
											id="username"
											type="text"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											placeholder={
												platform === 'qq'
													? '请输入您的 QQ 号码'
													: `请输入您的 ${platform} 用户名`
											}
											className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
										/>
									</>
								)}
							</div>
							<button
								type="submit"
								disabled={loading}
								className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 transition-all duration-200 font-medium flex items-center justify-center"
							>
								{loading ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										处理中...
									</>
								) : (
									<>
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
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 9h6v6H9V9z"
											/>
										</svg>
										开始处理
									</>
								)}
							</button>
						</form>

						{error && (
							<div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center">
								<svg
									className="w-5 h-5 mr-2 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{error}</span>
							</div>
						)}

						{loading && <LoadingSpinner message={loadingStage} />}

						<div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
							<div className="flex items-center space-x-2">
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
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>处理时间约 15-30 秒，请耐心等待</span>
							</div>
						</div>
					</div>

					<ResultDisplay
						imageUrl={imageUrl}
						platform={platform}
						generateShareImage={generateShareImage}
						generatingShare={generatingShare}
					/>

					<TechnicalSupport />
				</div>

				<ResultDisplay
					imageUrl={imageUrl}
					platform={platform}
					generateShareImage={generateShareImage}
					generatingShare={generatingShare}
					isDesktop={true}
				/>
			</div>
		</div>
	)
}
