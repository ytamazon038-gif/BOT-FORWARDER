import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startBotSchema, type StartBotInput, type BotStatus, ADMIN_EMAIL, DEFAULT_WELCOME_MESSAGE, DEFAULT_CUSTOMIZATION } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Bot,
  Play,
  Square,
  Loader2,
  Send,
  Key,
  Users,
  User,
  Eye,
  EyeOff,
  Activity,
  Reply,
  LogOut,
  ShieldCheck,
  ArrowRight,
  Hash,
  Fingerprint,
  MessageSquare,
  UserX,
  UserPlus,
  Zap,
  Lock,
  Trash2,
  RotateCcw,
  KeyRound,
  ExternalLink,
  Wrench,
  Clock,
  Palette,
  ChevronDown,
  Type,
  Globe,
  Shield,
  Wifi,
  Signal,
  Battery,
  ArrowLeft,
  MoreVertical,
  BookOpen,
  Pencil,
  X,
  AlertTriangle,
} from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

type PreviewTab = "start" | "group";
type CustomTab = "buttons" | "responses" | "language";

function PhonePreview({ welcomeMessage, customization, activePreviewTab, setActivePreviewTab }: {
  welcomeMessage: string;
  customization: {
    startBtnSend: string;
    startBtnOwner: string;
    startBtnHelp: string;
    startBtnLanguage: string;
    replyBtnText: string;
    exitBtnText: string;
    ownerNotice: string;
  };
  activePreviewTab: PreviewTab;
  setActivePreviewTab: (tab: PreviewTab) => void;
}) {
  const [typingDots, setTypingDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingDots((d) => (d + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[260px]">
        <div className="rounded-[2rem] border-[3px] border-[#2a2a2e] dark:border-[#444] bg-[#0e1621] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-2 pb-1 bg-[#0e1621]">
            <span className="text-[10px] text-white/50 font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-3 h-3 text-white/50" />
              <Wifi className="w-3 h-3 text-white/50" />
              <Battery className="w-3 h-3 text-white/50" />
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-[#17212b] border-b border-white/5">
            <ArrowLeft className="w-4 h-4 text-[#6ab2f2]" />
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-white truncate">Your Bot</p>
              <motion.p key={typingDots} className="text-[10px] text-[#6ab2f2]">
                {activePreviewTab === "start" ? "online" : `typing${"...".slice(0, typingDots)}`}
              </motion.p>
            </div>
            <MoreVertical className="w-4 h-4 text-white/40" />
          </div>

          <div className="flex gap-0 bg-[#0e1621] border-b border-white/5">
            <button
              onClick={() => setActivePreviewTab("start")}
              className={`flex-1 py-1.5 text-[10px] font-medium text-center transition-colors ${
                activePreviewTab === "start" ? "text-[#6ab2f2] border-b-2 border-[#6ab2f2]" : "text-white/30"
              }`}
              data-testid="button-preview-start"
            >
              /start Menu
            </button>
            <button
              onClick={() => setActivePreviewTab("group")}
              className={`flex-1 py-1.5 text-[10px] font-medium text-center transition-colors ${
                activePreviewTab === "group" ? "text-[#6ab2f2] border-b-2 border-[#6ab2f2]" : "text-white/30"
              }`}
              data-testid="button-preview-group"
            >
              Group View
            </button>
          </div>

          <div className="h-[300px] overflow-y-auto px-3 py-3 space-y-2" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}>
            <AnimatePresence mode="wait">
              {activePreviewTab === "start" ? (
                <motion.div key="start-view" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="space-y-2">
                  <p className="text-[9px] text-white/20 text-center py-1">Today</p>
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }} className="flex justify-center">
                    <div className="bg-[#182533]/80 rounded-full px-3 py-0.5">
                      <p className="text-[9px] text-white/30">/start</p>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3, type: "spring", stiffness: 200 }} className="max-w-[90%]">
                    <div className="bg-[#182533] rounded-lg rounded-tl-sm p-2.5 shadow-lg">
                      <p className="text-[11px] text-[#e4e6ea] leading-relaxed whitespace-pre-wrap break-words">{welcomeMessage || "Welcome message..."}</p>
                      <p className="text-[8px] text-white/20 text-right mt-1">9:41</p>
                    </div>
                    <div className="space-y-[3px] mt-[3px]">
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.2 }} className="bg-[#2b5278] rounded-md py-[6px] px-3 text-center cursor-default">
                        <span className="text-[11px] text-[#7eb8e4] font-medium">{customization.startBtnSend || "Send Message"}</span>
                      </motion.div>
                      <div className="grid grid-cols-2 gap-[3px]">
                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.2 }} className="bg-[#2b5278] rounded-md py-[6px] px-2 text-center">
                          <span className="text-[11px] text-[#7eb8e4] font-medium truncate block">{customization.startBtnOwner || "Owner"}</span>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.2 }} className="bg-[#2b5278] rounded-md py-[6px] px-2 text-center">
                          <span className="text-[11px] text-[#7eb8e4] font-medium truncate block">{customization.startBtnHelp || "Help"}</span>
                        </motion.div>
                      </div>
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.2 }} className="bg-[#2b5278] rounded-md py-[6px] px-3 text-center">
                        <span className="text-[11px] text-[#7eb8e4] font-medium">{customization.startBtnLanguage || "Language"}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div key="group-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-2">
                  <p className="text-[9px] text-white/20 text-center py-1">Group Chat</p>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }} className="flex justify-end">
                    <div className="max-w-[85%]">
                      <div className="bg-[#2b5278] rounded-lg rounded-tr-sm p-2.5 shadow-lg">
                        <p className="text-[10px] text-[#6ab2f2] font-medium mb-1">User sent a message</p>
                        <p className="text-[11px] text-[#e4e6ea] leading-relaxed whitespace-pre-wrap">{"Name:- John Doe\nUsername:- @johndoe\nMessage:-\n\nHello, I need help!"}</p>
                        <p className="text-[8px] text-white/20 text-right mt-1">9:42</p>
                      </div>
                      <div className="grid grid-cols-2 gap-[3px] mt-[3px]">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.2, type: "spring" }} className="bg-[#2b5278] rounded-md py-[6px] px-2 text-center">
                          <span className="text-[11px] text-[#7eb8e4] font-medium">{customization.replyBtnText || "Reply"}</span>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.2, type: "spring" }} className="bg-[#2b5278] rounded-md py-[6px] px-2 text-center">
                          <span className="text-[11px] text-[#7eb8e4] font-medium">{customization.exitBtnText || "Exit"}</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.3 }} className="max-w-[85%]">
                    <div className="bg-[#182533] rounded-lg rounded-tl-sm p-2.5 shadow-lg border border-red-500/20">
                      <p className="text-[10px] text-red-400/80 font-medium mb-1 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Non-owner tries button
                      </p>
                      <p className="text-[11px] text-[#e4e6ea]/70 leading-relaxed whitespace-pre-wrap">{customization.ownerNotice || "You are not the owner."}</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 bg-[#17212b] border-t border-white/5">
            <div className="flex-1 bg-[#242f3d] rounded-full px-3 py-1.5">
              <p className="text-[10px] text-white/20">Message</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#6ab2f2] flex items-center justify-center">
              <Send className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="h-1 bg-[#0e1621]" />
        </div>

        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-3 bg-gradient-to-br from-teal-500/10 via-transparent to-emerald-500/10 rounded-[3rem] -z-10 blur-xl"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showToken, setShowToken] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBotId, setDeleteBotId] = useState<string | null>(null);
  const [deleteOtp, setDeleteOtp] = useState("");
  const [deleteOtpSent, setDeleteOtpSent] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [customTab, setCustomTab] = useState<CustomTab>("buttons");
  const [activePreviewTab, setActivePreviewTab] = useState<PreviewTab>("start");
  const [editingBotId, setEditingBotId] = useState<string | null>(null);
  const [otpSendFailed, setOtpSendFailed] = useState(false);

  const launchSectionRef = useRef<HTMLElement>(null);

  const form = useForm<StartBotInput>({
    resolver: zodResolver(startBotSchema),
    defaultValues: {
      botToken: "",
      groupId: "",
      ownerId: "",
      welcomeMessage: DEFAULT_WELCOME_MESSAGE,
      customization: { ...DEFAULT_CUSTOMIZATION },
    },
  });

  const watchWelcome = form.watch("welcomeMessage") || DEFAULT_WELCOME_MESSAGE;
  const watchCustomization = form.watch("customization") || DEFAULT_CUSTOMIZATION;

  const { data: bots = [], isLoading: botsLoading } = useQuery<BotStatus[]>({
    queryKey: ["/api/bots"],
    refetchInterval: 5000,
  });

  const editingBot = editingBotId ? bots.find((b) => b.id === editingBotId) : null;

  useEffect(() => {
    if (editingBotId) {
      const bot = bots.find((b) => b.id === editingBotId);
      if (bot) {
        form.reset({
          botToken: "placeholder-not-needed",
          groupId: bot.groupId || "",
          ownerId: bot.ownerId || "",
          welcomeMessage: bot.welcomeMessage || DEFAULT_WELCOME_MESSAGE,
          customization: bot.customization || { ...DEFAULT_CUSTOMIZATION },
        });
        const hasCustom = bot.customization && JSON.stringify(bot.customization) !== JSON.stringify(DEFAULT_CUSTOMIZATION);
        if (hasCustom) {
          setShowCustomization(true);
        }
      }
    } else {
      form.reset({
        botToken: "",
        groupId: "",
        ownerId: "",
        welcomeMessage: DEFAULT_WELCOME_MESSAGE,
        customization: { ...DEFAULT_CUSTOMIZATION },
      });
    }
  }, [editingBotId]);

  const handleEditBot = (botId: string) => {
    setEditingBotId(botId);
    setTimeout(() => {
      launchSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingBotId(null);
    setShowCustomization(false);
  };

  const startMutation = useMutation({
    mutationFn: async (data: StartBotInput) => {
      const res = await apiRequest("POST", "/api/bots/start", data);
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Bot Started Successfully",
        description: `@${data.botUsername} is now running and ready to receive messages.`,
      });
      form.reset();
      setShowCustomization(false);
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
    },
    onError: (error: Error) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { groupId: string; ownerId: string; welcomeMessage: string; customization?: any }) => {
      const res = await apiRequest("PUT", `/api/bots/${editingBotId}`, data);
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Bot Updated",
        description: `@${data.botUsername || editingBot?.botUsername} configuration has been updated.${data.status === "running" ? " Bot was restarted with new settings." : ""}`,
      });
      form.reset();
      setEditingBotId(null);
      setShowCustomization(false);
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
    },
    onError: (error: Error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/bots/stop/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Bot Stopped", description: "The bot has been paused. You can restart it anytime." });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
    },
    onError: (error: Error) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });

  const restartMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/bots/restart/${id}`);
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({ title: "Bot Restarted", description: `@${data.botUsername} is running again.` });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
    },
    onError: (error: Error) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });

  const requestDeleteOtpMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/bots/request-delete-otp/${id}`);
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data.sent) {
        setDeleteOtpSent(true);
        setOtpSendFailed(false);
        toast({ title: "OTP Sent", description: "A verification code has been sent to the bot owner on Telegram." });
      }
    },
    onError: (error: Error) => {
      setOtpSendFailed(true);
      toast({ title: "Failed to Send OTP", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, otp }: { id: string; otp: string }) => {
      const res = await apiRequest("DELETE", `/api/bots/${id}?otp=${otp}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Bot Deleted", description: "Bot configuration has been removed." });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      setDeleteDialogOpen(false);
      setDeleteBotId(null);
      setDeleteOtp("");
      setDeleteOtpSent(false);
      setOtpSendFailed(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });

  const forceDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/bots/${id}?force=true`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Bot Deleted", description: "Bot was force-deleted (token was inactive)." });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      setDeleteDialogOpen(false);
      setDeleteBotId(null);
      setDeleteOtp("");
      setDeleteOtpSent(false);
      setOtpSendFailed(false);
    },
    onError: (error: Error) => {
      toast({ title: "Force Delete Failed", description: error.message, variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => { await apiRequest("POST", "/api/auth/logout"); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/login");
    },
  });

  const isAdmin = user?.email === ADMIN_EMAIL;
  const runningCount = bots.filter((b) => b.status === "running").length;

  const customTabs: { id: CustomTab; label: string; icon: typeof Type }[] = [
    { id: "buttons", label: "Buttons", icon: Type },
    { id: "responses", label: "Messages", icon: MessageSquare },
    { id: "language", label: "Translations", icon: Globe },
  ];

  const handleFormSubmit = (data: StartBotInput) => {
    if (editingBotId) {
      updateMutation.mutate({
        groupId: data.groupId,
        ownerId: data.ownerId,
        welcomeMessage: data.welcomeMessage,
        customization: data.customization,
      });
    } else {
      startMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg dark-glow-header">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
              <SiTelegram className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight" data-testid="text-page-title">TG Bot Service</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground truncate max-w-[120px] hidden sm:inline">{user?.email}</span>
            <ThemeToggle />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => logoutMutation.mutate()}
              data-testid="button-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* ── HERO ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          data-testid="section-bot-info"
        >
          <div className="relative overflow-hidden rounded-md border bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700 p-5 sm:p-6">
            <div className="absolute inset-0">
              <motion.div
                animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ x: [0, -10, 0], y: [0, 15, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] left-[-5%] w-40 h-40 bg-teal-300/10 rounded-full blur-2xl"
              />
            </div>
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '28px 28px'
            }} />

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center w-9 h-9 rounded-md bg-white/10 backdrop-blur-sm border border-white/10"
                >
                  <SiTelegram className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight" data-testid="text-hero-title">Telegram Bot Service</h1>
                  <p className="text-[11px] text-teal-100/60">by @Fearflesh</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-teal-50/90 leading-relaxed mb-3" data-testid="text-hero-description">
                Forward private messages to groups with Reply/Exit controls. Fully customizable.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-white/10 border-white/10 text-white text-[10px] no-default-hover-elevate no-default-active-elevate dark-glow-badge" data-testid="badge-bot-limit">
                  <Zap className="w-3 h-3 mr-1" />
                  Max 2 bots
                </Badge>
                <Badge variant="secondary" className="bg-white/10 border-white/10 text-white text-[10px] no-default-hover-elevate no-default-active-elevate dark-glow-badge" data-testid="badge-token-security">
                  <Lock className="w-3 h-3 mr-1" />
                  Secure tokens
                </Badge>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── ACTIVE BOTS ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Card className="dark-glow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-500/10 dark:bg-emerald-500/15">
                    <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold">{isAdmin ? "All Bots" : "Your Bots"}</p>
                </div>
                {runningCount > 0 && (
                  <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate" data-testid="badge-bot-count">
                    <span className="relative flex h-1.5 w-1.5 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    {runningCount} running
                  </Badge>
                )}
              </div>

              {botsLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : bots.length === 0 ? (
                <div className="text-center py-6">
                  <Bot className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No bots yet. Launch one below.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bots.map((bot) => (
                    <div
                      key={bot.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-md bg-muted/40 flex-wrap ${editingBotId === bot.id ? "ring-1 ring-primary/40" : ""}`}
                      data-testid={`card-bot-${bot.id}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${bot.status === "running" ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate" data-testid={`text-bot-username-${bot.id}`}>@{bot.botUsername}</p>
                          <p className="text-[10px] text-muted-foreground">{bot.status === "running" ? "Active" : "Stopped"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditBot(bot.id)}
                          data-testid={`button-edit-${bot.id}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        {bot.status === "running" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => stopMutation.mutate(bot.id)}
                            disabled={stopMutation.isPending}
                            data-testid={`button-stop-${bot.id}`}
                          >
                            <Square className="w-3 h-3 mr-1" />
                            Stop
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => restartMutation.mutate(bot.id)}
                            disabled={restartMutation.isPending}
                            data-testid={`button-restart-${bot.id}`}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Restart
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => { setDeleteBotId(bot.id); setDeleteDialogOpen(true); setDeleteOtpSent(false); setDeleteOtp(""); setOtpSendFailed(false); }}
                          data-testid={`button-delete-${bot.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* ── LAUNCH / EDIT BOT ── */}
        <Form {...form}>
        <motion.section
          ref={launchSectionRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="space-y-3"
          data-testid="section-launch"
        >
          <Card className="dark-glow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10">
                    {editingBotId ? <Pencil className="w-3.5 h-3.5 text-primary" /> : <Bot className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{editingBotId ? "Edit Bot" : "Launch New Bot"}</p>
                    {editingBot && (
                      <p className="text-[10px] text-muted-foreground">@{editingBot.botUsername}</p>
                    )}
                  </div>
                </div>
                {editingBotId && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    data-testid="button-cancel-edit"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    New Bot
                  </Button>
                )}
              </div>

              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
                {!editingBotId && (
                  <FormField
                    control={form.control}
                    name="botToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Bot Token</FormLabel>
                        <FormControl>
                          <div className="relative dark-glow-input">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            <Input
                              {...field}
                              type={showToken ? "text" : "password"}
                              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v"
                              className="pl-9 pr-9 text-xs"
                              data-testid="input-bot-token"
                            />
                            <button
                              type="button"
                              onClick={() => setShowToken(!showToken)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                              data-testid="button-toggle-token"
                            >
                              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="groupId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Group ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            <Input {...field} placeholder="-100..." className="pl-9 text-xs" data-testid="input-group-id" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ownerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Owner ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            <Input {...field} placeholder="123456789" className="pl-9 text-xs" data-testid="input-owner-id" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="welcomeMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Welcome Message</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Welcome! Send me a text message..."
                          className="resize-none text-xs"
                          rows={2}
                          data-testid="input-welcome-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={editingBotId ? updateMutation.isPending : startMutation.isPending}
                  className="w-full dark-glow-btn"
                  data-testid="button-start-bot"
                >
                  {(editingBotId ? updateMutation.isPending : startMutation.isPending) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingBotId ? (
                    <>
                      Update Bot
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Start Service
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* ── CUSTOMIZATION TOGGLE ── */}
          <div>
            <button
              type="button"
              onClick={() => setShowCustomization(!showCustomization)}
              className="w-full"
              data-testid="button-toggle-customization"
            >
              <Card className={`hover-elevate transition-all duration-300 ${showCustomization ? 'border-primary/30' : ''}`}>
                <CardContent className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <motion.div
                      animate={showCustomization ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-teal-500/15 to-emerald-500/15"
                    >
                      <Palette className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    </motion.div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-semibold">Customize Your Bot</p>
                      <p className="text-[10px] text-muted-foreground">Buttons, messages, and responses</p>
                    </div>
                    <motion.div animate={{ rotate: showCustomization ? 180 : 0 }} transition={{ duration: 0.3, type: "spring" }}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </button>

            <AnimatePresence>
              {showCustomization && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex gap-1 p-1 bg-muted/50 rounded-md">
                          {customTabs.map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setCustomTab(tab.id)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all duration-200 ${
                                customTab === tab.id
                                  ? "bg-background shadow-sm text-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              data-testid={`button-custom-tab-${tab.id}`}
                            >
                              <tab.icon className="w-3 h-3" />
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        <AnimatePresence mode="wait">
                          {customTab === "buttons" && (
                            <motion.div key="buttons" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="space-y-3">
                              <Card>
                                <CardContent className="p-3 space-y-2.5">
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Start Menu</p>
                                  <div className="grid grid-cols-2 gap-2.5">
                                    <FormField control={form.control} name="customization.startBtnSend" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Send</FormLabel>
                                        <FormControl><Input {...field} placeholder="Send Message" className="text-xs" data-testid="input-btn-send" /></FormControl>
                                      </FormItem>
                                    )} />
                                    <FormField control={form.control} name="customization.startBtnOwner" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Owner</FormLabel>
                                        <FormControl><Input {...field} placeholder="Owner" className="text-xs" data-testid="input-btn-owner" /></FormControl>
                                      </FormItem>
                                    )} />
                                    <FormField control={form.control} name="customization.startBtnHelp" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Help</FormLabel>
                                        <FormControl><Input {...field} placeholder="Help" className="text-xs" data-testid="input-btn-help" /></FormControl>
                                      </FormItem>
                                    )} />
                                    <FormField control={form.control} name="customization.startBtnLanguage" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Language</FormLabel>
                                        <FormControl><Input {...field} placeholder="Language" className="text-xs" data-testid="input-btn-language" /></FormControl>
                                      </FormItem>
                                    )} />
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-3 space-y-2.5">
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Group Buttons</p>
                                  <div className="grid grid-cols-2 gap-2.5">
                                    <FormField control={form.control} name="customization.replyBtnText" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Reply</FormLabel>
                                        <FormControl><Input {...field} placeholder="Reply" className="text-xs" data-testid="input-btn-reply" /></FormControl>
                                      </FormItem>
                                    )} />
                                    <FormField control={form.control} name="customization.exitBtnText" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Exit</FormLabel>
                                        <FormControl><Input {...field} placeholder="Exit" className="text-xs" data-testid="input-btn-exit" /></FormControl>
                                      </FormItem>
                                    )} />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}

                          {customTab === "responses" && (
                            <motion.div key="responses" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="space-y-3">
                              <Card>
                                <CardContent className="p-3 space-y-2.5">
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Non-Owner Notice</p>
                                  <FormField control={form.control} name="customization.ownerNotice" render={({ field }) => (
                                    <FormItem>
                                      <FormControl><Textarea {...field} className="text-xs resize-none" rows={2} data-testid="input-owner-notice" /></FormControl>
                                    </FormItem>
                                  )} />
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-3 space-y-2.5">
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Send Prompts</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <FormField control={form.control} name="customization.sendPromptEn" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">English</FormLabel>
                                        <FormControl><Textarea {...field} className="text-xs resize-none" rows={2} data-testid="input-send-en" /></FormControl>
                                      </FormItem>
                                    )} />
                                    <FormField control={form.control} name="customization.sendPromptHi" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Hinglish</FormLabel>
                                        <FormControl><Textarea {...field} className="text-xs resize-none" rows={2} data-testid="input-send-hi" /></FormControl>
                                      </FormItem>
                                    )} />
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-3 space-y-2.5">
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Owner Info</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <FormField control={form.control} name="customization.ownerInfoEn" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">English</FormLabel>
                                        <FormControl><Textarea {...field} className="text-xs resize-none" rows={2} data-testid="input-owner-en" /></FormControl>
                                      </FormItem>
                                    )} />
                                    <FormField control={form.control} name="customization.ownerInfoHi" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Hinglish</FormLabel>
                                        <FormControl><Textarea {...field} className="text-xs resize-none" rows={2} data-testid="input-owner-hi" /></FormControl>
                                      </FormItem>
                                    )} />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}

                          {customTab === "language" && (
                            <motion.div key="language" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="space-y-3">
                              <Card>
                                <CardContent className="p-3 space-y-2.5">
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Help Text</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <FormField control={form.control} name="customization.helpTextEn" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">English</FormLabel>
                                        <FormControl><Textarea {...field} className="text-xs resize-none" rows={3} data-testid="input-help-en" /></FormControl>
                                      </FormItem>
                                    )} />
                                    <FormField control={form.control} name="customization.helpTextHi" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Hinglish</FormLabel>
                                        <FormControl><Textarea {...field} className="text-xs resize-none" rows={3} data-testid="input-help-hi" /></FormControl>
                                      </FormItem>
                                    )} />
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-3 space-y-2.5">
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Text-Only Warning</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <FormField control={form.control} name="customization.textOnlyMsgEn" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">English</FormLabel>
                                        <FormControl><Input {...field} className="text-xs" data-testid="input-textonly-en" /></FormControl>
                                      </FormItem>
                                    )} />
                                    <FormField control={form.control} name="customization.textOnlyMsgHi" render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] text-muted-foreground">Hinglish</FormLabel>
                                        <FormControl><Input {...field} className="text-xs" data-testid="input-textonly-hi" /></FormControl>
                                      </FormItem>
                                    )} />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex items-start justify-center lg:sticky lg:top-20 py-2">
                        <PhonePreview
                          welcomeMessage={watchWelcome}
                          activePreviewTab={activePreviewTab}
                          setActivePreviewTab={setActivePreviewTab}
                          customization={{
                            startBtnSend: watchCustomization.startBtnSend || DEFAULT_CUSTOMIZATION.startBtnSend,
                            startBtnOwner: watchCustomization.startBtnOwner || DEFAULT_CUSTOMIZATION.startBtnOwner,
                            startBtnHelp: watchCustomization.startBtnHelp || DEFAULT_CUSTOMIZATION.startBtnHelp,
                            startBtnLanguage: watchCustomization.startBtnLanguage || DEFAULT_CUSTOMIZATION.startBtnLanguage,
                            replyBtnText: watchCustomization.replyBtnText || DEFAULT_CUSTOMIZATION.replyBtnText,
                            exitBtnText: watchCustomization.exitBtnText || DEFAULT_CUSTOMIZATION.exitBtnText,
                            ownerNotice: watchCustomization.ownerNotice || DEFAULT_CUSTOMIZATION.ownerNotice,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
        </Form>

        {/* ── SETUP INSTRUCTIONS (collapsible) ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full"
            data-testid="button-toggle-instructions"
          >
            <Card className="hover-elevate">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-500/10 dark:bg-amber-500/15">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-semibold">Setup Guide</p>
                    <p className="text-[10px] text-muted-foreground">How to create and configure your bot</p>
                  </div>
                  <motion.div animate={{ rotate: showInstructions ? 180 : 0 }} transition={{ duration: 0.3, type: "spring" }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </button>

          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  {[
                    { num: "1", title: "Create Your Bot", steps: [
                      <>Search <span className="font-medium text-foreground">@BotFather</span> on Telegram</>,
                      <>Send <span className="font-medium text-foreground">/newbot</span> and follow prompts</>,
                      <>Copy the <span className="font-medium text-foreground">Bot Token</span></>,
                    ]},
                    { num: "2", title: "Get Group ID", steps: [
                      <>Add bot to your group as <span className="font-medium text-foreground">admin</span></>,
                      <>Add <span className="font-medium text-foreground">@userinfobot</span> to get the group ID</>,
                    ]},
                    { num: "3", title: "Find Owner ID", steps: [
                      <>Message <span className="font-medium text-foreground">@userinfobot</span> directly</>,
                      <>It replies with your numeric user ID</>,
                    ]},
                    { num: "4", title: "Launch", steps: [
                      <>Paste credentials into the form above</>,
                      <>Customize if needed, then click <span className="font-medium text-foreground">Start Service</span></>,
                    ]},
                  ].map((step, i) => (
                    <Card key={step.num} data-testid={`card-instruction-${step.num}`}>
                      <CardContent className="p-3">
                        <div className="flex gap-2.5">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary shrink-0">
                            <span className="text-[10px] font-bold">{step.num}</span>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold mb-1">{step.title}</h3>
                            <ol className="space-y-0.5 text-[11px] text-muted-foreground leading-relaxed list-decimal list-inside">
                              {step.steps.map((s, j) => <li key={j}>{s}</li>)}
                            </ol>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card data-testid="card-instruction-commands">
                    <CardContent className="p-3">
                      <div className="flex gap-2.5">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold mb-1">Group Commands</h3>
                          <div className="space-y-1">
                            {[
                              { cmd: "/addbot", desc: "Add bot to another group" },
                              { cmd: "/ban", desc: "Ban a user (reply to their msg)" },
                              { cmd: "/kickall", desc: "Remove non-owner admins" },
                            ].map((c) => (
                              <p key={c.cmd} className="text-[11px]">
                                <span className="font-semibold text-foreground">{c.cmd}</span>{" "}
                                <span className="text-muted-foreground">{c.desc}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── MORE TOOLS ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <a href="https://exam-countdown-bot.replit.app" target="_blank" rel="noopener noreferrer" data-testid="link-tool-exam-countdown">
            <Card className="hover-elevate">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-teal-500 to-emerald-600 shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-xs" data-testid="text-tool-name-exam">Exam Countdown Bot</h3>
                      <Badge variant="secondary" className="text-[9px]">Live</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Countdown timer with WhatsApp reminders</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          </a>
        </motion.section>

        {/* ── FOOTER ── */}
        <div className="text-[10px] text-muted-foreground text-center pt-2 pb-6">
          <p>
            Created by{" "}
            <a href="https://t.me/Fearflesh" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:underline" data-testid="link-creator">@Fearflesh</a>
            {" "}&middot;{" "}
            <a href="https://t.me/Fearfesh" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:underline" data-testid="link-support">@Fearfesh</a>
          </p>
        </div>
      </main>

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
        if (!open) { setDeleteDialogOpen(false); setDeleteBotId(null); setDeleteOtp(""); setDeleteOtpSent(false); setOtpSendFailed(false); }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Bot</DialogTitle>
            <DialogDescription>
              {!deleteOtpSent
                ? "A verification code will be sent to the bot owner on Telegram."
                : "Enter the 6-digit code sent to the bot owner."}
            </DialogDescription>
          </DialogHeader>

          {!deleteOtpSent ? (
            <div className="space-y-3">
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} data-testid="button-cancel-delete">Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteBotId && requestDeleteOtpMutation.mutate(deleteBotId)}
                  disabled={requestDeleteOtpMutation.isPending}
                  data-testid="button-send-delete-otp"
                >
                  {requestDeleteOtpMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
                </Button>
              </DialogFooter>
              {otpSendFailed && (
                <div className="border border-amber-500/30 rounded-md p-3 bg-amber-500/5">
                  <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    OTP failed to send. You can force delete the bot without verification.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => deleteBotId && forceDeleteMutation.mutate(deleteBotId)}
                    disabled={forceDeleteMutation.isPending}
                    data-testid="button-force-delete"
                  >
                    {forceDeleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        Force Delete
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block">Verification Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    type="text"
                    placeholder="123456"
                    className="pl-9 tracking-widest text-center font-mono"
                    maxLength={6}
                    value={deleteOtp}
                    onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    data-testid="input-delete-otp"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} data-testid="button-cancel-delete-otp">Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteBotId && deleteMutation.mutate({ id: deleteBotId, otp: deleteOtp })}
                  disabled={deleteOtp.length !== 6 || deleteMutation.isPending}
                  data-testid="button-confirm-delete"
                >
                  {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Bot"}
                </Button>
              </DialogFooter>
              <div className="space-y-2">
                <button
                  onClick={() => deleteBotId && requestDeleteOtpMutation.mutate(deleteBotId)}
                  disabled={requestDeleteOtpMutation.isPending}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
                  data-testid="button-resend-delete-otp"
                >
                  Didn't receive it? Resend OTP
                </button>
                <div className="border-t pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={() => deleteBotId && forceDeleteMutation.mutate(deleteBotId)}
                    disabled={forceDeleteMutation.isPending}
                    data-testid="button-force-delete-secondary"
                  >
                    {forceDeleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        Force Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
