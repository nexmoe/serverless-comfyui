'use client'

import { useState } from 'react'

interface ImageUploaderProps {
	selectedFile: File | null
	setSelectedFile: (file: File | null) => void
	setUsername: (username: string) => void
	setError: (error: string) => void
}

export function ImageUploader({ selectedFile, setSelectedFile, setUsername, setError }: ImageUploaderProps) {
	const [previewUrl, setPreviewUrl] = useState<string>('')

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]

			// 验证文件类型
			if (!['image/jpeg', 'image/png'].includes(file.type)) {
				setError('只支持 JPG 和 PNG 格式的图片')
				return
			}

			setSelectedFile(file)
			setUsername('') // Clear username when file is selected
			setError('') // Clear any previous errors

			// Create preview URL
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<>
			<label htmlFor="file" className="block text-sm font-medium text-gray-700 flex items-center">
				<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				选择图片
			</label>
			<div className="space-y-3">
				<input
					id="file"
					type="file"
					accept="image/jpeg, image/png"
					onChange={handleFileChange}
					className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
				/>
				{selectedFile && (
					<div className="space-y-2">
						<p className="text-sm text-gray-500">已选择：{selectedFile.name}</p>
					</div>
				)}
				{previewUrl && (
					<div className="w-32 h-32 aspect-square bg-gray-50 rounded-xl overflow-hidden">
						<img src={previewUrl} alt="已选择图片" className="w-32 h-32 object-cover transform" />
					</div>
				)}
			</div>
		</>
	)
}
