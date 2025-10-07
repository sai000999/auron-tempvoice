import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Shield, Ticket, Mic, Coins, MessageSquare, Activity, Bell, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, title: "AI Automod", desc: "Smart spam detection and filtering" },
    { icon: Ticket, title: "Ticket System", desc: "Thread-based support tickets" },
    { icon: Mic, title: "Temp VC", desc: "Dynamic voice channels with full control" },
    { icon: Coins, title: "Economy", desc: "Coins, XP, and shop system" },
    { icon: MessageSquare, title: "Welcome", desc: "Customizable welcome messages" },
    { icon: Activity, title: "Monitor", desc: "Keep channels active automatically" },
    { icon: Bell, title: "Logging", desc: "Track all server events" },
    { icon: Bot, title: "Dual Commands", desc: "Both / and . prefix support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <div className="container mx-auto px-6 py-16 space-y-16">
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block p-4 rounded-2xl bg-gradient-primary shadow-glow mb-4">
            <Bot className="w-16 h-16 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Auron Bot
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Professional all-in-one Discord bot with a stunning management dashboard
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="text-lg px-8 py-6 shadow-glow"
          >
            Open Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="p-6 space-y-4 shadow-card hover:shadow-glow hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-3 rounded-lg bg-primary/10 w-fit">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 md:p-12 text-center space-y-6 shadow-card bg-gradient-card">
          <h2 className="text-3xl font-bold">Complete Control at Your Fingertips</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Configure everything through the beautiful web dashboard. No coding required.
            Your bot connects to the same database for instant updates.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;
