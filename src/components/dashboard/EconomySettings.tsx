import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface EconomySettingsProps {
  guildId: string;
}

export const EconomySettings = ({ guildId }: EconomySettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    enabled: true,
    coins_per_message: 5,
    coins_per_vc_10min: 100,
    vip_role_id: "",
    vcaccess_role_id: "",
  });

  useEffect(() => {
    loadConfig();
  }, [guildId]);

  const loadConfig = async () => {
    const { data } = await supabase
      .from("economy_config")
      .select("*")
      .eq("guild_id", guildId)
      .single();

    if (data) setConfig(data);
  };

  const saveConfig = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("economy_config")
      .upsert({ guild_id: guildId, ...config });

    setLoading(false);

    if (!error) {
      toast({ title: "Success", description: "Economy settings saved" });
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div>
        <h2 className="text-2xl font-bold mb-2">Economy System</h2>
        <p className="text-sm text-muted-foreground">
          Configure the economy and leveling system
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Enable Economy</Label>
          <p className="text-xs text-muted-foreground">
            Turn on the coin and XP system
          </p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
        />
      </div>

      <div className="space-y-2">
        <Label>Coins Per Message</Label>
        <Input
          type="number"
          value={config.coins_per_message}
          onChange={(e) =>
            setConfig({ ...config, coins_per_message: parseInt(e.target.value) })
          }
        />
        <p className="text-xs text-muted-foreground">
          Coins earned every 10 messages
        </p>
      </div>

      <div className="space-y-2">
        <Label>Coins Per 10 Minutes in VC</Label>
        <Input
          type="number"
          value={config.coins_per_vc_10min}
          onChange={(e) =>
            setConfig({ ...config, coins_per_vc_10min: parseInt(e.target.value) })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>VIP Role ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.vip_role_id}
          onChange={(e) => setConfig({ ...config, vip_role_id: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Role users can purchase from the shop
        </p>
      </div>

      <div className="space-y-2">
        <Label>VC Access Role ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.vcaccess_role_id}
          onChange={(e) => setConfig({ ...config, vcaccess_role_id: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Role for accessing private VCs
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