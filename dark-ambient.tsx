import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";

export function AmbientBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ filter: "blur(60px)" }}>

        <motion.div
          animate={{
            x: [0, 120, -80, 140, -60, 0],
            y: [0, -50, 40, -30, 60, 0],
            rotate: [0, 8, -6, 10, -3, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-8%]"
          style={{
            width: "min(55vw, 750px)",
            height: "min(30vh, 280px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(45,212,191,0.9) 0%, rgba(0,255,200,0.4) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(16,185,129,0.45) 0%, rgba(255,255,255,0.3) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, -100, 80, -70, 110, 0],
            y: [0, 60, -50, 70, -40, 0],
            rotate: [0, -10, 8, -12, 5, 0],
          }}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5%] right-[-5%]"
          style={{
            width: "min(50vw, 700px)",
            height: "min(28vh, 260px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(168,85,247,0.85) 0%, rgba(139,92,246,0.35) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(168,130,247,0.35) 0%, rgba(255,255,255,0.25) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, 90, -110, 70, -80, 0],
            y: [0, -70, 50, -60, 40, 0],
            rotate: [45, 52, 38, 50, 42, 45],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[20%]"
          style={{
            width: "min(48vw, 650px)",
            height: "min(26vh, 250px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(6,182,212,0.85) 0%, rgba(56,189,248,0.35) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(56,189,248,0.35) 0%, rgba(255,255,255,0.25) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, -80, 100, -110, 70, 0],
            y: [0, 80, -60, 70, -80, 0],
            rotate: [-30, -22, -38, -25, -33, -30],
          }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[0%] right-[8%]"
          style={{
            width: "min(42vw, 580px)",
            height: "min(22vh, 220px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(236,72,153,0.8) 0%, rgba(244,114,182,0.3) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(244,140,182,0.35) 0%, rgba(255,255,255,0.25) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, 70, -90, 100, -60, 0],
            y: [0, -80, 60, -50, 80, 0],
            rotate: [20, 28, 14, 30, 18, 20],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[50%] right-[15%]"
          style={{
            width: "min(50vw, 680px)",
            height: "min(28vh, 260px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(0,255,170,0.8) 0%, rgba(16,185,129,0.3) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(52,211,153,0.4) 0%, rgba(255,255,255,0.28) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, -90, 70, -100, 60, 0],
            y: [0, 50, -70, 40, -60, 0],
            rotate: [-15, -8, -22, -10, -18, -15],
          }}
          transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[10%]"
          style={{
            width: "min(45vw, 620px)",
            height: "min(24vh, 230px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(251,191,36,0.75) 0%, rgba(245,158,11,0.28) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(251,207,100,0.35) 0%, rgba(255,255,255,0.25) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, 110, -80, 90, -70, 0],
            y: [0, -40, 60, -50, 40, 0],
            rotate: [60, 68, 52, 70, 56, 60],
          }}
          transition={{ duration: 33, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[35%] left-[-5%]"
          style={{
            width: "min(40vw, 560px)",
            height: "min(20vh, 210px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(99,102,241,0.8) 0%, rgba(129,140,248,0.3) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(129,160,248,0.35) 0%, rgba(255,255,255,0.25) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, -60, 90, -80, 50, 0],
            y: [0, 70, -40, 60, -50, 0],
            rotate: [-50, -42, -58, -45, -53, -50],
          }}
          transition={{ duration: 29, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[70%] right-[30%]"
          style={{
            width: "min(38vw, 540px)",
            height: "min(20vh, 200px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(34,211,238,0.75) 0%, rgba(6,182,212,0.28) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(74,222,168,0.4) 0%, rgba(255,255,255,0.28) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, 80, -100, 70, -80, 0],
            y: [0, -60, 50, -70, 40, 0],
            rotate: [30, 38, 22, 40, 26, 30],
          }}
          transition={{ duration: 31, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[25%]"
          style={{
            width: "min(36vw, 500px)",
            height: "min(18vh, 190px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(52,211,153,0.8) 0%, rgba(16,185,129,0.3) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(110,231,200,0.4) 0%, rgba(255,255,255,0.28) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, -90, 70, -60, 90, 0],
            y: [0, 40, -60, 50, -40, 0],
            rotate: [-70, -62, -78, -65, -73, -70],
          }}
          transition={{ duration: 27, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-3%] right-[40%]"
          style={{
            width: "min(34vw, 480px)",
            height: "min(18vh, 180px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(217,70,239,0.75) 0%, rgba(192,38,211,0.28) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(217,140,239,0.3) 0%, rgba(255,255,255,0.22) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, 100, -70, 110, -50, 0],
            y: [0, -40, 60, -50, 40, 0],
            rotate: [15, 22, 8, 25, 12, 15],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[40%]"
          style={{
            width: "min(32vw, 450px)",
            height: "min(16vh, 170px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(244,63,94,0.7) 0%, rgba(251,113,133,0.25) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(251,160,160,0.32) 0%, rgba(255,255,255,0.22) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, -80, 60, -90, 50, 0],
            y: [0, 50, -40, 60, -30, 0],
            rotate: [-25, -18, -32, -20, -28, -25],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] left-[15%]"
          style={{
            width: "min(30vw, 420px)",
            height: "min(15vh, 160px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(56,189,248,0.7) 0%, rgba(14,165,233,0.25) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(20,184,180,0.35) 0%, rgba(255,255,255,0.25) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, 70, -90, 80, -70, 0],
            y: [0, -60, 40, -40, 60, 0],
            rotate: [80, 88, 72, 90, 76, 80],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[5%]"
          style={{
            width: "min(28vw, 400px)",
            height: "min(14vh, 150px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(251,146,60,0.65) 0%, rgba(249,115,22,0.22) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(251,190,120,0.32) 0%, rgba(255,255,255,0.22) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, -70, 90, -80, 60, 0],
            y: [0, 60, -30, 50, -40, 0],
            rotate: [40, 48, 32, 50, 36, 40],
          }}
          transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[80%] left-[40%]"
          style={{
            width: "min(40vw, 550px)",
            height: "min(20vh, 200px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(120,255,230,0.6) 0%, rgba(0,200,180,0.2) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(16,185,145,0.38) 0%, rgba(255,255,255,0.26) 30%, transparent 65%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, 80, -60, 100, -50, 0],
            y: [0, -50, 70, -40, 50, 0],
            rotate: [-10, -2, -18, -5, -14, -10],
          }}
          transition={{ duration: 29, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] left-[50%]"
          style={{
            width: "min(35vw, 480px)",
            height: "min(16vh, 170px)",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(192,132,252,0.65) 0%, rgba(168,85,247,0.22) 30%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(192,170,252,0.3) 0%, rgba(255,255,255,0.22) 30%, transparent 65%)",
          }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isDark
            ? "rgba(10, 15, 20, 0.15)"
            : "rgba(255, 255, 255, 0.08)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          opacity: isDark ? 0.025 : 0.015,
          backgroundImage: isDark
            ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 0.5px, transparent 0)`
            : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 0.5px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      />
    </div>
  );
}

export { AmbientBackground as DarkAmbientBackground };
