import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, X, User, Check, CheckCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebSocket } from '../../service/hooks/useWebSocket'
import { cn } from '../../service/utils/cn'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  isMe: boolean
  status: 'sent' | 'delivered' | 'read'
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  partnerName: string
  partnerId: string
}

export const ChatModal = ({ isOpen, onClose, partnerName, partnerId }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'partner', text: `Bonjour ! Comment puis-je vous aider chez ${partnerName} ?`, timestamp: new Date().toISOString(), isMe: false, status: 'read' }
  ])
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // In a real app, the URL would be derived from the partnerId/token
  const wsUrl = `wss://zury-backend-production.up.railway.app/ws/chat/${partnerId}/`
  const { isConnected, sendMessage } = useWebSocket({
    url: isOpen ? wsUrl : '',
    onMessage: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: 'partner',
        text: data.message,
        timestamp: new Date().toISOString(),
        isMe: false,
        status: 'read'
      }])
    }
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: new Date().toISOString(),
      isMe: true,
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])
    sendMessage({ message: inputText })
    setInputText('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed bottom-6 right-6 z-[200] w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
        >
          {/* Header */}
          <div className="p-4 bg-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                 <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{partnerName}</h3>
                <div className="flex items-center gap-1.5">
                   <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isConnected ? "bg-green-400" : "bg-red-400")} />
                   <span className="text-[10px] font-medium opacity-80">{isConnected ? 'En ligne' : 'Hors ligne'}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex w-full", msg.isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm transition-all",
                  msg.isMe 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-white text-dark border border-gray-100 rounded-tl-none"
                )}>
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                    <span className="text-[9px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.isMe && (
                      msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Écrivez votre message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
