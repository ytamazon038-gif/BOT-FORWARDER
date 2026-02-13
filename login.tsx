import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Mail, Lock, ArrowRight, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { z } from "zod";

type ForgotStep = "email" | "otp" | "done";

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const forgotMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/auth/forgot-password", { email });
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data.sent) {
        setForgotStep("otp");
        toast({
          title: "OTP Sent",
          description: "Check your Telegram private messages from the bot.",
        });
      } else {
        toast({
          title: "Info",
          description: data.message,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: { email: string; otp: string; newPassword: string }) => {
      const res = await apiRequest("POST", "/api/auth/reset-password", data);
      return res.json();
    },
    onSuccess: () => {
      setForgotStep("done");
      toast({
        title: "Password Reset",
        description: "Your password has been reset. You can now sign in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function handleBackToLogin() {
    setShowForgot(false);
    setForgotStep("email");
    setForgotEmail("");
    setForgotOtp("");
    setForgotNewPassword("");
  }

  return (
    <div className="min-h-screen flex relative">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700" />
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: [0, 20, -15, 10, 0], y: [0, -15, 10, -5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%] w-64 h-64 bg-white/5 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ x: [0, -15, 20, -10, 0], y: [0, 10, -20, 15, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-teal-300/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 10, -10, 0], y: [0, -10, 15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl"
          />
        </div>

        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
              <SiTelegram className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">TG Bot Service</span>
          </div>

          <div className="max-w-sm">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-bold text-white leading-tight mb-4"
            >
              Manage your Telegram bots from one place
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm text-teal-100/80 leading-relaxed"
            >
              Forward private messages to your group with smart reply controls. Owner-only inline buttons. Multi-bot support.
            </motion.p>
          </div>

          <p className="text-xs text-teal-200/50">
            Built by @Fearflesh
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <div className="lg:hidden flex items-center justify-between gap-3 p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10">
              <SiTelegram className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-base font-semibold tracking-tight">TG Bot Service</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center p-5">
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              {!showForgot ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-7">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="lg:hidden mb-5"
                      data-testid="section-mobile-welcome"
                    >
                      <div className="rounded-md border bg-gradient-to-br from-teal-600/90 via-emerald-600/90 to-cyan-700/90 p-4 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.04]" style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                          backgroundSize: '24px 24px'
                        }} />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-2">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <SiTelegram className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-sm font-semibold text-white">Telegram Bot Service</span>
                          </div>
                          <p className="text-xs text-teal-50/80 leading-relaxed" data-testid="text-mobile-welcome">
                            Forward private messages to groups with Reply/Exit controls. Fully customizable multi-bot support.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <h1 className="text-xl font-bold tracking-tight mb-1.5" data-testid="text-login-title">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                      Sign in to your account to continue
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit((d) => loginMutation.mutate(d))} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Email</FormLabel>
                            <FormControl>
                              <div className="relative dark-glow-input">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                <Input {...field} type="email" placeholder="you@example.com" className="pl-9" data-testid="input-email" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <FormLabel className="text-xs font-medium">Password</FormLabel>
                              <button
                                type="button"
                                onClick={() => setShowForgot(true)}
                                className="text-xs text-primary hover:underline"
                                data-testid="link-forgot-password"
                              >
                                Forgot password?
                              </button>
                            </div>
                            <FormControl>
                              <div className="relative dark-glow-input">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                <Input {...field} type="password" placeholder="Your password" className="pl-9" data-testid="input-password" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full dark-glow-btn"
                        data-testid="button-login"
                      >
                        {loginMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="w-4 h-4 ml-1.5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <a
                        href="/register"
                        onClick={(e) => { e.preventDefault(); setLocation("/register"); }}
                        className="font-medium text-primary hover:underline"
                        data-testid="link-register"
                      >
                        Create one
                      </a>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={handleBackToLogin}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    data-testid="button-back-to-login"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </button>

                  {forgotStep === "email" && (
                    <div>
                      <div className="mb-7">
                        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 mb-4">
                          <KeyRound className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight mb-1.5">Reset your password</h1>
                        <p className="text-sm text-muted-foreground">
                          Enter your email and we'll send a verification code to your Telegram via your bot.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium mb-1.5 block">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="pl-9"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              data-testid="input-forgot-email"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => forgotMutation.mutate(forgotEmail)}
                          disabled={!forgotEmail || forgotMutation.isPending}
                          className="w-full"
                          data-testid="button-send-otp"
                        >
                          {forgotMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              Send OTP
                              <ArrowRight className="w-4 h-4 ml-1.5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {forgotStep === "otp" && (
                    <div>
                      <div className="mb-7">
                        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 mb-4">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight mb-1.5">Enter verification code</h1>
                        <p className="text-sm text-muted-foreground">
                          A 6-digit code was sent to your Telegram. Check your private messages from the bot.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium mb-1.5 block">OTP Code</label>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            <Input
                              type="text"
                              placeholder="123456"
                              className="pl-9 tracking-widest text-center font-mono"
                              maxLength={6}
                              value={forgotOtp}
                              onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              data-testid="input-forgot-otp"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1.5 block">New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            <Input
                              type="password"
                              placeholder="New password (min 6 chars)"
                              className="pl-9"
                              value={forgotNewPassword}
                              onChange={(e) => setForgotNewPassword(e.target.value)}
                              data-testid="input-forgot-new-password"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => resetMutation.mutate({ email: forgotEmail, otp: forgotOtp, newPassword: forgotNewPassword })}
                          disabled={forgotOtp.length !== 6 || forgotNewPassword.length < 6 || resetMutation.isPending}
                          className="w-full"
                          data-testid="button-reset-password"
                        >
                          {resetMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              Reset Password
                              <ArrowRight className="w-4 h-4 ml-1.5" />
                            </>
                          )}
                        </Button>
                        <button
                          onClick={() => forgotMutation.mutate(forgotEmail)}
                          disabled={forgotMutation.isPending}
                          className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
                          data-testid="button-resend-otp"
                        >
                          Didn't receive it? Resend OTP
                        </button>
                      </div>
                    </div>
                  )}

                  {forgotStep === "done" && (
                    <div>
                      <div className="mb-7 text-center">
                        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-emerald-500/10 mb-4 mx-auto">
                          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight mb-1.5">Password Reset</h1>
                        <p className="text-sm text-muted-foreground">
                          Your password has been successfully reset. You can now sign in with your new password.
                        </p>
                      </div>
                      <Button
                        onClick={handleBackToLogin}
                        className="w-full"
                        data-testid="button-back-to-signin"
                      >
                        Back to Sign In
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
