import { useEffect, useRef, useState } from 'react'

interface UseWebSocketProps {
  url: string
  onMessage?: (data: any) => void
}

export const useWebSocket = ({ url, onMessage }: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!url) return

    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (onMessage) onMessage(data)
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      socket.close()
    }
  }, [url])

  const sendMessage = (message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  return { isConnected, sendMessage }
}
