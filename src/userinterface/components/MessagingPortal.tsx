import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, User, Clock, Search, X } from 'lucide-react'
import { useGetConversationsQuery } from '../../store/apiSlice'
import { cn } from '../../service/utils/cn'

interface Conversation {
  id: string
  partnerName: string
  partnerAvatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
}

interface MessagingPortalProps {
  isOpen: boolean
  onClose: () => void
  onSelectConversation: (partnerId: string, partnerName: string) => void
}

export const MessagingPortal = ({ isOpen, onClose, onSelectConversation }: MessagingPortalProps) => {
  const { data: conversationsData, isLoading } = useGetConversationsQuery(undefined, {
    pollingInterval: 10000, // Poll every 10s for new messages
    skip: !isOpen
  })

  // Simulated fallback data if API returns empty for now
  const conversations: Conversation[] = (conversationsData as any)?.results || [
    {
      id: 'zury-promo',
      partnerName: 'Zury Assistance',
      lastMessage: 'Bienvenue sur Zury ! Comment puis-je vous aider ?',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 1,
      isOnline: true
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-20 right-4 md:right-20 z-[110] w-[92vw] md:w-[380px] h-[580px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-5 bg-primary text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-display">Messages</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input 
                  type="text" 
                  placeholder="Rechercher une conversation..."
                  className="w-full bg-white/10 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:ring-1 focus:ring-white/20 transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-gray-50/30">
              {isLoading ? (
                <div className="p-8 flex flex-col items-center justify-center gap-3">
                   <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                   <p className="text-xs text-gray-400">Chargement de vos discussions...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-dark mb-2">Aucun message</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Contactez un établissement pour démarrer une discussion.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv.id, conv.partnerName)
                        onClose()
                      }}
                      className="w-full p-4 flex items-center gap-4 hover:bg-white transition-colors text-left group"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border border-white shadow-sm">
                          {conv.partnerAvatar ? (
                            <img src={conv.partnerAvatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        {conv.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-x-4 border-white rounded-full" title="En ligne" /> 
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-dark truncate group-hover:text-primary transition-colors">
                            {conv.partnerName}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate pr-4">
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="flex-shrink-0 min-w-[20px] h-[20px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-gray-100">
               <button className="w-full py-3 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all">
                  Voir tout le centre de messagerie
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
