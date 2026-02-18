'use client';

import { useState } from 'react';
import { X, Building2, User, Mail, Phone, MapPin, MessageSquare, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    establishmentName: '',
    category: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    neighborhood: '',
    website: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Connecter à l'API quand elle sera prête
    // Pour l'instant, simulation
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      establishmentName: '',
      category: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      neighborhood: '',
      website: '',
      message: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Bouton fermer */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-gray hover:text-dark z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-8 rounded-t-2xl">
              <h2 className="text-3xl font-bold mb-2">Inscrivez votre établissement</h2>
              <p className="text-white/90">Remplissez le formulaire et rejoignez ZURY dès aujourd'hui</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Nom établissement */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Nom de l'établissement *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                  <input
                    type="text"
                    name="establishmentName"
                    required
                    value={formData.establishmentName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Restaurant Mami Wata"
                  />
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Catégorie *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="bar">Bar</option>
                  <option value="hotel">Hôtel</option>
                  <option value="lounge">Lounge</option>
                  <option value="maquis">Maquis</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Grid 2 colonnes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom propriétaire */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Nom du propriétaire/gérant *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                    <input
                      type="text"
                      name="ownerName"
                      required
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+242 06 123 45 67"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Adresse complète *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Avenue Félix Éboué, face au fleuve Congo"
                  />
                </div>
              </div>

              {/* Grid 2 colonnes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quartier */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Quartier
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Poto-Poto"
                  />
                </div>

                {/* Site web */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Site web (optionnel)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Message / Description (optionnel)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Parlez-nous de votre établissement..."
                  />
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </Button>

              <p className="text-sm text-gray text-center">
                * Champs obligatoires
              </p>
            </form>
          </>
        ) : (
          /* Message de succès */
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
            <h3 className="text-3xl font-bold text-dark mb-4">
              Demande envoyée avec succès !
            </h3>
            <p className="text-lg text-gray mb-8">
              Merci pour votre inscription ! Vous recevrez un email de validation 
              sous 24-48h pour activer votre profil sur ZURY.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={resetAndClose}
            >
              Fermer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}