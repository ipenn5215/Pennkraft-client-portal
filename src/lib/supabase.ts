import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database Types
export interface User {
  id: string
  email: string
  full_name: string
  company?: string
  phone?: string
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  type: 'painting' | 'tile' | 'flooring' | 'drywall' | 'glass' | 'other'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  estimated_value: number
  actual_value?: number
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface Estimate {
  id: string
  project_id: string
  user_id: string
  title: string
  description?: string
  items: EstimateItem[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'
  valid_until?: string
  created_at: string
  updated_at: string
}

export interface EstimateItem {
  id: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  total: number
}

export interface MediaItem {
  id: string
  user_id?: string
  project_id?: string
  type: 'image' | 'video'
  url: string
  thumbnail_url?: string
  title: string
  description?: string
  category?: string
  is_public: boolean
  is_protected: boolean
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

// Auth helpers
export const signUp = async (email: string, password: string, metadata: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/portal/dashboard`
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Database helpers
export const getProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export const getProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  return { data, error }
}

export const createProject = async (project: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  return { data, error }
}

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single()

  return { data, error }
}

export const getEstimates = async (userId: string) => {
  const { data, error } = await supabase
    .from('estimates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export const getEstimate = async (estimateId: string) => {
  const { data, error } = await supabase
    .from('estimates')
    .select('*')
    .eq('id', estimateId)
    .single()

  return { data, error }
}

export const createEstimate = async (estimate: Partial<Estimate>) => {
  const { data, error } = await supabase
    .from('estimates')
    .insert(estimate)
    .select()
    .single()

  return { data, error }
}

export const updateEstimate = async (estimateId: string, updates: Partial<Estimate>) => {
  const { data, error } = await supabase
    .from('estimates')
    .update(updates)
    .eq('id', estimateId)
    .select()
    .single()

  return { data, error }
}

// Media helpers
export const getPublicMedia = async (category?: string) => {
  let query = supabase
    .from('media')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  return { data, error }
}

export const uploadMedia = async (file: File, metadata: Partial<MediaItem>) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${metadata.user_id}/${fileName}`

  // Upload file to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file)

  if (uploadError) {
    return { data: null, error: uploadError }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath)

  // Save metadata to database
  const { data, error } = await supabase
    .from('media')
    .insert({
      ...metadata,
      url: publicUrl
    })
    .select()
    .single()

  return { data, error }
}

// Admin helpers (for admin panel)
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

export const getAllProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, user:users(*)')
    .order('created_at', { ascending: false })

  return { data, error }
}

export const getAllEstimates = async () => {
  const { data, error } = await supabase
    .from('estimates')
    .select('*, project:projects(*), user:users(*)')
    .order('created_at', { ascending: false })

  return { data, error }
}

export const getDashboardMetrics = async () => {
  // Get various metrics for admin dashboard
  const [projects, estimates, users] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact' }),
    supabase.from('estimates').select('*', { count: 'exact' }),
    supabase.from('users').select('*', { count: 'exact' })
  ])

  return {
    totalProjects: projects.count || 0,
    totalEstimates: estimates.count || 0,
    totalUsers: users.count || 0,
    projects: projects.data || [],
    estimates: estimates.data || [],
    users: users.data || []
  }
}