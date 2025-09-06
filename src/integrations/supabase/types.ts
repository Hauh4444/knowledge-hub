export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    __InternalSupabase: {
        PostgrestVersion: "13.0.4"
    }
    public: {
        Tables: {
            bookmarks: {
                Row: {
                    created_at: string | null
                    id: string
                    resource_id: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    resource_id?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    resource_id?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "bookmarks_resource_id_fkey"
                        columns: ["resource_id"]
                        isOneToOne: false
                        referencedRelation: "resources"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "bookmarks_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            collaboration_ratings: {
                Row: {
                    comment: string | null
                    created_at: string
                    id: string
                    rated_user_id: string
                    rater_id: string
                    rating: number
                    updated_at: string
                }
                Insert: {
                    comment?: string | null
                    created_at?: string
                    id?: string
                    rated_user_id: string
                    rater_id: string
                    rating: number
                    updated_at?: string
                }
                Update: {
                    comment?: string | null
                    created_at?: string
                    id?: string
                    rated_user_id?: string
                    rater_id?: string
                    rating?: number
                    updated_at?: string
                }
                Relationships: []
            }
            comments: {
                Row: {
                    author_id: string | null
                    content: string
                    created_at: string | null
                    id: string
                    parent_id: string | null
                    resource_id: string | null
                }
                Insert: {
                    author_id?: string | null
                    content: string
                    created_at?: string | null
                    id?: string
                    parent_id?: string | null
                    resource_id?: string | null
                }
                Update: {
                    author_id?: string | null
                    content?: string
                    created_at?: string | null
                    id?: string
                    parent_id?: string | null
                    resource_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "comments_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_parent_id_fkey"
                        columns: ["parent_id"]
                        isOneToOne: false
                        referencedRelation: "comments"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_resource_id_fkey"
                        columns: ["resource_id"]
                        isOneToOne: false
                        referencedRelation: "resources"
                        referencedColumns: ["id"]
                    },
                ]
            }
            connections: {
                Row: {
                    addressee_id: string
                    created_at: string
                    id: string
                    requester_id: string
                    status: string
                    updated_at: string
                }
                Insert: {
                    addressee_id: string
                    created_at?: string
                    id?: string
                    requester_id: string
                    status?: string
                    updated_at?: string
                }
                Update: {
                    addressee_id?: string
                    created_at?: string
                    id?: string
                    requester_id?: string
                    status?: string
                    updated_at?: string
                }
                Relationships: []
            }
            conversations: {
                Row: {
                    created_at: string
                    id: string
                    last_message_at: string | null
                    participant_1: string
                    participant_2: string
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    last_message_at?: string | null
                    participant_1: string
                    participant_2: string
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    last_message_at?: string | null
                    participant_1?: string
                    participant_2?: string
                    updated_at?: string
                }
                Relationships: []
            }
            help_articles: {
                Row: {
                    category: string
                    content: string
                    created_at: string
                    description: string | null
                    id: string
                    is_published: boolean | null
                    slug: string
                    tags: string[] | null
                    title: string
                    updated_at: string
                    views: number | null
                }
                Insert: {
                    category: string
                    content: string
                    created_at?: string
                    description?: string | null
                    id?: string
                    is_published?: boolean | null
                    slug: string
                    tags?: string[] | null
                    title: string
                    updated_at?: string
                    views?: number | null
                }
                Update: {
                    category?: string
                    content?: string
                    created_at?: string
                    description?: string | null
                    id?: string
                    is_published?: boolean | null
                    slug?: string
                    tags?: string[] | null
                    title?: string
                    updated_at?: string
                    views?: number | null
                }
                Relationships: []
            }
            likes: {
                Row: {
                    created_at: string
                    id: string
                    resource_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    resource_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    resource_id?: string
                    user_id?: string
                }
                Relationships: []
            }
            messages: {
                Row: {
                    content: string
                    conversation_id: string
                    created_at: string
                    id: string
                    is_read: boolean
                    sender_id: string
                    updated_at: string
                }
                Insert: {
                    content: string
                    conversation_id: string
                    created_at?: string
                    id?: string
                    is_read?: boolean
                    sender_id: string
                    updated_at?: string
                }
                Update: {
                    content?: string
                    conversation_id?: string
                    created_at?: string
                    id?: string
                    is_read?: boolean
                    sender_id?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_conversation_id_fkey"
                        columns: ["conversation_id"]
                        isOneToOne: false
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            notifications: {
                Row: {
                    created_at: string | null
                    id: string
                    is_read: boolean | null
                    link: string | null
                    message: string
                    type: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    link?: string | null
                    message: string
                    type: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    link?: string | null
                    message?: string
                    type?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "notifications_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    bio: string | null
                    created_at: string | null
                    email: string
                    id: string
                    name: string
                    reputation: number | null
                    skills: string[] | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    bio?: string | null
                    created_at?: string | null
                    email: string
                    id: string
                    name: string
                    reputation?: number | null
                    skills?: string[] | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    bio?: string | null
                    created_at?: string | null
                    email?: string
                    id?: string
                    name?: string
                    reputation?: number | null
                    skills?: string[] | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            project_tasks: {
                Row: {
                    assignee_id: string | null
                    created_at: string | null
                    description: string | null
                    due_date: string | null
                    id: string
                    project_id: string | null
                    status: string | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    assignee_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    project_id?: string | null
                    status?: string | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    assignee_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    project_id?: string | null
                    status?: string | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "project_tasks_assignee_id_fkey"
                        columns: ["assignee_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "project_tasks_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            projects: {
                Row: {
                    created_at: string | null
                    deadline: string | null
                    description: string | null
                    id: string
                    members: string[] | null
                    name: string
                    owner_id: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    deadline?: string | null
                    description?: string | null
                    id?: string
                    members?: string[] | null
                    name: string
                    owner_id?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    deadline?: string | null
                    description?: string | null
                    id?: string
                    members?: string[] | null
                    name?: string
                    owner_id?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            resource_views: {
                Row: {
                    created_at: string
                    id: string
                    ip_address: string | null
                    resource_id: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    ip_address?: string | null
                    resource_id: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    ip_address?: string | null
                    resource_id?: string
                    user_id?: string | null
                }
                Relationships: []
            }
            resources: {
                Row: {
                    author_id: string | null
                    comments_count: number | null
                    content: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    likes: number | null
                    read_time: string | null
                    tags: string[] | null
                    title: string
                    updated_at: string | null
                    views: number | null
                }
                Insert: {
                    author_id?: string | null
                    comments_count?: number | null
                    content?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    likes?: number | null
                    read_time?: string | null
                    tags?: string[] | null
                    title: string
                    updated_at?: string | null
                    views?: number | null
                }
                Update: {
                    author_id?: string | null
                    comments_count?: number | null
                    content?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    likes?: number | null
                    read_time?: string | null
                    tags?: string[] | null
                    title?: string
                    updated_at?: string | null
                    views?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "resources_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_settings: {
                Row: {
                    analytics_tracking: boolean | null
                    collaboration_alerts: boolean | null
                    created_at: string
                    dark_mode_preference: boolean | null
                    id: string
                    public_profile: boolean | null
                    push_notifications: boolean | null
                    updated_at: string
                    user_id: string
                    weekly_digest: boolean | null
                }
                Insert: {
                    analytics_tracking?: boolean | null
                    collaboration_alerts?: boolean | null
                    created_at?: string
                    dark_mode_preference?: boolean | null
                    id?: string
                    public_profile?: boolean | null
                    push_notifications?: boolean | null
                    updated_at?: string
                    user_id: string
                    weekly_digest?: boolean | null
                }
                Update: {
                    analytics_tracking?: boolean | null
                    collaboration_alerts?: boolean | null
                    created_at?: string
                    dark_mode_preference?: boolean | null
                    id?: string
                    public_profile?: boolean | null
                    push_notifications?: boolean | null
                    updated_at?: string
                    user_id?: string
                    weekly_digest?: boolean | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_collaboration_score: {
                Args: { user_id: string }
                Returns: number
            }
            get_public_profile: {
                Args: { profile_id: string }
                Returns: {
                    avatar_url: string
                    bio: string
                    created_at: string
                    id: string
                    name: string
                    reputation: number
                    skills: string[]
                }[]
            }
            get_public_profile_data: {
                Args: { profile_id: string }
                Returns: {
                    avatar_url: string
                    bio: string
                    created_at: string
                    id: string
                    name: string
                    reputation: number
                    skills: string[]
                    updated_at: string
                }[]
            }
            get_public_profiles_list: {
                Args: Record<PropertyKey, never>
                Returns: {
                    avatar_url: string
                    bio: string
                    created_at: string
                    id: string
                    name: string
                    reputation: number
                    skills: string[]
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
            | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
        ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
                Row: infer R
            }
            ? R
            : never
        : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
            | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Insert: infer I
        }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
                Insert: infer I
            }
            ? I
            : never
        : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
            | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Update: infer U
        }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
                Update: infer U
            }
            ? U
            : never
        : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
            | keyof DefaultSchema["Enums"]
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
            | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
        ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
