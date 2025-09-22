export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          role: 'client' | 'admin' | 'contractor'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: 'client' | 'admin' | 'contractor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: 'client' | 'admin' | 'contractor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string | null
          status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled'
          project_type: 'painting' | 'tile' | 'drywall' | 'glass' | 'flooring' | 'other' | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          description?: string | null
          status?: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled'
          project_type?: 'painting' | 'tile' | 'drywall' | 'glass' | 'flooring' | 'other' | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          description?: string | null
          status?: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled'
          project_type?: 'painting' | 'tile' | 'drywall' | 'glass' | 'flooring' | 'other' | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      estimates: {
        Row: {
          id: string
          project_id: string | null
          estimate_number: string
          status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
          subtotal: number
          tax_rate: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          valid_until: string | null
          notes: string | null
          terms: string | null
          created_at: string
          updated_at: string
          sent_at: string | null
          viewed_at: string | null
          responded_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          estimate_number: string
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          valid_until?: string | null
          notes?: string | null
          terms?: string | null
          created_at?: string
          updated_at?: string
          sent_at?: string | null
          viewed_at?: string | null
          responded_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          estimate_number?: string
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          valid_until?: string | null
          notes?: string | null
          terms?: string | null
          created_at?: string
          updated_at?: string
          sent_at?: string | null
          viewed_at?: string | null
          responded_at?: string | null
        }
      }
      tools: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          long_description: string | null
          category: 'estimating' | 'project-management' | 'analytics' | 'other' | null
          price: number
          original_price: number | null
          currency: string
          status: 'active' | 'inactive' | 'coming_soon'
          features: Json | null
          download_url: string | null
          preview_url: string | null
          documentation_url: string | null
          version: string | null
          rating: number
          reviews_count: number
          downloads_count: number
          badge: string | null
          icon: string | null
          color_scheme: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          long_description?: string | null
          category?: 'estimating' | 'project-management' | 'analytics' | 'other' | null
          price: number
          original_price?: number | null
          currency?: string
          status?: 'active' | 'inactive' | 'coming_soon'
          features?: Json | null
          download_url?: string | null
          preview_url?: string | null
          documentation_url?: string | null
          version?: string | null
          rating?: number
          reviews_count?: number
          downloads_count?: number
          badge?: string | null
          icon?: string | null
          color_scheme?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          long_description?: string | null
          category?: 'estimating' | 'project-management' | 'analytics' | 'other' | null
          price?: number
          original_price?: number | null
          currency?: string
          status?: 'active' | 'inactive' | 'coming_soon'
          features?: Json | null
          download_url?: string | null
          preview_url?: string | null
          documentation_url?: string | null
          version?: string | null
          rating?: number
          reviews_count?: number
          downloads_count?: number
          badge?: string | null
          icon?: string | null
          color_scheme?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          project_type: string | null
          message: string
          status: 'new' | 'contacted' | 'converted' | 'archived'
          source: string
          created_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          project_type?: string | null
          message: string
          status?: 'new' | 'contacted' | 'converted' | 'archived'
          source?: string
          created_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          project_type?: string | null
          message?: string
          status?: 'new' | 'contacted' | 'converted' | 'archived'
          source?: string
          created_at?: string
          responded_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}