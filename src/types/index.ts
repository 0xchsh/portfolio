import { Database } from './database'

export type User = Database['public']['Tables']['users']['Row']
export type List = Database['public']['Tables']['lists']['Row'] & {
  user: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url'>
  links?: Link[]
  _count?: {
    links: number
  }
}
export type Link = Database['public']['Tables']['links']['Row']

export type CreateListInput = Database['public']['Tables']['lists']['Insert']
export type UpdateListInput = Database['public']['Tables']['lists']['Update']
export type CreateLinkInput = Database['public']['Tables']['links']['Insert']
export type UpdateLinkInput = Database['public']['Tables']['links']['Update']

export interface LinkMetadata {
  title: string
  description?: string
  image?: string
  favicon?: string
  url: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    username?: string
    display_name?: string
    avatar_url?: string
  }
}

export * from './database'