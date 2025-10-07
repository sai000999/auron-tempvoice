import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface TempVCSettingsProps {
  guildId: string;
}

export const TempVCSettings = ({ guildId }: TempVCSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    enabled: false,
    category_id: "",
    create_vc_channel_id: "",
    interface_channel_id: "",
    auto_delete_timeout: 120,
  });

  useEffect(() => {
    loadConfig();
  }, [guildId]);

  const loadConfig = async () => {
    const { data } = await supabase
      .from("tempvc_config")
      .select("*")
      .eq("guild_id", guildId)
      .single();

    if (data) setConfig(data);
  };

  const saveConfig = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tempvc_config")
      .upsert({ guild_id: guildId, ...config });

    setLoading(false);

    if (!error) {
      toast({ title: "Success", description: "Temp VC settings saved" });
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div>
        <h2 className="text-2xl font-bold mb-2">Temporary Voice Channels</h2>
        <p className="text-sm text-muted-foreground">
          Configure temporary voice channel system
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Enable Temp VC System</Label>
          <p className="text-xs text-muted-foreground">
            Allow users to create temporary voice channels
          </p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
        />
      </div>

      <div className="space-y-2">
        <Label>Category ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.category_id}
          onChange={(e) => setConfig({ ...config, category_id: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Category where temp VCs will be created
        </p>
      </div>

      <div className="space-y-2">
        <Label>Create VC Channel ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.create_vc_channel_id}
          onChange={(e) => setConfig({ ...config, create_vc_channel_id: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Voice channel users join to create their own VC
        </p>
      </div>

      <div className="space-y-2">
        <Label>Interface Channel ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.interface_channel_id}
          onChange={(e) => setConfig({ ...config, interface_channel_id: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Text channel for VC control panels
        </p>
      </div>

      <div className="space-y-2">
        <Label>Auto-Delete Timeout (seconds)</Label>
        <Input
          type="number"
          value={config.auto_delete_timeout}
          onChange={(e) =>
            setConfig({ ...config, auto_delete_timeout: parseInt(e.target.value) })
          }
        />
        <p className="text-xs text-muted-foreground">
          How long to wait before deleting empty VCs
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