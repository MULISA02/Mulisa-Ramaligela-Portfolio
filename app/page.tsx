"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import React, { useState, useEffect } from "react";

import {
  Clock,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Home() {
  const [time, setTime] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [toastMessage, setToastMessage] = useState("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const glowBackground = useMotionTemplate`
    radial-gradient(800px circle at ${smoothX}px ${smoothY}px, rgba(220, 38, 38, 0.2), transparent 80%)
  `;

  useEffect(() => {
    let frame: number;

    const handleMouseMove = (e: MouseEvent) => {
      frame = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const formatTime = () =>
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    setTime(formatTime());

    const timer = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fullText = "Developer";
    let index = 0;

    const typingInterval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;

      if (index === fullText.length) {
        clearInterval(typingInterval);
      }
    }, 120);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (submitState === "success" || submitState === "error") {
      const timer = setTimeout(() => {
        setSubmitState("idle");
        setToastMessage("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [submitState]);

  const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "translate(0px, 0px)";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xlgagpde", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        setSubmitState("success");
        setToastMessage("Message sent successfully.");
      } else {
        setSubmitState("error");
        setToastMessage("Something went wrong. Please try again.");
      }
    } catch {
      setSubmitState("error");
      setToastMessage("Unable to send message right now.");
    }
  };

  const projects = [
    {
      title: "LifeTrack CLI",
      tech: ["Python", "JSON"],
      desc: "A command-line productivity tool built with Python and JSON to track habits and personal finances with reliable data persistence.",
      label: "Habit Tracking CLI",
      image: "/lifetrack-cli.png",
      github: "https://github.com/MULISA02/LifeTrack_Project",
    },
    {
      title: "Data Professional Survey Dashboard",
      tech: ["Power BI", "DAX"],
      desc: "An interactive Power BI dashboard that explores survey data from data professionals to uncover trends in roles, salaries, and tools.",
      label: "Survey Dashboard",
      image: "/powerbi-survey-v2.png",
      github: "https://github.com/MULISA02/Data-Professional-Survey-Dashboard",
    },
    {
      title: "Student Performance Analysis",
      tech: ["SQL", "MySQL"],
      desc: "Database project using SQL and MySQL to analyze student records and identify patterns in academic performance.",
      label: "Student Data Analysis",
      image: "/student-performance-sql.png",
      github: "https://github.com/MULISA02/Students-Performance",
    },
    {
      title: "Chair Design Website",
      tech: ["HTML", "CSS"],
      desc: "A responsive front-end website created to showcase a modern chair product with clean layout, styling, and user-friendly design.",
      label: "UI Design Showcase",
      image: "/chair-design.png",
      github: "https://github.com/MULISA02/Chair-design",
    },
  ];

  return (
    <main className="min-h-screen bg-[#080808] text-white px-4 py-5 sm:px-6 sm:py-6 md:p-12 lg:p-16 relative overflow-hidden font-sans selection:bg-red-500/30">
      {/* Background Glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 opacity-10"
        style={{ background: glowBackground }}
      />

      {/* Toast */}
      <AnimatePresence>
        {(submitState === "success" || submitState === "error") && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-[120] rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl px-4 py-3 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              {submitState === "success" ? (
                <CheckCircle2 size={18} className="text-red-600 shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-red-600 shrink-0" />
              )}
              <span className="text-sm text-zinc-200">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-1.5rem)] sm:w-auto sm:px-4">
          <div className="w-full sm:w-auto inline-flex justify-center bg-black/60 backdrop-blur-xl border border-white/5 px-4 sm:px-6 py-3 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-widest text-zinc-500 whitespace-nowrap">
              <a href="#home" className="hover:text-white transition-all">
                Home
              </a>
              <a href="#about" className="hover:text-white transition-all">
                About
              </a>
              <a href="#projects" className="hover:text-white transition-all">
                Projects
              </a>
              <a href="#contact" className="hover:text-white transition-all">
                Contact
              </a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section
          id="home"
          className="pt-28 sm:pt-32 pb-16 sm:pb-20 lg:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-2">
              Hi, I&apos;m <span className="font-bold">Mulisa</span>
            </h2>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight sm:tracking-tighter mb-5 sm:mb-6 leading-[0.95]">
              Data Analyst &amp;{" "}
              <span className="text-red-600">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-8 sm:mb-10">
              I build data-driven applications and systems that transform
              complex information into clear, practical solutions, combining
              analytical thinking with clean and efficient development.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center lg:justify-start">
              <a
                href="#contact"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="w-full sm:w-auto text-center bg-red-600 hover:bg-red-700 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-200 shadow-[0_0_30px_rgba(220,38,38,0.3)]"
              >
                Contact Me
              </a>

              <a
                href="#projects"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="w-full sm:w-auto text-center border border-white/10 hover:bg-white/5 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-200"
              >
                View Projects
              </a>
            </div>
          </motion.div>

          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-[#121212] border-2 border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.25)] flex items-center justify-center overflow-hidden transition-transform duration-500 group hover:scale-105">
              <Image
                src="/profile.jpg"
                alt="Mulisa Profile"
                fill
                className="object-cover object-top scale-110"
              />
            </div>
          </div>
        </section>

        {/* Bio */}
        <section
          id="about"
          className="py-16 sm:py-20 lg:py-24 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center"
        >
          <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase text-zinc-200 mb-2 text-center lg:text-left">
              About Me
            </h2>
          </div>

          <div className="aspect-square max-w-md w-full mx-auto lg:mx-0 bg-[#121212] rounded-[2rem] sm:rounded-[3rem] border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-[0_0_40px_rgba(220,38,38,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-red-600/[0.06] pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
              <div className="absolute inset-y-0 -left-1/2 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[120%] transition-all duration-1000" />
            </div>

            <Image
              src="/bio-workspace.jpg"
              alt="Mulisa Workspace"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="space-y-8 sm:space-y-10 text-center lg:text-left">
            <p className="text-zinc-400 text-base sm:text-lg md:text-xl leading-relaxed italic font-light">
              &quot;As a Data Analyst and Developer, I focus on building
              solutions that combine structured data with clean, efficient
              logic. I enjoy working across both areas — analyzing data to
              uncover insights and developing systems that turn those insights
              into practical tools. I approach my work with discipline,
              attention to detail, and a strong focus on continuous
              improvement.&quot;
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 sm:p-6 rounded-3xl border-2 border-red-600/20 bg-red-600/[0.03]">
                <h4 className="text-red-600 font-black text-[10px] uppercase tracking-widest mb-3">
                  Education
                </h4>
                <p className="text-xs font-bold leading-tight">
                  2022 - 2026
                  <br />
                  BSc CS &amp; Math
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl border-2 border-red-600/20 bg-red-600/[0.03]">
                <h4 className="text-red-600 font-black text-[10px] uppercase tracking-widest mb-3">
                  Focus
                </h4>
                <p className="text-xs font-bold leading-tight">
                  Data Analysis
                  <br />
                  Software Dev
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl border-2 border-red-600/20 bg-red-600/[0.03]">
                <h4 className="text-red-600 font-black text-[10px] uppercase tracking-widest mb-3">
                  Software
                </h4>
                <p className="text-xs font-bold leading-tight">
                  Python, SQL,
                  <br />
                  Power BI, Git
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section
          id="projects"
          className="py-16 sm:py-20 lg:py-24 border-t border-white/5"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-12 sm:mb-14 lg:mb-16 tracking-tight sm:tracking-tighter uppercase">
            Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                onMouseMove={(e) => {
                  if (window.innerWidth < 768) return;

                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;

                  e.currentTarget.style.transform = `
                    perspective(1000px)
                    rotateX(${y * -8}deg)
                    rotateY(${x * 8}deg)
                    scale(1.02)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
                }}
                className="bg-[#121212] w-full max-w-[420px] mx-auto rounded-[1.75rem] sm:rounded-[2rem] border border-white/5 overflow-hidden group relative transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15),transparent_70%)]" />

                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                  <div className="absolute inset-y-0 -left-1/2 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[120%] transition-all duration-1000" />
                </div>

                <div className="aspect-[4/2.6] sm:aspect-[4/2.5] bg-zinc-900/50 border-b border-white/5 flex flex-col justify-start overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
                      {proj.label}
                    </span>
                  </div>

                  <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">
                    {proj.title}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                    {proj.desc}
                  </p>

                  <div className="flex gap-2 mb-8 flex-wrap">
                    {proj.tech.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-zinc-800/50 text-[9px] font-black text-zinc-400 uppercase tracking-widest border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-6 border-t border-white/5 pt-5 sm:pt-6">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all"
                    >
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="py-16 sm:py-20 lg:py-24 border-t border-white/5"
        >
          <div className="mb-10 sm:mb-12 lg:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight sm:tracking-tighter uppercase text-center lg:text-left">
              Get in Touch
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-start">
            <div className="space-y-8 text-center lg:text-left">
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                I&apos;m open to data analytics and software development
                opportunities, collaborations, and meaningful projects.
              </p>

              <div className="space-y-5">
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <Mail size={18} className="text-red-600 shrink-0" />
                  <a
                    href="mailto:mulisaramaligela@gmail.com"
                    className="text-sm text-zinc-300 hover:text-white transition-colors break-all"
                  >
                    mulisaramaligela@gmail.com
                  </a>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <Phone size={18} className="text-red-600 shrink-0" />
                  <a
                    href="tel:+27648486804"
                    className="text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    +27 64 848 6804
                  </a>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <MessageCircle size={18} className="text-red-600 shrink-0" />
                  <a
                    href="https://wa.me/27648486804"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="relative rounded-[1.75rem] sm:rounded-[2rem] border border-red-600/25 bg-black/30 backdrop-blur-md p-5 sm:p-6 md:p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-red-600/[0.08] pointer-events-none" />
              <div className="absolute -inset-[1px] rounded-[1.75rem] sm:rounded-[2rem] border border-red-600/10 pointer-events-none" />

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <input
                  type="hidden"
                  name="_subject"
                  value="New Portfolio Message"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full bg-transparent border border-white/10 focus:border-red-600/40 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 transition-colors"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full bg-transparent border border-white/10 focus:border-red-600/40 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 transition-colors"
                />

                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  rows={5}
                  className="w-full bg-transparent border border-white/10 focus:border-red-600/40 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 transition-colors resize-none"
                />

                <button
                  type="submit"
                  disabled={submitState === "sending"}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_0_25px_rgba(220,38,38,0.25)]"
                >
                  {submitState === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 sm:py-16 lg:py-20 flex flex-col md:flex-row justify-between items-center border-t border-white/5 gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-red-600" />
              <span className="text-xs font-mono text-zinc-400">
                {time || "Loading..."}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-red-600" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Gauteng
              </span>
            </div>
          </div>

          <span className="text-[10px] text-center font-black text-zinc-700 uppercase tracking-[0.3em] sm:tracking-[0.4em]">
            © 2026 Mulisa Ramaligela
          </span>
        </footer>
      </div>
    </main>
  );
}
