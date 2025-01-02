'use client'

import { useState, useEffect } from 'react'

interface LoadingSpinnerProps {
    message: string
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-gray-600">{message}</p>
                <p className="text-xs text-gray-500">已处理 {elapsedTime} 秒</p>
            </div>
        </div>
    )
} 