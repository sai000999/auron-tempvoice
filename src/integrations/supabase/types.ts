export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      automod_config: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          guild_id: string
          id: string
          mass_mention_limit: number | null
          spam_detection: boolean | null
          spam_timeout_duration: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          guild_id: string
          id?: string
          mass_mention_limit?: number | null
          spam_detection?: boolean | null
          spam_timeout_duration?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          guild_id?: string
          id?: string
          mass_mention_limit?: number | null
          spam_detection?: boolean | null
          spam_timeout_duration?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blacklisted_words: {
        Row: {
          created_at: string | null
          guild_id: string
          id: string
          word: string
        }
        Insert: {
          created_at?: string | null
          guild_id: string
          id?: string
          word: string
        }
        Update: {
          created_at?: string | null
          guild_id?: string
          id?: string
          word?: string
        }
        Relationships: []
      }
      bot_settings: {
        Row: {
          accent_color: string | null
          created_at: string | null
          embed_color: string | null
          guild_id: string
          id: string
          prefix: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          created_at?: string | null
          embed_color?: string | null
          guild_id: string
          id?: string
          prefix?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          created_at?: string | null
          embed_color?: string | null
          guild_id?: string
          id?: string
          prefix?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      economy_config: {
        Row: {
          coins_per_message: number | null
          coins_per_vc_10min: number | null
          created_at: string | null
          enabled: boolean | null
          guild_id: string
          id: string
          updated_at: string | null
          vcaccess_role_id: string | null
          vip_role_id: string | null
        }
        Insert: {
          coins_per_message?: number | null
          coins_per_vc_10min?: number | null
          created_at?: string | null
          enabled?: boolean | null
          guild_id: string
          id?: string
          updated_at?: string | null
          vcaccess_role_id?: string | null
          vip_role_id?: string | null
        }
        Update: {
          coins_per_message?: number | null
          coins_per_vc_10min?: number | null
          created_at?: string | null
          enabled?: boolean | null
          guild_id?: string
          id?: string
          updated_at?: string | null
          vcaccess_role_id?: string | null
          vip_role_id?: string | null
        }
        Relationships: []
      }
      inactivity_config: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          guild_id: string
          id: string
          monitored_channel_id: string | null
          timeout_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          guild_id: string
          id?: string
          monitored_channel_id?: string | null
          timeout_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          guild_id?: string
          id?: string
          monitored_channel_id?: string | null
          timeout_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      logging_config: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          guild_id: string
          id: string
          message_logs_channel: string | null
          mod_logs_channel: string | null
          server_logs_channel: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          guild_id: string
          id?: string
          message_logs_channel?: string | null
          mod_logs_channel?: string | null
          server_logs_channel?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          guild_id?: string
          id?: string
          message_logs_channel?: string | null
          mod_logs_channel?: string | null
          server_logs_channel?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          created_at: string | null
          description: string | null
          guild_id: string
          id: string
          item_type: string | null
          name: string
          price: number
          role_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          guild_id: string
          id?: string
          item_type?: string | null
          name: string
          price: number
          role_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          guild_id?: string
          id?: string
          item_type?: string | null
          name?: string
          price?: number
          role_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tempvc_config: {
        Row: {
          auto_delete_timeout: number | null
          category_id: string | null
          create_vc_channel_id: string | null
          created_at: string | null
          enabled: boolean | null
          guild_id: string
          id: string
          interface_channel_id: string | null
          updated_at: string | null
        }
        Insert: {
          auto_delete_timeout?: number | null
          category_id?: string | null
          create_vc_channel_id?: string | null
          created_at?: string | null
          enabled?: boolean | null
          guild_id: string
          id?: string
          interface_channel_id?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_delete_timeout?: number | null
          category_id?: string | null
          create_vc_channel_id?: string | null
          created_at?: string | null
          enabled?: boolean | null
          guild_id?: string
          id?: string
          interface_channel_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ticket_config: {
        Row: {
          channel_id: string | null
          created_at: string | null
          enabled: boolean | null
          guild_id: string
          id: string
          staff_role_id: string | null
          transcript_channel_id: string | null
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          enabled?: boolean | null
          guild_id: string
          id?: string
          staff_role_id?: string | null
          transcript_channel_id?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          enabled?: boolean | null
          guild_id?: string
          id?: string
          staff_role_id?: string | null
          transcript_channel_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      welcome_config: {
        Row: {
          auto_decancer: boolean | null
          channel_id: string | null
          created_at: string | null
          dm_embed_description: string | null
          dm_embed_enabled: boolean | null
          dm_embed_title: string | null
          dm_enabled: boolean | null
          dm_message: string | null
          embed_color: string | null
          embed_description: string | null
          embed_enabled: boolean | null
          embed_image: string | null
          embed_thumbnail: string | null
          embed_title: string | null
          enabled: boolean | null
          guild_id: string
          id: string
          join_role_id: string | null
          message: string | null
          updated_at: string | null
        }
        Insert: {
          auto_decancer?: boolean | null
          channel_id?: string | null
          created_at?: string | null
          dm_embed_description?: string | null
          dm_embed_enabled?: boolean | null
          dm_embed_title?: string | null
          dm_enabled?: boolean | null
          dm_message?: string | null
          embed_color?: string | null
          embed_description?: string | null
          embed_enabled?: boolean | null
          embed_image?: string | null
          embed_thumbnail?: string | null
          embed_title?: string | null
          enabled?: boolean | null
          guild_id: string
          id?: string
          join_role_id?: string | null
          message?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_decancer?: boolean | null
          channel_id?: string | null
          created_at?: string | null
          dm_embed_description?: string | null
          dm_embed_enabled?: boolean | null
          dm_embed_title?: string | null
          dm_enabled?: boolean | null
          dm_message?: string | null
          embed_color?: string | null
          embed_description?: string | null
          embed_enabled?: boolean | null
          embed_image?: string | null
          embed_thumbnail?: string | null
          embed_title?: string | null
          enabled?: boolean | null
          guild_id?: string
          id?: string
          join_role_id?: string | null
          message?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
