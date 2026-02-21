'use client';

import { useState, useEffect } from 'react';
import { X, Building2, User, Mail, Phone, MapPin, MessageSquare, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: string;
  nom: string;
  icone: string;
}

interface Quartier {
  id: string;
  nom: string;
  ville: string;
}

interface Tag {
  id: string;
  nom: string;
  icone: string;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    categorie: '',
    quartier: '',
    adresse: '',
    latitude: '',
    longitude: '',
    telephone: '',
    email: '',
    site_web: '',
    facebook: '',
    instagram: '',
    horaires: '',
    tags: [] as string[],
    email_soumetteur: '',
    nom_soumetteur: '',
    commentaire_soumetteur: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [quartiers, setQuartiers] = useState<Quartier[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'https://zury-backend-production.up.railway.app/api/v1';

  // Charger les données du formulaire
  useEffect(() => {
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  const loadFormData = async () => {
    try {
      // Charger catégories
      const catRes = await fetch(`${API_URL}/formulaire/categories/`);
      const catData = await catRes.json();
      setCategories(catData);

      // Charger quartiers
      const quartRes = await fetch(`${API_URL}/formulaire/quartiers/`);
      const quartData = await quartRes.json();
      setQuartiers(quartData);

      // Charger tags
      const tagsRes = await fetch(`${API_URL}/formulaire/tags/`);
      const tagsData = await tagsRes.json();
      setTags(tagsData);
    } catch (error) {
      console.error('Erreur chargement formulaire:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validation locale
      if (images.length === 0) {
        throw new Error('Au moins une image est requise');
      }

      if (images.length > 10) {
        throw new Error('Maximum 10 images autorisées');
      }

      // Au moins un contact requis
      if (!formData.telephone && !formData.email && !formData.site_web && !formData.facebook && !formData.instagram) {
        throw new Error('Au moins un moyen de contact est requis');
      }

      // Créer FormData
      const formDataToSend = new FormData();

      // Debug : vérifier les valeurs AVANT de les envoyer
      console.log('FormData avant envoi:', {
        nom: formData.nom,
        categorie: formData.categorie,
        quartier: formData.quartier,
        tags: formData.tags,
        images: images
      });

      // Ajouter les champs texte REQUIS
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('categorie', formData.categorie);
      formDataToSend.append('quartier', formData.quartier);
      formDataToSend.append('adresse', formData.adresse);
      formDataToSend.append('email_soumetteur', formData.email_soumetteur);

      // Champs optionnels (n'ajouter que si non vides)
      if (formData.latitude) formDataToSend.append('latitude', formData.latitude);
      if (formData.longitude) formDataToSend.append('longitude', formData.longitude);
      if (formData.telephone) formDataToSend.append('telephone', formData.telephone);
      if (formData.email) formDataToSend.append('email', formData.email);
      if (formData.site_web) formDataToSend.append('site_web', formData.site_web);
      if (formData.facebook) formDataToSend.append('facebook', formData.facebook);
      if (formData.instagram) formDataToSend.append('instagram', formData.instagram);
      if (formData.nom_soumetteur) formDataToSend.append('nom_soumetteur', formData.nom_soumetteur);
      if (formData.commentaire_soumetteur) formDataToSend.append('commentaire_soumetteur', formData.commentaire_soumetteur);

      // Horaires (JSON)
      if (formData.horaires) {
        try {
          const horairesJson = JSON.parse(formData.horaires);
          formDataToSend.append('horaires', JSON.stringify(horairesJson));
        } catch {
          // Ignorer si JSON invalide
        }
      }

      // Tags (envoyer chaque UUID séparément)
      if (formData.tags.length > 0) {
        formData.tags.forEach((tagId) => {
          formDataToSend.append('tags', tagId);
        });
      }
      images.forEach((img, i) => {
        console.log(i, img, img instanceof File, img.name);
      });

      // Ajouter les images (envoyer chaque fichier séparément)
      images.forEach((image) => {
        formDataToSend.append('images', image, image.name);
      });

      // Debug: Voir ce qui est envoyé
      console.log('Données envoyées:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      // Envoyer à l'API
      const response = await fetch(`${API_URL}/etablissements/soumettre/`, {
        method: 'POST',
        body: formDataToSend,
        // NE PAS mettre de Content-Type header, le navigateur le fera automatiquement avec boundary
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
      } else {
        // Formater les erreurs
        if (result.errors) {
          const errorMessages = Object.entries(result.errors)
            .map(([field, messages]) => {
              const msg = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${field}: ${msg}`;
            })
            .join('\n');
          throw new Error(errorMessages);
        } else {
          throw new Error(result.message || 'Erreur lors de la soumission');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      console.error('Erreur soumission:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 10) {
      alert('Maximum 10 images autorisées');
      return;
    }

    // Vérifier la taille (10MB max par image)
    const maxSize = 10 * 1024 * 1024; // 10MB
    for (const file of files) {
      if (file.size > maxSize) {
        alert(`L'image ${file.name} est trop volumineuse (max 10MB)`);
        return;
      }
    }

    // Ajouter les images
    setImages(prev => [...prev, ...files]);

    // Créer les previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setError(null);
    setFormData({
      nom: '',
      description: '',
      categorie: '',
      quartier: '',
      adresse: '',
      latitude: '',
      longitude: '',
      telephone: '',
      email: '',
      site_web: '',
      facebook: '',
      instagram: '',
      horaires: '',
      tags: [],
      email_soumetteur: '',
      nom_soumetteur: '',
      commentaire_soumetteur: '',
    });
    setImages([]);
    setImagePreviews([]);
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

            {/* Erreur globale */}
            {error && (
              <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
              </div>
            )}

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
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Restaurant Mami Wata"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Décrivez votre établissement en détail..."
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Catégorie *
                </label>
                <select
                  name="categorie"
                  required
                  value={formData.categorie}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quartier */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Quartier *
                </label>
                <select
                  name="quartier"
                  required
                  value={formData.quartier}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Sélectionnez un quartier</option>
                  {quartiers.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.nom}, {q.ville}
                    </option>
                  ))}
                </select>
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
                    name="adresse"
                    required
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Avenue Félix Éboué, face au fleuve Congo"
                  />
                </div>
              </div>

              {/* Grid 2 colonnes - GPS (optionnel) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Latitude (optionnel)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="-4.2634"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Longitude (optionnel)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="15.2429"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+242 06 123 45 67"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Email établissement
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="contact@etablissement.cg"
                    />
                  </div>
                </div>
              </div>

              {/* Site web et réseaux sociaux */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Site web (optionnel)
                  </label>
                  <input
                    type="url"
                    name="site_web"
                    value={formData.site_web}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Services / Tags (optionnel)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          formData.tags.includes(tag.id)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag.nom}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Photos de l'établissement * (1-10 images)
                </label>
                
                {/* Upload zone */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Cliquez pour ajouter des images
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Max 10MB par image, 10 images maximum
                    </p>
                  </label>
                </div>

                {/* Preview des images */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                            Principale
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {images.length} image{images.length > 1 ? 's' : ''} sélectionnée{images.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Séparation */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-dark mb-4">
                  Vos informations de contact
                </h3>

                {/* Nom soumetteur */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Votre nom (optionnel)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                    <input
                      type="text"
                      name="nom_soumetteur"
                      value={formData.nom_soumetteur}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Email soumetteur */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Votre email * (pour vous contacter)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                    <input
                      type="email"
                      name="email_soumetteur"
                      required
                      value={formData.email_soumetteur}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Commentaire */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Commentaire additionnel (optionnel)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray" />
                    <textarea
                      name="commentaire_soumetteur"
                      value={formData.commentaire_soumetteur}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Ajoutez des informations complémentaires..."
                    />
                  </div>
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
                * Champs obligatoires | Au moins un moyen de contact requis
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
              Merci pour votre inscription ! Votre établissement est en cours de validation.
              Vous recevrez un email à <strong>{formData.email_soumetteur}</strong> dès 
              qu'il sera validé (généralement sous 24-48h).
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