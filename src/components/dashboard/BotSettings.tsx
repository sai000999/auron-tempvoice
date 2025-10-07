import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface BotSettingsProps {
  guildId: string;
}

export const BotSettings = ({ guildId }: BotSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    prefix: ".",
    status: "Playing /help",
    embed_color: "#2b2d31",
    accent_color: "#ff4040",
  });

  useEffect(() => {
    loadSettings();
  }, [guildId]);

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from("bot_settings")
      .select("*")
      .eq("guild_id", guildId)
      .single();

    if (data) {
      setSettings({
        prefix: data.prefix,
        status: data.status,
        embed_color: data.embed_color,
        accent_color: data.accent_color,
      });
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("bot_settings")
      .upsert({ guild_id: guildId, ...settings });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Bot settings saved successfully",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div>
        <h2 className="text-2xl font-bold mb-2">Bot Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Configure basic bot settings and appearance
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="prefix">Command Prefix</Label>
          <Input
            id="prefix"
            value={settings.prefix}
            onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
            placeholder="."
          />
          <p className="text-xs text-muted-foreground">
            The prefix for text-based commands (e.g., .ban, .kick)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Bot Status</Label>
          <Input
            id="status"
            value={settings.status}
            onChange={(e) => setSettings({ ...settings, status: e.target.value })}
            placeholder="Playing /help"
          />
          <p className="text-xs text-muted-foreground">
            The status message shown on the bot's profile
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="embed_color">Embed Color</Label>
            <div className="flex gap-2">
              <Input
                id="embed_color"
                type="color"
                value={settings.embed_color}
                onChange={(e) => setSettings({ ...settings, embed_color: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={settings.embed_color}
                onChange={(e) => setSettings({ ...settings, embed_color: e.target.value })}
                placeholder="#2b2d31"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent_color">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accent_color"
                type="color"
                value={settings.accent_color}
                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={settings.accent_color}
                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                placeholder="#ff4040"
              />
            </div>
          </div>
        </div>
      </div>

      <Button onClick={saveSettings} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </>
        )}
      </Button>
    </Card>
  );
};