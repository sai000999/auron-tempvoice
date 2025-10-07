import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface InactivitySettingsProps {
  guildId: string;
}

export const InactivitySettings = ({ guildId }: InactivitySettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    enabled: false,
    monitored_channel_id: "",
    timeout_minutes: 15,
  });

  useEffect(() => {
    loadConfig();
  }, [guildId]);

  const loadConfig = async () => {
    const { data } = await supabase
      .from("inactivity_config")
      .select("*")
      .eq("guild_id", guildId)
      .single();

    if (data) setConfig(data);
  };

  const saveConfig = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("inactivity_config")
      .upsert({ guild_id: guildId, ...config });

    setLoading(false);

    if (!error) {
      toast({ title: "Success", description: "Inactivity monitor settings saved" });
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div>
        <h2 className="text-2xl font-bold mb-2">Inactivity Monitor</h2>
        <p className="text-sm text-muted-foreground">
          Send questions when a channel is inactive
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Enable Inactivity Monitor</Label>
          <p className="text-xs text-muted-foreground">
            Send random questions to keep channels active
          </p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
        />
      </div>

      <div className="space-y-2">
        <Label>Monitored Channel ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.monitored_channel_id}
          onChange={(e) =>
            setConfig({ ...config, monitored_channel_id: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground">
          Channel to monitor for inactivity
        </p>
      </div>

      <div className="space-y-2">
        <Label>Timeout (minutes)</Label>
        <Input
          type="number"
          value={config.timeout_minutes}
          onChange={(e) =>
            setConfig({ ...config, timeout_minutes: parseInt(e.target.value) })
          }
        />
        <p className="text-xs text-muted-foreground">
          Send a question if no messages for this long
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