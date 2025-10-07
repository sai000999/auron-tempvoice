import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, X } from "lucide-react";

interface AutomodSettingsProps {
  guildId: string;
}

export const AutomodSettings = ({ guildId }: AutomodSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [config, setConfig] = useState({
    enabled: false,
    spam_detection: true,
    mass_mention_limit: 5,
    spam_timeout_duration: 600,
  });

  useEffect(() => {
    loadConfig();
    loadBlacklist();
  }, [guildId]);

  const loadConfig = async () => {
    const { data } = await supabase
      .from("automod_config")
      .select("*")
      .eq("guild_id", guildId)
      .single();

    if (data) setConfig(data);
  };

  const loadBlacklist = async () => {
    const { data } = await supabase
      .from("blacklisted_words")
      .select("*")
      .eq("guild_id", guildId);

    if (data) setBlacklist(data);
  };

  const saveConfig = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("automod_config")
      .upsert({ guild_id: guildId, ...config });

    setLoading(false);

    if (!error) {
      toast({ title: "Success", description: "Automod settings saved" });
    }
  };

  const addWord = async () => {
    if (!newWord.trim()) return;

    const { error } = await supabase
      .from("blacklisted_words")
      .insert({ guild_id: guildId, word: newWord.toLowerCase() });

    if (!error) {
      setNewWord("");
      loadBlacklist();
      toast({ title: "Success", description: "Word added to blacklist" });
    }
  };

  const removeWord = async (id: string) => {
    const { error } = await supabase
      .from("blacklisted_words")
      .delete()
      .eq("id", id);

    if (!error) {
      loadBlacklist();
      toast({ title: "Success", description: "Word removed from blacklist" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-6 shadow-card">
        <div>
          <h2 className="text-2xl font-bold mb-2">Automod Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Configure automatic moderation settings
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Automod</Label>
            <p className="text-xs text-muted-foreground">
              Turn on automatic moderation
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Spam Detection</Label>
            <p className="text-xs text-muted-foreground">
              Automatically timeout spammers
            </p>
          </div>
          <Switch
            checked={config.spam_detection}
            onCheckedChange={(spam_detection) =>
              setConfig({ ...config, spam_detection })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Mass Mention Limit</Label>
          <Input
            type="number"
            value={config.mass_mention_limit}
            onChange={(e) =>
              setConfig({ ...config, mass_mention_limit: parseInt(e.target.value) })
            }
          />
          <p className="text-xs text-muted-foreground">
            Maximum mentions allowed per message
          </p>
        </div>

        <div className="space-y-2">
          <Label>Spam Timeout Duration (seconds)</Label>
          <Input
            type="number"
            value={config.spam_timeout_duration}
            onChange={(e) =>
              setConfig({ ...config, spam_timeout_duration: parseInt(e.target.value) })
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
        <div>
          <h3 className="text-xl font-bold mb-2">Blacklisted Words</h3>
          <p className="text-sm text-muted-foreground">
            Manage the list of banned words
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a word to blacklist..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addWord()}
          />
          <Button onClick={addWord}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {blacklist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
            >
              <span className="font-mono">{item.word}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWord(item.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {blacklist.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No blacklisted words yet
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};