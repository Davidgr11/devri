/**
 * Tipos globales de la aplicación Devri Solutions
 */

// ========== USER & AUTH ==========
export type UserRole = 'client' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string | null;
  business_type: string | null;
  business_subsector: string | null;
  business_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithRole extends UserProfile {
  role: UserRole;
  email: string;
}

// ========== SERVICE CATEGORIES ==========
export type ServiceCategoryType = 'primary' | 'secondary';
export type ServiceCategoryStatus = 'active' | 'inactive';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  callout: string | null;
  icon: string | null;
  type: ServiceCategoryType;
  parent_id: string | null;
  order_index: number;
  demo_slug: string | null;
  status: ServiceCategoryStatus;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategoryWithChildren extends ServiceCategory {
  children?: ServiceCategory[];
}

// ========== SUBSCRIPTION PLANS ==========
export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price_mxn: number;
  stripe_price_id: string | null;
  features: string[];
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// ========== CLIENT WEBSITES ==========
export type WebsiteStatus = 'pending' | 'development' | 'published';

export interface ClientWebsite {
  id: string;
  user_id: string;
  url: string | null;
  status: WebsiteStatus;
  assigned_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ========== SUBSCRIPTIONS ==========
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing';

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  actual_monthly_price: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionWithPlan extends Subscription {
  plan: SubscriptionPlan;
}

// ========== CONTACT FORMS ==========
export type ContactFormStatus = 'new' | 'in_progress' | 'completed';

export interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_type: string | null;
  message: string;
  status: ContactFormStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ========== TESTIMONIALS ==========
export interface Testimonial {
  id: string;
  name: string;
  business_name: string | null;
  rating: number;
  quote: string;
  image_url: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// ========== FAQS ==========
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ========== CLIENT LOGOS ==========
export interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ========== SITE CONFIG ==========
export interface SiteConfig {
  key: string;
  value: any; // JSONB
  updated_at: string;
}

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  hours: string;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
}

export interface SEODefaults {
  title: string;
  description: string;
  keywords: string;
}

// ========== ACTIVITY LOG ==========
export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  description: string | null;
  metadata: any | null;
  created_at: string;
}

// ========== DASHBOARD DATA ==========
export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  monthlyRevenue: number;
  totalRevenue: number;
  pendingWebsites: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

// ========== FORM DATA ==========
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  business_type: string;
  message: string;
}

export interface OnboardingData {
  business_type: string;
  business_subsector: string;
  business_description?: string;
}

// ========== API RESPONSES ==========
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ========== STRIPE ==========
export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface StripeCustomerPortalSession {
  url: string;
}
