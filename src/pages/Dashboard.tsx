import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Shield, Ticket, Mic, Coins, MessageSquare, Activity, Bell } from "lucide-react";
import { BotSettings } from "@/components/dashboard/BotSettings";
import { AutomodSettings } from "@/components/dashboard/AutomodSettings";
import { TicketSettings } from "@/components/dashboard/TicketSettings";
import { TempVCSettings } from "@/components/dashboard/TempVCSettings";
import { EconomySettings } from "@/components/dashboard/EconomySettings";
import { WelcomeSettings } from "@/components/dashboard/WelcomeSettings";
import { InactivitySettings } from "@/components/dashboard/InactivitySettings";
import { LoggingSettings } from "@/components/dashboard/LoggingSettings";

const Dashboard = () => {
  const [guildId, setGuildId] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Auron Bot Dashboard
          </h1>
          <p className="text-muted-foreground">Configure your Discord bot settings</p>
        </div>

        <Card className="p-6 shadow-card border-primary/20">
          <div className="space-y-2">
            <label className="text-sm font-medium">Server ID (Guild ID)</label>
            <input
              type="text"
              placeholder="Enter your Discord Server ID"
              value={guildId}
              onChange={(e) => setGuildId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <p className="text-xs text-muted-foreground">
              Right-click your server icon → Copy Server ID (Developer Mode must be enabled)
            </p>
          </div>
        </Card>

        {guildId && (
          <Tabs defaultValue="bot" className="space-y-6">
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-card p-2 rounded-xl">
              <TabsTrigger value="bot" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">Bot</span>
              </TabsTrigger>
              <TabsTrigger value="automod" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Automod</span>
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                <span className="hidden sm:inline">Tickets</span>
              </TabsTrigger>
              <TabsTrigger value="tempvc" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Temp VC</span>
              </TabsTrigger>
              <TabsTrigger value="economy" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span className="hidden sm:inline">Economy</span>
              </TabsTrigger>
              <TabsTrigger value="welcome" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Welcome</span>
              </TabsTrigger>
              <TabsTrigger value="inactivity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Monitor</span>
              </TabsTrigger>
              <TabsTrigger value="logging" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Logging</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bot">
              <BotSettings guildId={guildId} />
            </TabsContent>
            <TabsContent value="automod">
              <AutomodSettings guildId={guildId} />
            </TabsContent>
            <TabsContent value="tickets">
              <TicketSettings guildId={guildId} />
            </TabsContent>
            <TabsContent value="tempvc">
              <TempVCSettings guildId={guildId} />
            </TabsContent>
            <TabsContent value="economy">
              <EconomySettings guildId={guildId} />
            </TabsContent>
            <TabsContent value="welcome">
              <WelcomeSettings guildId={guildId} />
            </TabsContent>
            <TabsContent value="inactivity">
              <InactivitySettings guildId={guildId} />
            </TabsContent>
            <TabsContent value="logging">
              <LoggingSettings guildId={guildId} />
            </TabsContent>
          </Tabs>
        )}

        {!guildId && (
          <Card className="p-12 text-center shadow-card border-dashed">
            <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Enter Your Server ID</h3>
            <p className="text-muted-foreground">
              Enter your Discord Server ID above to start configuring your bot
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;