import { User, Mail, Shield, Save, Loader2, Camera, History, Calendar, MapPin, Ticket, Clock, CheckCircle2, ChevronRight, Users, ShoppingBag, Award, Headphones } from 'lucide-react'
import { useGetUserProfileQuery, useUpdateUserProfileMutation, useGetUserHistoryQuery, useGetUserTableReservationsQuery, useGetUserEventBookingsQuery, useGetUserOrdersQuery } from '../../../store/apiSlice'
import { cn } from '../../../service/utils/cn'

export const UserProfilePage = () => {
  const { data: profile, isLoading, refetch } = useGetUserProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation()
  
  const [formData, setFormData] = useState({
    firstName: '',
    telephone: '',
  })
  
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'reservations' | 'orders' | 'loyalty'>('info')
  const { data: historyData, isLoading: isHistoryLoading } = useGetUserHistoryQuery(undefined, {
    skip: activeTab !== 'history'
  })

  const { data: tableResData, isLoading: isTableResLoading } = useGetUserTableReservationsQuery(undefined, {
    skip: activeTab !== 'reservations'
  })
  const { data: eventBookingData, isLoading: isEventBookingLoading } = useGetUserEventBookingsQuery(undefined, {
    skip: activeTab !== 'reservations'
  })
  const { data: orderData, isLoading: isOrdersLoading } = useGetUserOrdersQuery(undefined, {
    skip: activeTab !== 'orders'
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        telephone: profile.telephone || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        telephone: formData.telephone,
      }).unwrap()
      refetch()
    } catch (err) {
      console.error('Failed to update profile', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Mon Espace</h1>
        <p className="text-gray-500">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden text-primary font-bold text-3xl">
                {profile?.first_name ? profile.first_name.charAt(0) : <User className="w-10 h-10" />}
              </div>
              <div className="absolute inset-0 bg-dark/40 rounded-full flex items-center justify-center flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium uppercase">Modifier</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-dark">{profile?.first_name} {profile?.last_name}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            
            <div className="w-full mt-6 pt-6 border-t border-gray-100 space-y-3">
              <button 
                onClick={() => setActiveTab('info')}
                className={cn('w-full flex items-center gap-3 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors',
                  activeTab === 'info' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-dark hover:bg-gray-50'
                )}>
                <User className="w-4 h-4" />
                Informations
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={cn('w-full flex items-center gap-3 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors',
                  activeTab === 'history' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-dark hover:bg-gray-50'
                )}>
                <History className="w-4 h-4" />
                Historique de visites
              </button>
              <button 
                onClick={() => setActiveTab('reservations')}
                className={cn('w-full flex items-center gap-3 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors',
                  activeTab === 'reservations' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-dark hover:bg-gray-50'
                )}>
                <Calendar className="w-4 h-4" />
                Mes réservations
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={cn('w-full flex items-center gap-3 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors',
                  activeTab === 'orders' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-dark hover:bg-gray-50'
                )}>
                <ShoppingBag className="w-4 h-4" />
                Mes commandes
              </button>
              <button 
                onClick={() => setActiveTab('loyalty')}
                className={cn('w-full flex items-center gap-3 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors',
                  activeTab === 'loyalty' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-dark hover:bg-gray-50'
                )}>
                <Award className="w-4 h-4" />
                Fidélité & Cadeaux
              </button>
              <button className="w-full flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-dark hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-colors hidden">
                <Shield className="w-4 h-4" />
                Sécurité
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          {activeTab === 'info' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-dark mb-6">Informations Personnelles</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> Adresse Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                />
                <p className="text-xs text-gray-400">Pour modifier votre adresse email, veuillez contacter le support.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="+242 06 000 0000"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-all disabled:opacity-75"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-dark mb-6">Historique des visites</h3>
              
              {isHistoryLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : historyData?.results?.length > 0 ? (
                <div className="space-y-4">
                  {historyData.results.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all bg-gray-50/50">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                        {item.etablissement_details?.image_principale ? (
                          <img src={item.etablissement_details.image_principale} alt="" className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-dark truncate">{item.etablissement_details?.nom || 'Établissement'}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{item.etablissement_details?.adresse_complete || 'Adresse non spécifiée'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-primary font-medium">
                          <History className="w-3 h-3" />
                          <span>Vu le {new Date(item.vu_le || item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium tracking-wide">Aucun historique disponible.</p>
                  <p className="text-sm text-gray-400 mt-1">Les établissements que vous visitez apparaîtront ici.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" /> Réservations d'événements
                </h3>
                
                {isEventBookingLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : eventBookingData?.results?.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {eventBookingData.results.map((booking: any, i: number) => (
                      <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                             {booking.event_details?.image_principale && <img src={booking.event_details.image_principale} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-dark text-sm">{booking.event_details?.titre || 'Événement'}</h4>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                               <Calendar className="w-3 h-3" /> {new Date(booking.event_details?.date_debut).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-primary font-medium mt-1">{booking.nombre_places} place(s) réservée(s)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Confirmé</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-400 text-sm">Aucune réservation d'événement pour le moment.</p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Réservations de tables
                </h3>
                
                {isTableResLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : tableResData?.results?.length > 0 ? (
                  <div className="space-y-4">
                    {tableResData.results.map((res: any, i: number) => (
                      <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3">
                             <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary font-bold shadow-sm">
                               {res.etablissement_details?.nom?.charAt(0)}
                             </div>
                             <div>
                               <h4 className="font-bold text-dark text-sm">{res.etablissement_details?.nom}</h4>
                               <p className="text-xs text-gray-400">{res.etablissement_details?.adresse_complete}</p>
                             </div>
                          </div>
                          <span className={cn(
                            "px-3 py-1 text-[9px] font-bold rounded-full uppercase",
                            res.statut === 'CONFIRMED' ? "bg-green-100 text-green-700" : 
                            res.statut === 'PENDING' ? "bg-orange-100 text-orange-700" :
                            "bg-gray-100 text-gray-700"
                          )}>
                            {res.statut === 'CONFIRMED' ? 'Confirmé' : res.statut === 'PENDING' ? 'En attente' : res.statut}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                           <div className="space-y-1">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Date & Heure</p>
                              <p className="text-xs font-medium text-dark flex items-center gap-1.5 leading-none">
                                <Clock className="w-3 h-3 text-primary" /> {res.date} à {res.heure}
                              </p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Convives</p>
                              <p className="text-xs font-medium text-dark flex items-center gap-1.5 leading-none">
                                <Users className="w-3 h-3 text-primary" /> {res.nombre_personnes} personnes
                              </p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-400 text-sm">Aucune réservation de table pour le moment.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
                 <ShoppingBag className="w-5 h-5 text-primary" /> Historique de commandes
               </h3>
               
               {isOrdersLoading ? (
                 <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
               ) : orderData?.results?.length > 0 ? (
                 <div className="space-y-4">
                    {orderData.results.map((order: any, i: number) => (
                      <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-primary/20 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Commande #{order.id.slice(-6)}</p>
                             <h4 className="font-bold text-dark text-sm mt-0.5">{order.etablissement_details?.nom}</h4>
                           </div>
                           <span className={cn(
                             "px-3 py-1 text-[9px] font-bold rounded-full uppercase",
                             order.statut === 'COMPLETED' ? "bg-green-100 text-green-700" : 
                             order.statut === 'PENDING' ? "bg-orange-100 text-orange-700" :
                             "bg-blue-100 text-blue-700"
                           )}>
                             {order.statut}
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                           <p className="text-xs text-gray-500">{order.items?.length || 0} produit(s) · {order.total} FCFA</p>
                           <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-12">
                   <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                   <p className="text-gray-400">Vous n'avez pas encore passé de commande.</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'loyalty' && (
             <div className="space-y-6">
               <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-white shadow-xl shadow-primary/20">
                  <div className="flex justify-between items-center mb-10">
                    <Award className="w-10 h-10 opacity-50" />
                    <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Zury Rewards</span>
                  </div>
                  <p className="text-primary-foreground/70 text-sm font-medium">Solde de points</p>
                  <p className="text-5xl font-display font-bold mt-1">1,250 <span className="text-sm opacity-60">pts</span></p>
                  
                  <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                     <p className="text-xs opacity-70">Statut : Membre Gold</p>
                     <button className="text-xs font-bold underline underline-offset-4">Voir les avantages</button>
                  </div>
               </div>

               <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-dark mb-6">Récompenses disponibles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-60 flex gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl">☕</div>
                        <div>
                           <p className="text-sm font-bold text-dark">Café gratuit</p>
                           <p className="text-[10px] text-gray-400">500 points requis</p>
                        </div>
                     </div>
                     <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-60 flex gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl">🚕</div>
                        <div>
                           <p className="text-sm font-bold text-dark">Course offerte</p>
                           <p className="text-[10px] text-gray-400">2000 points requis</p>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
