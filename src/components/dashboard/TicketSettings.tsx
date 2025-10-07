import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface TicketSettingsProps {
  guildId: string;
}

export const TicketSettings = ({ guildId }: TicketSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    enabled: false,
    channel_id: "",
    staff_role_id: "",
    transcript_channel_id: "",
  });

  useEffect(() => {
    loadConfig();
  }, [guildId]);

  const loadConfig = async () => {
    const { data } = await supabase
      .from("ticket_config")
      .select("*")
      .eq("guild_id", guildId)
      .single();

    if (data) setConfig(data);
  };

  const saveConfig = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("ticket_config")
      .upsert({ guild_id: guildId, ...config });

    setLoading(false);

    if (!error) {
      toast({ title: "Success", description: "Ticket settings saved" });
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div>
        <h2 className="text-2xl font-bold mb-2">Ticket System</h2>
        <p className="text-sm text-muted-foreground">
          Configure the support ticket system
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Enable Ticket System</Label>
          <p className="text-xs text-muted-foreground">
            Allow users to create support tickets
          </p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
        />
      </div>

      <div className="space-y-2">
        <Label>Ticket Panel Channel ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.channel_id}
          onChange={(e) => setConfig({ ...config, channel_id: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          The channel where users can create tickets
        </p>
      </div>

      <div className="space-y-2">
        <Label>Staff Role ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.staff_role_id}
          onChange={(e) => setConfig({ ...config, staff_role_id: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Role to be pinged when tickets are created
        </p>
      </div>

      <div className="space-y-2">
        <Label>Transcript Channel ID</Label>
        <Input
          placeholder="123456789012345678"
          value={config.transcript_channel_id}
          onChange={(e) => setConfig({ ...config, transcript_channel_id: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Channel to send ticket transcripts when closed
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