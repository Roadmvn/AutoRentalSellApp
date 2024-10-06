'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useTranslation } from 'next-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useDropzone } from 'react-dropzone'

export default function PublierAnnonce() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'voiture',
    year: '',
    mileage: '',
    images: []
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useTranslation('common')
  const { user } = useAuth()
  const { error, handleError } = useErrorHandler()

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...acceptedFiles]
      }))
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!user) throw new Error(t('must_be_logged_in'))

      // Upload des images
      const imageUrls = await Promise.all(formData.images.map(async (image) => {
        const { data, error } = await supabase.storage
          .from('vehicle-images')
          .upload(`${user.id}/${Date.now()}-${image.name}`, image)
        if (error) throw error
        return data.path
      }))

      // Création de l'annonce
      const { data, error } = await supabase
        .from('vehicles')
        .insert([
          { ...formData, user_id: user.id, image_urls: imageUrls }
        ])

      if (error) throw error

      alert(t('ad_published_successfully'))
      router.push('/mes-annonces')
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('basic_info')}</h2>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('title')}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="voiture">{t('car')}</option>
              <option value="moto">{t('motorcycle')}</option>
            </select>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder={t('year')}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={() => setStep(2)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {t('next')}
            </button>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('details')}</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('description')}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder={t('price')}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              placeholder={t('mileage')}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                {t('back')}
              </button>
              <button 
                onClick={() => setStep(3)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {t('next')}
              </button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('images')}</h2>
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <input {...getInputProps()} />
              <p>{t('drag_drop_images')}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {formData.images.map((file, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(file)} alt="Aperçu" className="w-full h-32 object-cover rounded" />
                  <button
                    onClick={() => setFormData(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button 
                onClick={() => setStep(2)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                {t('back')}
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {loading ? t('posting') : t('post_ad')}
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('post_new_ad')}</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-8 flex justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-1/3 text-center ${s <= step ? 'text-blue-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${s <= step ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {s}
              </div>
              <div className="mt-2">{t(`step_${s}`)}</div>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
        </form>
      </div>
    </div>
  )
}