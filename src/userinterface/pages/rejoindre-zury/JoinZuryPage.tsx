import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, TrendingUp, Calendar, BarChart3, Star, Users, FileText, CheckCircle, Rocket, X } from 'lucide-react'
import { CountUp } from '../shared/ui/CountUp'
import type { RootState, AppDispatch } from '../../../store/store'
import { getGlobalStats } from '../../../domain/usecase/category.usecase'

const benefits = [
  { icon: Eye, title: 'Visibilité maximale', description: "Touchez des milliers d'utilisateurs qui recherchent activement des établissements comme le vôtre.", color: 'text-primary', bg: 'bg-primary/10' },
  { icon: TrendingUp, title: 'Augmentez votre fréquentation', description: 'Attirez de nouveaux clients et fidélisez votre clientèle grâce à une présence en ligne professionnelle.', color: 'text-accent', bg: 'bg-accent/10' },
  { icon: Calendar, title: 'Gérez vos événements', description: 'Publiez et promouvez vos événements spéciaux, soirées thématiques et offres exclusives.', color: 'text-gold', bg: 'bg-gold/10' },
  { icon: BarChart3, title: 'Statistiques en temps réel', description: "Suivez les vues de votre profil, l'engagement et l'intérêt pour votre établissement.", color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Star, title: 'Avis et notations', description: 'Collectez des avis authentiques et construisez votre réputation en ligne.', color: 'text-gold', bg: 'bg-gold/10' },
  { icon: Users, title: 'Communauté active', description: "Rejoignez un réseau de professionnels de l'HoReCa et partagez vos meilleures pratiques.", color: 'text-accent', bg: 'bg-accent/10' },
]

const steps = [
  { icon: FileText, title: 'Inscription', description: 'Remplissez le formulaire avec les informations de votre établissement en 2 minutes.', number: '01' },
  { icon: CheckCircle, title: 'Validation', description: 'Notre équipe vérifie et valide votre inscription sous 24-48h.', number: '02' },
  { icon: Rocket, title: 'Activation', description: "Votre profil est publié et visible par des milliers d'utilisateurs.", number: '03' },
  { icon: TrendingUp, title: 'Croissance', description: 'Suivez vos statistiques et attirez de nouveaux clients chaque jour.', number: '04' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

interface RegistrationForm {
  name: string
  category: string
  address: string
  neighborhood: string
  phone: string
  email: string
}

const INITIAL_FORM: RegistrationForm = { name: '', category: '', address: '', neighborhood: '', phone: '', email: '' }

export const JoinZuryPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const apiStats = useSelector((state: RootState) => state.category.stats)

  useEffect(() => { if (!apiStats) dispatch(getGlobalStats()) }, [])

  const statsItems = [
    { value: apiStats?.total_etablissements ?? 0, label: 'Établissements partenaires' },
    { value: apiStats?.total_quartiers ?? 0,      label: 'Quartiers couverts' },
    { value: apiStats?.total_events ?? 0,         label: 'Événements par mois' },
    { value: apiStats?.total_vues ?? 0,           label: 'Vues mensuelles' },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<RegistrationForm>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSubmitted(false)
    setForm(INITIAL_FORM)
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-dark via-dark/95 to-primary/20 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Développez votre visibilité avec{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold">ZURY</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">Rejoignez la première plateforme HoReCa du Congo</p>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              Des milliers d'utilisateurs recherchent quotidiennement les meilleurs restaurants, bars, hôtels et
              événements à Brazzaville et Pointe-Noire. Soyez visible, soyez trouvé, développez votre clientèle !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-2xl hover:shadow-primary/50">
                Inscrire mon établissement
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-dark transition-all">
                En savoir plus
              </button>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-6 py-3">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent font-semibold">100% Gratuit · Inscription en 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi rejoindre */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-dark mb-4">Pourquoi rejoindre ZURY ?</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Une plateforme complète pour développer votre présence en ligne et attirer plus de clients
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {benefits.map((b, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -10, scale: 1.03 }} transition={{ duration: 0.3 }}
                className="bg-light rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 rounded-2xl ${b.bg} flex items-center justify-center mb-6`}>
                  <b.icon className={`w-8 h-8 ${b.color}`} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{b.title}</h3>
                <p className="text-gray-500 leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsItems.map((s, i) => (
              <motion.div key={i} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <CountUp value={s.value} suffix="+" duration={1600} />
                </div>
                <div className="text-white/80 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-dark mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Un processus simple et rapide pour rejoindre ZURY</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i} className="relative" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-primary/20" />
                )}
                <motion.div className="bg-white rounded-2xl p-8 shadow-sm relative z-10"
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-5xl font-bold text-primary/10">{step.number}</div>
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-gradient-to-br from-dark to-dark/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Prêt à rejoindre ZURY ?
          </motion.h2>
          <motion.p className="text-xl text-white/70 mb-10"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Inscrivez votre établissement gratuitement et commencez à attirer de nouveaux clients dès aujourd'hui.
          </motion.p>
          <motion.button onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-white rounded-2xl font-bold text-xl hover:bg-primary/90 transition-all shadow-2xl hover:shadow-primary/30"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            Inscrire mon établissement gratuitement
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </section>

      {/* Modal inscription */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-dark">Inscrire mon établissement</h2>
              <button onClick={handleClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {submitted ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-dark mb-3">Demande envoyée !</h3>
                <p className="text-gray-500 mb-6">
                  Merci ! Notre équipe examinera votre demande et vous contactera sous 24-48h.
                </p>
                <button onClick={handleClose} className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Nom de l'établissement *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Restaurant Le Prestige"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Catégorie *</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    <option value="">Choisir une catégorie</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="bar">Bar</option>
                    <option value="hotel">Hôtel</option>
                    <option value="lounge">Lounge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Quartier *</label>
                  <input type="text" required value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                    placeholder="Ex: Bacongo, Poto-Poto, Moungali..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Adresse</label>
                  <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Adresse complète"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Téléphone *</label>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+242 06 XXX XX XX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contact@votre-etablissement.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <button type="submit"
                  className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors mt-2">
                  Envoyer ma demande
                </button>
                <p className="text-center text-xs text-gray-400">100% gratuit · Réponse sous 24-48h</p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
