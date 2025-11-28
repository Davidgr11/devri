/**
 * Admin Settings Page
 * Manage site configuration
 */

'use client';

import { useEffect, useState } from 'react';
import { Save, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea } from '@/components/ui';
import type { SiteConfig } from '@/types';

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const supabase = createClient();

    try {
      const { data } = await supabase
        .from('site_config')
        .select('*')
        .single();

      setConfig(data);
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setIsSaving(true);
    setSaveSuccess(false);

    const supabase = createClient();

    try {
      await supabase
        .from('site_config')
        .update({
          contact_email: config.contact_email,
          contact_phone: config.contact_phone,
          contact_whatsapp: config.contact_whatsapp,
          contact_address: config.contact_address,
          social_facebook: config.social_facebook,
          social_instagram: config.social_instagram,
          social_twitter: config.social_twitter,
          social_linkedin: config.social_linkedin,
          seo_title: config.seo_title,
          seo_description: config.seo_description,
          seo_keywords: config.seo_keywords,
        })
        .eq('id', config.id);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  if (!config) {
    return <div className="text-center py-12 text-red-600">Error: No se encontró la configuración</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sitio</h1>
        <p className="text-gray-600 mt-1">
          Administra la información de contacto, redes sociales y SEO
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          ¡Configuración guardada exitosamente!
        </div>
      )}

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Email de contacto"
              type="email"
              value={config.contact_email || ''}
              onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
              fullWidth
              placeholder="contacto@devrisolutions.com"
            />
            <Input
              label="Teléfono"
              type="tel"
              value={config.contact_phone || ''}
              onChange={(e) => setConfig({ ...config, contact_phone: e.target.value })}
              fullWidth
              placeholder="55 1234 5678"
            />
            <Input
              label="WhatsApp"
              type="tel"
              value={config.contact_whatsapp || ''}
              onChange={(e) => setConfig({ ...config, contact_whatsapp: e.target.value })}
              fullWidth
              placeholder="5215512345678"
            />
            <Input
              label="Dirección"
              value={config.contact_address || ''}
              onChange={(e) => setConfig({ ...config, contact_address: e.target.value })}
              fullWidth
              placeholder="Ciudad de México, México"
              icon={<MapPin className="w-5 h-5" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Redes Sociales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Facebook"
              value={config.social_facebook || ''}
              onChange={(e) => setConfig({ ...config, social_facebook: e.target.value })}
              fullWidth
              placeholder="https://facebook.com/devrisolutions"
            />
            <Input
              label="Instagram"
              value={config.social_instagram || ''}
              onChange={(e) => setConfig({ ...config, social_instagram: e.target.value })}
              fullWidth
              placeholder="https://instagram.com/devrisolutions"
            />
            <Input
              label="Twitter/X"
              value={config.social_twitter || ''}
              onChange={(e) => setConfig({ ...config, social_twitter: e.target.value })}
              fullWidth
              placeholder="https://twitter.com/devrisolutions"
            />
            <Input
              label="LinkedIn"
              value={config.social_linkedin || ''}
              onChange={(e) => setConfig({ ...config, social_linkedin: e.target.value })}
              fullWidth
              placeholder="https://linkedin.com/company/devrisolutions"
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO y Metadatos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Título SEO"
              value={config.seo_title || ''}
              onChange={(e) => setConfig({ ...config, seo_title: e.target.value })}
              fullWidth
              placeholder="Devri Solutions - Desarrollo Web Profesional"
            />
            <Textarea
              label="Descripción SEO"
              value={config.seo_description || ''}
              onChange={(e) => setConfig({ ...config, seo_description: e.target.value })}
              fullWidth
              rows={3}
              placeholder="Creamos sitios web profesionales para emprendedores y negocios..."
            />
            <Input
              label="Palabras clave (separadas por comas)"
              value={config.seo_keywords || ''}
              onChange={(e) => setConfig({ ...config, seo_keywords: e.target.value })}
              fullWidth
              placeholder="desarrollo web, diseño web, páginas web, sitios web profesionales"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          className="flex items-center gap-2"
          size="lg"
        >
          <Save className="w-4 h-4" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
