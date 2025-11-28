/**
 * Common Supabase Queries
 * Reusable database query functions
 */

import { createClient as createBrowserClient } from './client';
import type {
  ServiceCategory,
  SubscriptionPlan,
  FAQ,
  Testimonial,
  ClientLogo,
  UserProfile,
  Subscription,
  ClientWebsite,
  ContactForm,
} from '@/types';

/**
 * Get active service categories with their children
 */
export async function getServiceCategories() {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('status', 'active')
    .order('order_index');

  if (error) {
    console.error('Error loading categories:', error);
    return []; // Return empty array instead of throwing
  }

  if (!data) return [];

  // Organize into hierarchy
  const primaryCategories = (data as any).filter((cat: any) => cat.type === 'primary');
  const secondaryCategories = (data as any).filter((cat: any) => cat.type === 'secondary');

  return primaryCategories.map((primary: any) => ({
    ...primary,
    children: secondaryCategories.filter((sec: any) => sec.parent_id === primary.id),
  }));
}

/**
 * Get active subscription plans
 */
export async function getSubscriptionPlans() {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  return data as unknown as SubscriptionPlan[];
}

/**
 * Get active FAQs
 */
export async function getFAQs() {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) {
    console.error('Error loading FAQs:', error);
    return [];
  }
  return data as unknown as FAQ[] || [];
}

/**
 * Get active testimonials
 */
export async function getTestimonials() {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) {
    console.error('Error loading testimonials:', error);
    return [];
  }
  return data as unknown as Testimonial[] || [];
}

/**
 * Get active client logos
 */
export async function getClientLogos() {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('client_logos')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) {
    console.error('Error loading client logos:', error);
    return [];
  }
  return data as unknown as ClientLogo[] || [];
}

/**
 * Get site configuration by key
 */
export async function getSiteConfig(key: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .eq('key', key)
    .single();

  if (error) throw error;
  return (data as any)?.value;
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as unknown as UserProfile;
}

/**
 * Get user role
 */
export async function getUserRole(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) return 'client'; // Default to client if no role found
  return (data as any).role;
}

/**
 * Get user subscription
 */
export async function getUserSubscription(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

/**
 * Get user website
 */
export async function getUserWebsite(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('client_websites')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as unknown as ClientWebsite | null;
}

/**
 * Submit contact form
 */
export async function submitContactForm(formData: Omit<ContactForm, 'id' | 'created_at' | 'updated_at' | 'status' | 'notes'>) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('contact_forms')
    .insert(formData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as UserProfile;
}
