import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface WelcomeSettingsProps {
  guildId: string;
}

export const WelcomeSettings = ({ guildId }: WelcomeSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    enabled: false,
    channel_id: "",
    join_role_id: "",
    message: "",
    embed_enabled: false,
    embed_title: "",
    embed_description: "",
    embed_color: "#2b2d31",
    dm_enabled: false,
    dm_message: "",
    auto_decancer: false,
  });

  useEffect(() => {
    loadConfig();
  }, [guildId]);

  const loadConfig = async () => {
    const { data } = await supabase
      .from("welcome_config")
      .select("*")
      .eq("guild_id", guildId)
      .single();

    if (data) setConfig(data);
  };

  const saveConfig = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("welcome_config")
      .upsert({ guild_id: guildId, ...config });

    setLoading(false);

    if (!error) {
      toast({ title: "Success", description: "Welcome settings saved" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-6 shadow-card">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome System</h2>
          <p className="text-sm text-muted-foreground">
            Configure welcome messages and auto-role
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Welcome System</Label>
            <p className="text-xs text-muted-foreground">
              Send messages when users join
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
          />
        </div>

        <div className="space-y-2">
          <Label>Welcome Channel ID</Label>
          <Input
            placeholder="123456789012345678"
            value={config.channel_id}
            onChange={(e) => setConfig({ ...config, channel_id: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Auto-Assign Role ID</Label>
          <Input
            placeholder="123456789012345678"
            value={config.join_role_id}
            onChange={(e) => setConfig({ ...config, join_role_id: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Role automatically given to new members
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Label>Auto Decancer</Label>
          <Switch
            checked={config.auto_decancer}
            onCheckedChange={(auto_decancer) =>
              setConfig({ ...config, auto_decancer })
            }
          />
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

      <Card className="p-6 space-y-6 shadow-card">
        <h3 className="text-xl font-bold">Channel Message</h3>

        <div className="flex items-center justify-between">
          <Label>Enable Embed</Label>
          <Switch
            checked={config.embed_enabled}
            onCheckedChange={(embed_enabled) =>
              setConfig({ ...config, embed_enabled })
            }
          />
        </div>

        {config.embed_enabled ? (
          <>
            <div className="space-y-2">
              <Label>Embed Title</Label>
              <Input
                placeholder="Welcome!"
                value={config.embed_title}
                onChange={(e) =>
                  setConfig({ ...config, embed_title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Embed Description</Label>
              <Textarea
                placeholder="Welcome to the server!"
                value={config.embed_description}
                onChange={(e) =>
                  setConfig({ ...config, embed_description: e.target.value })
                }
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label>Welcome Message</Label>
            <Textarea
              placeholder="Welcome {user} to the server!"
              value={config.message}
              onChange={(e) => setConfig({ ...config, message: e.target.value })}
            />
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-6 shadow-card">
        <h3 className="text-xl font-bold">Direct Message</h3>

        <div className="flex items-center justify-between">
          <Label>Send DM to New Members</Label>
          <Switch
            checked={config.dm_enabled}
            onCheckedChange={(dm_enabled) => setConfig({ ...config, dm_enabled })}
          />
        </div>

        {config.dm_enabled && (
          <div className="space-y-2">
            <Label>DM Message</Label>
            <Textarea
              placeholder="Welcome! Read our rules in #rules"
              value={config.dm_message}
              onChange={(e) => setConfig({ ...config, dm_message: e.target.value })}
            />
          </div>
        )}
      </Card>
    </div>
  );
};