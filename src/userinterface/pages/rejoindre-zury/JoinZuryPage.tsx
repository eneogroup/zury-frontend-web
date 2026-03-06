import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Eye, TrendingUp, Calendar, BarChart3, Star, Users,
  FileText, CheckCircle, Rocket, X, Building2, MapPin, Phone, Mail,
  Globe, Image, Plus, Trash2, User, MessageSquare, ChevronDown, Loader2,
} from 'lucide-react'
import { CountUp } from '../shared/ui/CountUp'
import type { RootState, AppDispatch } from '../../../store/store'
import { getGlobalStats, getCategories, getQuartiers } from '../../../domain/usecase/category.usecase'

/* ── Constants ───────────────────────────────────────────────────────────── */
const benefits = [
  { icon: Eye,      title: 'Visibilité maximale',        description: "Touchez des milliers d'utilisateurs qui recherchent activement des établissements comme le vôtre.", color: 'text-primary', bg: 'bg-primary/10' },
  { icon: TrendingUp, title: 'Augmentez votre fréquentation', description: 'Attirez de nouveaux clients et fidélisez votre clientèle grâce à une présence en ligne professionnelle.', color: 'text-accent', bg: 'bg-accent/10' },
  { icon: Calendar, title: 'Gérez vos événements',       description: 'Publiez et promouvez vos événements spéciaux, soirées thématiques et offres exclusives.', color: 'text-gold', bg: 'bg-gold/10' },
  { icon: BarChart3, title: 'Statistiques en temps réel', description: "Suivez les vues de votre profil, l'engagement et l'intérêt pour votre établissement.", color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Star,     title: 'Avis et notations',          description: 'Collectez des avis authentiques et construisez votre réputation en ligne.', color: 'text-gold', bg: 'bg-gold/10' },
  { icon: Users,    title: 'Communauté active',          description: "Rejoignez un réseau de professionnels de l'HoReCa et partagez vos meilleures pratiques.", color: 'text-accent', bg: 'bg-accent/10' },
]

const steps = [
  { icon: FileText,    title: 'Inscription',  description: 'Remplissez le formulaire avec les informations de votre établissement en 2 minutes.', number: '01' },
  { icon: CheckCircle, title: 'Validation',   description: 'Notre équipe vérifie et valide votre inscription sous 24-48h.', number: '02' },
  { icon: Rocket,      title: 'Activation',   description: "Votre profil est publié et visible par des milliers d'utilisateurs.", number: '03' },
  { icon: TrendingUp,  title: 'Croissance',   description: 'Suivez vos statistiques et attirez de nouveaux clients chaque jour.', number: '04' },
]

const ALL_TAGS = [
  'Accessible PMR', 'Climatisé', 'Live Music', 'Livraison',
  'Menu végétarien', 'Paiement mobile', 'Parking', 'Terrasse',
  'Vue panoramique', 'Wifi gratuit',
]

/* ── Form types ──────────────────────────────────────────────────────────── */
interface RegForm {
  name: string; description: string; category: string; neighborhood: string
  address: string; lat: string; lng: string
  phone: string; emailEtab: string; website: string; facebook: string; instagram: string
  contactName: string; contactEmail: string; comment: string
}

const INIT: RegForm = {
  name: '', description: '', category: '', neighborhood: '',
  address: '', lat: '', lng: '',
  phone: '', emailEtab: '', website: '', facebook: '', instagram: '',
  contactName: '', contactEmail: '', comment: '',
}

