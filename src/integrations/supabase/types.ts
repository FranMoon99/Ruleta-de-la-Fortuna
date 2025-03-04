export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      custom_roulettes: {
        Row: {
          created_at: string
          id: string
          name: string
          prizes: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          prizes?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          prizes?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      premios: {
        Row: {
          activo: boolean | null
          created_at: string
          created_by: string | null
          descripcion: string | null
          id: string
          nombre: string
          probabilidad: number | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          probabilidad?: number | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          probabilidad?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          favorite_color: string | null
          id: string
          total_spins: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          favorite_color?: string | null
          id: string
          total_spins?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          favorite_color?: string | null
          id?: string
          total_spins?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      resultados: {
        Row: {
          fecha: string
          id: string
          points_earned: number | null
          premio_id: string | null
          user_id: string | null
        }
        Insert: {
          fecha?: string
          id?: string
          points_earned?: number | null
          premio_id?: string | null
          user_id?: string | null
        }
        Update: {
          fecha?: string
          id?: string
          points_earned?: number | null
          premio_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resultados_premio_id_fkey"
            columns: ["premio_id"]
            isOneToOne: false
            referencedRelation: "premios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string
          id: string
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string
          id: string
          stats: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stats?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stats?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_custom_roulette: {
        Args: {
          user_id_param: string
          roulette_id_param: string
        }
        Returns: undefined
      }
      get_leaderboard: {
        Args: {
          limit_count?: number
        }
        Returns: {
          user_id: string
          total_points: number
          username: string
          display_name: string
          total_spins: number
        }[]
      }
      get_user_points: {
        Args: {
          user_id_param: string
        }
        Returns: number
      }
      get_user_profile: {
        Args: {
          user_id_param: string
        }
        Returns: {
          username: string
          display_name: string
          favorite_color: string
          total_spins: number
          created_at: string
          updated_at: string
        }[]
      }
      get_user_roulettes: {
        Args: {
          user_id_param: string
        }
        Returns: {
          id: string
          name: string
          prizes: Json
          created_at: string
        }[]
      }
      get_user_settings: {
        Args: {
          user_id_param: string
        }
        Returns: Json
      }
      get_user_spin_history: {
        Args: {
          user_id_param: string
          limit_count?: number
        }
        Returns: {
          id: string
          fecha: string
          premio_id: string
          points_earned: number
        }[]
      }
      get_user_stats: {
        Args: {
          user_id_param: string
        }
        Returns: Json
      }
      save_custom_roulette: {
        Args: {
          user_id_param: string
          roulette_name: string
          prizes_json: Json
        }
        Returns: string
      }
      save_spin_result: {
        Args: {
          user_id_param: string
          premio_id_param: string
          points_earned_param?: number
        }
        Returns: undefined
      }
      save_user_settings: {
        Args: {
          user_id_param: string
          settings_json: Json
        }
        Returns: undefined
      }
      sync_user_stats: {
        Args: {
          user_id_param: string
          stats_json: Json
        }
        Returns: undefined
      }
      update_user_profile: {
        Args: {
          user_id_param: string
          username_param: string
          display_name_param: string
          favorite_color_param: string
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
