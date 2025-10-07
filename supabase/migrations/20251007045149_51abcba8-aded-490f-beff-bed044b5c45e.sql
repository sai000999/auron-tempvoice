-- Bot Configuration Tables

-- Main bot settings
CREATE TABLE public.bot_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  prefix TEXT DEFAULT '.',
  status TEXT DEFAULT 'Playing /help',
  embed_color TEXT DEFAULT '#2b2d31',
  accent_color TEXT DEFAULT '#ff4040',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Logging configuration
CREATE TABLE public.logging_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT false,
  server_logs_channel TEXT,
  message_logs_channel TEXT,
  mod_logs_channel TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Welcome system configuration
CREATE TABLE public.welcome_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT false,
  channel_id TEXT,
  join_role_id TEXT,
  message TEXT,
  embed_enabled BOOLEAN DEFAULT false,
  embed_title TEXT,
  embed_description TEXT,
  embed_color TEXT DEFAULT '#2b2d31',
  embed_image TEXT,
  embed_thumbnail TEXT,
  dm_enabled BOOLEAN DEFAULT false,
  dm_message TEXT,
  dm_embed_enabled BOOLEAN DEFAULT false,
  dm_embed_title TEXT,
  dm_embed_description TEXT,
  auto_decancer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Temp VC configuration
CREATE TABLE public.tempvc_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT false,
  category_id TEXT,
  create_vc_channel_id TEXT,
  interface_channel_id TEXT,
  auto_delete_timeout INTEGER DEFAULT 120,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket system configuration
CREATE TABLE public.ticket_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT false,
  channel_id TEXT,
  staff_role_id TEXT,
  transcript_channel_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Automod configuration
CREATE TABLE public.automod_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT false,
  spam_detection BOOLEAN DEFAULT true,
  mass_mention_limit INTEGER DEFAULT 5,
  spam_timeout_duration INTEGER DEFAULT 600,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blacklisted words
CREATE TABLE public.blacklisted_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL,
  word TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(guild_id, word)
);

-- Economy configuration
CREATE TABLE public.economy_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT true,
  coins_per_message INTEGER DEFAULT 5,
  coins_per_vc_10min INTEGER DEFAULT 100,
  vip_role_id TEXT,
  vcaccess_role_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shop items
CREATE TABLE public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  role_id TEXT,
  item_type TEXT DEFAULT 'role',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inactivity monitor configuration
CREATE TABLE public.inactivity_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT false,
  monitored_channel_id TEXT,
  timeout_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logging_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.welcome_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tempvc_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automod_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blacklisted_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economy_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inactivity_config ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (bot will use service role)
-- Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users" ON public.bot_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.logging_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.welcome_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.tempvc_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.ticket_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.automod_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.blacklisted_words FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.economy_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.shop_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.inactivity_config FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all config tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.bot_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.logging_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.welcome_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tempvc_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ticket_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.automod_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.economy_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.inactivity_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();