/* ── Input wrapper ───────────────────────────────────────────────────────── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-dark placeholder:text-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white'
const selectCls = `${inputCls} appearance-none cursor-pointer`

/* ── Section divider ─────────────────────────────────────────────────────── */
function Section({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

/* ── Registration Modal ──────────────────────────────────────────────────── */
function RegistrationModal({ onClose, categories, quartiers }: {
  onClose: () => void
  categories: any[]
  quartiers: any[]
}) {
  const [form, setForm] = useState<RegForm>(INIT)
  const [tags, setTags] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [geoLoading, setGeoLoading] = useState(true)
  const [geoDenied, setGeoDenied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoLoading(false)
      setGeoDenied(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({
          ...f,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }))
        setGeoLoading(false)
      },
      () => {
        setGeoLoading(false)
        setGeoDenied(true)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  const set = (k: keyof RegForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const toggleTag = (t: string) =>
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const addPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 10 - photos.length)
    setPhotos(p => [...p, ...files])
    setPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  const removePhoto = (i: number) => {
    URL.revokeObjectURL(previews[i])
    setPhotos(p => p.filter((_, j) => j !== i))
    setPreviews(p => p.filter((_, j) => j !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    const body = new FormData()
    body.append('nom', form.name)
    body.append('description', form.description)
    body.append('categorie', form.category)
    body.append('quartier', form.neighborhood)
    body.append('adresse', form.address)
    if (form.lat)       body.append('latitude', form.lat)
    if (form.lng)       body.append('longitude', form.lng)
    if (form.phone)     body.append('telephone', form.phone)
    if (form.emailEtab) body.append('email', form.emailEtab)
    if (form.website)   body.append('site_web', form.website)
    if (form.facebook)  body.append('facebook', form.facebook)
    if (form.instagram) body.append('instagram', form.instagram)
    if (form.contactName) body.append('nom_soumetteur', form.contactName)
    body.append('email_soumetteur', form.contactEmail)
    if (form.comment)    body.append('commentaire_soumetteur', form.comment)
    photos.forEach(photo => body.append('images', photo))

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/etablissements/soumettre/`,
        { method: 'POST', body },
      )
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      setSubmitted(true)
    } catch {
      setSubmitError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-12 text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="w-20 h-20 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </motion.div>
        <h3 className="font-display text-2xl font-bold text-dark mb-3">Demande envoyée !</h3>
        <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          Merci <strong className="text-dark">{form.contactName || 'à vous'}</strong> ! Notre équipe examinera votre demande et vous contactera sous 24-48h.
        </p>
        <button onClick={onClose}
          className="px-8 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-accent transition-colors">
          Fermer
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">

      {/* ── Établissement ── */}
      <Section label="L'établissement" icon={Building2} />

      <Field label="Nom de l'établissement" required>
        <input type="text" required placeholder="Ex: Restaurant Mami Wata"
          value={form.name} onChange={set('name')} className={inputCls} />
      </Field>

      <Field label="Description" required>
        <textarea required rows={3} placeholder="Décrivez votre établissement en détail…"
          value={form.description} onChange={set('description')}
          className={`${inputCls} resize-none`} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Catégorie" required>
          <div className="relative">
            <select required value={form.category} onChange={set('category')} className={selectCls}>
              <option value="">Sélectionnez</option>
              {categories.length > 0
                ? categories.map((c: any) => <option key={c.value} value={c.value}>{c.label}</option>)
                : <option disabled value="">Chargement…</option>
              }
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
          </div>
        </Field>
        <Field label="Quartier" required>
          <div className="relative">
            <select required value={form.neighborhood} onChange={set('neighborhood')} className={selectCls}>
              <option value="">Sélectionnez</option>
              {quartiers.length > 0
                ? quartiers.map((q: any) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))
                : <option disabled value="">Chargement…</option>
              }
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
          </div>
        </Field>
      </div>

      <Field label="Adresse complète" required>
        <input type="text" required placeholder="Ex: Avenue Félix Éboué, face au fleuve Congo"
          value={form.address} onChange={set('address')} className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Latitude">
          <div className="relative">
            {geoLoading
              ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 animate-spin" />
              : <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            }
            <input
              type="text"
              readOnly
              placeholder={geoLoading ? 'Localisation…' : geoDenied ? 'Accès refusé' : ''}
              value={form.lat}
              className={`${inputCls} pl-9 bg-gray-50 cursor-not-allowed select-none ${geoDenied ? 'text-gray-300 italic' : 'text-gray-400'}`}
            />
          </div>
        </Field>
        <Field label="Longitude">
          <div className="relative">
            {geoLoading
              ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 animate-spin" />
              : <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            }
            <input
              type="text"
              readOnly
              placeholder={geoLoading ? 'Localisation…' : geoDenied ? 'Accès refusé' : ''}
              value={form.lng}
              className={`${inputCls} pl-9 bg-gray-50 cursor-not-allowed select-none ${geoDenied ? 'text-gray-300 italic' : 'text-gray-400'}`}
            />
          </div>
        </Field>
      </div>
      {geoDenied && (
        <p className="text-[11px] text-gray-300 -mt-3">
          La localisation a été refusée. Les coordonnées ne seront pas transmises.
        </p>
      )}

      {/* ── Contact & Réseaux ── */}
      <Section label="Contact & Réseaux sociaux" icon={Phone} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Téléphone">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input type="tel" placeholder="+242 06 123 45 67" value={form.phone} onChange={set('phone')}
              className={`${inputCls} pl-9`} />
          </div>
        </Field>
        <Field label="Email établissement">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input type="email" placeholder="contact@etablissement.cg" value={form.emailEtab} onChange={set('emailEtab')}
              className={`${inputCls} pl-9`} />
          </div>
        </Field>
      </div>

      <Field label="Site web (optionnel)">
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="url" placeholder="https://…" value={form.website} onChange={set('website')}
            className={`${inputCls} pl-9`} />
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Facebook">
          <input type="url" placeholder="https://facebook.com/…" value={form.facebook} onChange={set('facebook')}
            className={inputCls} />
        </Field>
        <Field label="Instagram">
          <input type="url" placeholder="https://instagram.com/…" value={form.instagram} onChange={set('instagram')}
            className={inputCls} />
        </Field>
      </div>

      {/* ── Tags / Services ── */}
      <Section label="Services & équipements" icon={Star} />

      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map(tag => {
          const active = tags.includes(tag)
          return (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                active
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50 hover:text-primary'
              }`}>
              {tag}
            </button>
          )
        })}
      </div>

      {/* ── Photos ── */}
      <Section label="Photos de l'établissement" icon={Image} />

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400">{photos.length}/10 photo{photos.length !== 1 ? 's' : ''}</p>
          {photos.length < 10 && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition-colors">
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          )}
        </div>

        {/* Drop zone */}
        {photos.length === 0 ? (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-200 hover:border-primary/50 rounded-2xl py-8 text-center transition-colors group">
            <Image className="w-8 h-8 text-gray-200 group-hover:text-primary/30 mx-auto mb-2 transition-colors" />
            <p className="text-sm font-medium text-gray-400 group-hover:text-gray-500">Cliquez pour ajouter des images</p>
            <p className="text-xs text-gray-300 mt-1">Max 10 MB par image · 10 images max</p>
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {previews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePhoto(i)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
            {photos.length < 10 && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 flex items-center justify-center transition-colors group">
                <Plus className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
              </button>
            )}
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={addPhotos} />
      </div>

      {/* ── Vos informations ── */}
      <Section label="Vos informations" icon={User} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Votre nom (optionnel)">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input type="text" placeholder="Votre nom" value={form.contactName} onChange={set('contactName')}
              className={`${inputCls} pl-9`} />
          </div>
        </Field>
        <Field label="Votre email" required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input type="email" required placeholder="votre@email.com" value={form.contactEmail} onChange={set('contactEmail')}
              className={`${inputCls} pl-9`} />
          </div>
        </Field>
      </div>

      <Field label="Commentaire additionnel (optionnel)">
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
          <textarea rows={3} placeholder="Ajoutez des informations complémentaires…"
            value={form.comment} onChange={set('comment')}
            className={`${inputCls} pl-9 resize-none`} />
        </div>
      </Field>

      {/* ── Submit ── */}
      <div className="pt-2 border-t border-gray-100">
        {submitError && (
          <p className="text-xs text-red-500 text-center mb-3 bg-red-50 border border-red-100 rounded-xl py-2 px-3">
            {submitError}
          </p>
        )}
        <button type="submit" disabled={submitting}
          className="w-full py-3.5 bg-primary hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all shadow-ember flex items-center justify-center gap-2">
          {submitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…</>
            : <>Envoyer ma demande <ArrowRight className="w-4 h-4" /></>
          }
        </button>
        <p className="text-center text-[11px] text-gray-300 mt-3">
          * Champs obligatoires · Au moins un moyen de contact requis · 100% gratuit · Réponse sous 24-48h
        </p>
      </div>
    </form>
  )
}

/* ── JoinZuryPage ────────────────────────────────────────────────────────── */
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants      = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export const JoinZuryPage = () => {
  const dispatch  = useDispatch<AppDispatch>()
  const apiStats  = useSelector((state: RootState) => state.category.stats)
  const categories = useSelector((state: RootState) => state.category.categories)
  const quartiers  = useSelector((state: RootState) => state.category.quartiers)

  useEffect(() => {
    dispatch(getGlobalStats())
    dispatch(getCategories())
    dispatch(getQuartiers(undefined))
  }, [])

  const statsItems = [
    { value: apiStats?.total_etablissements ?? 0, label: 'Établissements partenaires' },
    { value: apiStats?.total_quartiers ?? 0,      label: 'Quartiers couverts' },
    { value: apiStats?.total_events ?? 0,         label: 'Événements par mois' },
    { value: apiStats?.total_vues ?? 0,           label: 'Vues mensuelles' },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal  = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-light">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-dark via-dark/95 to-primary/20 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Développez votre visibilité avec{' '}
              <span className="text-transparent bg-clip-text bg-ember-gradient italic">ZURY</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Des milliers d'utilisateurs recherchent quotidiennement les meilleurs restaurants, bars, hôtels et
              événements à Brazzaville et Pointe-Noire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={openModal}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-accent transition-all shadow-ember">
                Inscrire mon établissement <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-6 py-3">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-white/70 text-sm font-medium">100% Gratuit · Inscription en 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-3">Pourquoi nous rejoindre</p>
            <h2 className="font-display text-4xl font-bold text-dark mb-3">Rejoindre ZURY</h2>
            <span className="block w-10 h-0.5 bg-primary rounded mx-auto" />
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {benefits.map((b, i) => (
              <motion.div key={i} variants={itemVariants}
                className="bg-light rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${b.bg} flex items-center justify-center mb-5`}>
                  <b.icon className={`w-6 h-6 ${b.color}`} />
                </div>
                <h3 className="text-base font-bold text-dark mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsItems.map((s, i) => (
              <motion.div key={i} className="text-center"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="font-display text-4xl md:text-5xl font-bold text-white mb-1">
                  <CountUp value={s.value} suffix="+" duration={1600} />
                </div>
                <div className="text-white/70 text-sm font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-3">Processus simple</p>
            <h2 className="font-display text-4xl font-bold text-dark">Comment ça marche ?</h2>
            <span className="block w-10 h-0.5 bg-primary rounded mx-auto mt-3" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} className="relative"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[58%] w-[84%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-50 relative z-10 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-4xl font-bold text-primary/8 font-display">{step.number}</span>
                  </div>
                  <h3 className="font-bold text-dark mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Prêt à rejoindre <span className="text-transparent bg-clip-text bg-ember-gradient italic">ZURY</span> ?
          </motion.h2>
          <motion.p className="text-white/50 text-lg mb-10"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Inscrivez votre établissement gratuitement et commencez à attirer de nouveaux clients dès aujourd'hui.
          </motion.p>
          <motion.button onClick={openModal}
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-accent transition-all shadow-ember"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            Inscrire mon établissement gratuitement
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* ── Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto bg-black/60 backdrop-blur-sm">
            <motion.div
              className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl mb-8"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>

              {/* Modal header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 bg-white rounded-t-2xl">
                <div>
                  <h2 className="font-display text-xl font-bold text-dark">Inscrivez votre établissement</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Remplissez le formulaire et rejoignez ZURY dès aujourd'hui</p>
                </div>
                <button onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0 ml-4">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <RegistrationModal onClose={closeModal} categories={categories} quartiers={quartiers} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
