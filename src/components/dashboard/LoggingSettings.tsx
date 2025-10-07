import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface LoggingSettingsProps {
  guildId: string;
}

export const LoggingSettings = ({ guildId }: LoggingSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    enabled: false,
    server_logs_channel: "",
    message_logs_channel: "",
    mod_logs_channel: "",
  });

  useEffect(() => {
    loadConfig();
  }, [guildId]);

  const loadConfig = async () => {
    const { data } = await supabase
      .from("logging_config")
      .select("*")
      .eq("guild_id", guildId)
      .single();

    if (data) setConfig(data);
  };

  const saveConfig = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("logging_config")
      .upsert({ guild_id: guildId, ...config });

    setLoading(false);

    if (!error) {
      toast({ title: "Success", description: "Logging settings saved" });
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div>
        <h2 className="text-2xl font-bold mb-2">Logging System</h2>
        <p className="text-sm text-muted-foreground">
          Configure server event logging
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Enable Logging</Label>
          <p className="text-xs text-muted-foreground">
            Log server events and actions
          </p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
        />
      </div>

      <div className="space-y-2">
        <Label>Server Logs Channel ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.server_logs_channel}
          onChange={(e) =>
            setConfig({ ...config, server_logs_channel: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground">
          Logs for joins, leaves, role changes, etc.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Message Logs Channel ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.message_logs_channel}
          onChange={(e) =>
            setConfig({ ...config, message_logs_channel: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground">
          Logs for message edits and deletions
        </p>
      </div>

      <div className="space-y-2">
        <Label>Mod Logs Channel ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.mod_logs_channel}
          onChange={(e) =>
            setConfig({ ...config, mod_logs_channel: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground">
          Logs for moderation actions (bans, kicks, timeouts)
        </p>
      </div>

      <Button onClick={saveConfig} disabled={loading} className="w-full">
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