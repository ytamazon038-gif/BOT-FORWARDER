import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@shared/schema";
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
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Register() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex relative">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: [0, 18, -12, 8, 0], y: [0, -12, 8, -4, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[15%] w-72 h-72 bg-white/5 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ x: [0, -12, 18, -8, 0], y: [0, 8, -18, 12, 0] }}
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] left-[10%] w-64 h-64 bg-teal-300/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 8, -8, 0], y: [0, -8, 12, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[60%] right-[40%] w-40 h-40 bg-cyan-300/10 rounded-full blur-2xl"
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
              Start managing your bots in minutes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm text-teal-100/80 leading-relaxed"
            >
              Create a free account and set up your first Telegram bot with instant message forwarding and reply controls.
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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="mb-7">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:hidden mb-5"
                data-testid="section-mobile-register-welcome"
              >
                <div className="rounded-md border bg-gradient-to-br from-emerald-600/90 via-teal-600/90 to-cyan-700/90 p-4 relative overflow-hidden">
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
                      <span className="text-sm font-semibold text-white">Get Started</span>
                    </div>
                    <p className="text-xs text-teal-50/80 leading-relaxed" data-testid="text-mobile-register-welcome">
                      Create your account and launch your first Telegram bot with instant message forwarding and reply controls.
                    </p>
                  </div>
                </div>
              </motion.div>

              <h1 className="text-xl font-bold tracking-tight mb-1.5" data-testid="text-register-title">Create your account</h1>
              <p className="text-sm text-muted-foreground">
                Get started with your Telegram bot dashboard
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => registerMutation.mutate(d))} className="space-y-4">
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
                      <FormLabel className="text-xs font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative dark-glow-input">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                          <Input {...field} type="password" placeholder="At least 6 characters" className="pl-9" data-testid="input-password" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative dark-glow-input">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                          <Input {...field} type="password" placeholder="Re-enter your password" className="pl-9" data-testid="input-confirm-password" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full dark-glow-btn"
                  data-testid="button-register"
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/login"
                  onClick={(e) => { e.preventDefault(); setLocation("/login"); }}
                  className="font-medium text-primary hover:underline"
                  data-testid="link-login"
                >
                  Sign in
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
