export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          display_name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          user_id: string
          emoji: string
          title: string
          description: string | null
          is_public: boolean
          price: number | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          emoji: string
          title: string
          description?: string | null
          is_public?: boolean
          price?: number | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          emoji?: string
          title?: string
          description?: string | null
          is_public?: boolean
          price?: number | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      links: {
        Row: {
          id: string
          list_id: string
          url: string
          title: string
          description: string | null
          image_url: string | null
          favicon_url: string | null
          position: number
          click_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          list_id: string
          url: string
          title: string
          description?: string | null
          image_url?: string | null
          favicon_url?: string | null
          position: number
          click_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          url?: string
          title?: string
          description?: string | null
          image_url?: string | null
          favicon_url?: string | null
          position?: number
          click_count?: number
          created_at?: string
          updated_at?: string
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