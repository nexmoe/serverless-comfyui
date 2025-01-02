'use client'

type Platform = 'qq' | 'github' | 'x' | 'upload'

interface PlatformSelectorProps {
	platform: Platform
	setPlatform: (platform: Platform) => void
}

export function PlatformSelector({ platform, setPlatform }: PlatformSelectorProps) {
	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-gray-700 flex items-center">
				<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				选择平台
			</label>
			<div className="grid grid-cols-4 gap-2">
				<button
					type="button"
					onClick={() => setPlatform('upload')}
					className={`px-4 py-2 text-sm rounded-lg transition-all ${
						platform === 'upload'
							? 'bg-blue-500 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
					}`}
				>
					上传
				</button>
				<button
					type="button"
					onClick={() => setPlatform('qq')}
					className={`px-4 py-2 text-sm rounded-lg transition-all ${
						platform === 'qq'
							? 'bg-blue-500 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
					}`}
				>
					QQ
				</button>
				<button
					type="button"
					onClick={() => setPlatform('github')}
					className={`px-4 py-2 text-sm rounded-lg transition-all ${
						platform === 'github'
							? 'bg-blue-500 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
					}`}
				>
					GitHub
				</button>
				<button
					type="button"
					onClick={() => setPlatform('x')}
					className={`px-4 py-2 text-sm rounded-lg transition-all ${
						platform === 'x'
							? 'bg-blue-500 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
					}`}
				>
					X
				</button>
			</div>
		</div>
	)
}
