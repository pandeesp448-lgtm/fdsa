"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  Activity, Clock, ShieldCheck, Heart, Cpu, Briefcase, 
  ChevronRight, TrendingDown, Scissors, PieChart, Users, AlertCircle, Info, Play
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FadeInWhenVisible = ({ children, delay = 0, direction = "up", className = "" }: { children: React.ReactNode, delay?: number, direction?: "up" | "down" | "left" | "right" | "none", className?: string }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, delay, ease: "easeOut" as const } }
  };

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className={className}>
      {children}
    </motion.div>
  );
};

// 5. Survival Function Simulation
const SurvivalSimulation = () => {
  const [time, setTime] = useState(0);
  const lambda = 0.05;
  const survivalProb = Math.exp(-lambda * time);

  return (
    <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center"><TrendingDown className="mr-2 text-blue-500" /> Interactive Survival Function</h3>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-muted/50 p-4 rounded-xl border border-border">
            <span className="font-serif text-2xl text-foreground">S(t) = e<sup>-&lambda;t</sup></span>
            <p className="text-sm text-muted-foreground mt-2">&lambda; (failure rate) assumed constant (Exponential model)</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Time (t): {time} months</label>
            </div>
            <Slider 
              value={[time]} 
              onValueChange={(val) => setTime(Array.isArray(val) ? val[0] : val)} 
              max={100} 
              step={1}
              className="py-4"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Probability of Surviving past {time} months:</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(survivalProb * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex-1 h-[250px] relative border-l border-b border-foreground/20 p-2">
           <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
             <motion.path 
               d={`M 0,0 Q 50,${100 - (Math.exp(-lambda * 50)*100)} 100,${100 - (Math.exp(-lambda * 100)*100)}`}
               fill="none"
               stroke="url(#surv-grad)"
               strokeWidth="3"
               initial={{ pathLength: 0 }}
               whileInView={{ pathLength: 1 }}
               transition={{ duration: 1.5, ease: "easeOut" }}
             />
             <defs>
              <linearGradient id="surv-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <motion.circle 
              cx={time} 
              cy={100 - (survivalProb * 100)} 
              r="4" 
              fill="#ef4444"
              className="drop-shadow-md"
            />
           </svg>
        </div>
      </div>
    </div>
  );
};

// 6. Hazard Simulation
const HazardSimulation = () => {
  const [playing, setPlaying] = useState(false);
  const [timeline, setTimeline] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setTimeline(t => {
          if (t >= 100) {
            setPlaying(false);
            return 0;
          }
          return t + 1;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [playing]);

  // Just an arbitrary bathtub curve hazard function model: h(t) = a*t + b*exp(-c*t)
  const getHazard = (t: number) => {
    const bathtup = 0.005 * Math.pow(t - 50, 2) + 20;
    return bathtup;
  };

  const currentRisk = getHazard(timeline);

  return (
    <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-md mt-8">
      <h3 className="text-xl font-bold mb-4 flex items-center"><Activity className="mr-2 text-purple-500" /> Hazard Function Timeline Simulation</h3>
      <div className="space-y-6">
        
        <div className="flex items-center gap-4">
          <Button variant={playing ? "destructive" : "default"} onClick={() => setPlaying(!playing)}>
            <Play className={`w-4 h-4 mr-2 ${playing ? 'hidden' : 'block'}`} />
            {playing ? 'Stop Simulation' : 'Start Timeline'}
          </Button>
          <div className="flex-1">
             <div className="text-sm font-medium mb-2 flex justify-between">
               <span>Time: {timeline}</span>
               <span className="text-purple-500 font-bold group relative cursor-help">
                 Risk Level: {currentRisk.toFixed(1)}
                 <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full right-0 mb-2 w-48 bg-foreground text-background text-xs p-2 rounded shadow-xl pointer-events-none z-10">
                   Instantaneous risk of the event occurring right now, given survival up to this point.
                 </div>
               </span>
             </div>
             <div className="h-4 bg-muted rounded-full relative overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{ width: `${timeline}%` }}
                />
             </div>
          </div>
        </div>

        <div className="relative h-32 w-full mt-4 flex items-end">
           {Array.from({length: 50}).map((_, i) => {
             const t = i * 2;
             const h = getHazard(t);
             const isCurrent = t <= timeline && t + 2 > timeline;
             return (
               <div key={i} className="flex-1 flex flex-col justify-end items-center mx-px h-full">
                 <motion.div 
                    animate={{ 
                      height: `${(h / 40) * 100}%`,
                      backgroundColor: isCurrent ? '#a855f7' : (t < timeline ? '#e9d5ff' : '#f3f4f6')
                     }}
                    className="w-full rounded-t-sm"
                    transition={{ duration: 0.2 }}
                 />
               </div>
             )
           })}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">Bathtub Curve Example: High early risk, stable middle, rising late risk.</p>
      </div>
    </div>
  );
};

// 7. Kaplan Meier Simulation
const KaplanMeierSimulation = () => {
  const [data, setData] = useState<{time: number, isEvent: boolean}[]>([
    {time: 10, isEvent: true},
    {time: 25, isEvent: true},
    {time: 40, isEvent: false},
    {time: 60, isEvent: true},
  ]);

  const addPoint = (isEvent: boolean) => {
    const lastTime = data.length > 0 ? Math.max(...data.map(d => d.time)) : 0;
    const newTime = Math.min(100, lastTime + Math.floor(Math.random() * 15) + 5);
    if (newTime <= 100) {
      setData(prev => [...prev, { time: newTime, isEvent }].sort((a,b) => a.time - b.time));
    }
  };

  const calculateKM = () => {
    let currProv = 1.0;
    let n = data.length + 5; // starting Population
    const curve = [{ time: 0, prob: 1.0 }];
    
    data.forEach(d => {
      if (d.isEvent) {
        currProv = currProv * (1 - (1 / n));
      }
      n -= 1;
      curve.push({ time: d.time, prob: currProv });
    });
    // draw line to end if not 100
    if (curve[curve.length-1].time < 100) {
      curve.push({ time: 100, prob: currProv });
    }
    return curve;
  };

  const kmCurve = calculateKM();

  return (
    <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-md">
      <h3 className="text-xl font-bold mb-4">Kaplan-Meier Live Estimator</h3>
      
      <div className="flex gap-4 mb-8">
        <Button onClick={() => addPoint(true)} className="bg-red-500 hover:bg-red-600 text-white">
          + Add Event (Failure)
        </Button>
        <Button onClick={() => addPoint(false)} variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10">
          + Add Censored Data (Loss)
        </Button>
        <Button onClick={() => setData([])} variant="ghost" className="ml-auto">Reset</Button>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={kmCurve} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="time" type="number" domain={[0, 100]} />
            <YAxis domain={[0, 1]} tickFormatter={(v) => v.toFixed(1)} />
            <Tooltip formatter={(v: any) => [Number(v).toFixed(3), 'Survival Prob']} />
            <Line type="stepAfter" dataKey="prob" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={true} animationDuration={500} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex gap-4 text-sm justify-center">
        <span className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> Event drops the curve</span>
        <span className="flex items-center"><div className="w-3 h-3 border-2 border-blue-500 rounded-full mr-2"></div> Censored data ignores step-down, reducing denominator</span>
      </div>
    </div>
  );
};

// 10. Cox Model Interactive Demo
const CoxModelDemo = () => {
  const [age, setAge] = useState(40);
  const [bloodPressure, setBloodPressure] = useState(120);
  const [smoker, setSmoker] = useState(0);

  // Baseline hazard at 0 for demo purposes: e.g. 1.0
  // Coefficients: Age=0.03, BP=0.01, Smoker=0.8
  const hazardRatio = Math.exp((age - 40)*0.03 + (bloodPressure - 120)*0.01 + smoker*0.8);

  return (
    <div className="bg-primary/5 rounded-3xl p-6 md:p-10 border border-primary/10 mt-12">
      <h3 className="text-2xl font-bold mb-6 text-primary flex items-center"><Users className="mr-3" /> Cox Model Interactive Risk Demo</h3>
      <p className="text-muted-foreground mb-8">Adjust covariates to see how the relative Hazard Ratio changes compared to a baseline user (40yo, 120 BP, Non-smoker).</p>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between text-sm font-medium mb-2"><span>Age</span> <span>{age} yrs</span></div>
            <Slider value={[age]} onValueChange={(v) => setAge(Array.isArray(v) ? v[0] : v)} min={20} max={90} step={1} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2"><span>Blood Pressure</span> <span>{bloodPressure} mmHg</span></div>
            <Slider value={[bloodPressure]} onValueChange={(v) => setBloodPressure(Array.isArray(v) ? v[0] : v)} min={90} max={180} step={1} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2"><span>Smoker (Yes/No)</span> <span>{smoker ? 'Yes' : 'No'}</span></div>
             <div className="flex gap-4">
               <Button variant={smoker === 1 ? "default" : "outline"} onClick={() => setSmoker(1)} className="flex-1">Yes</Button>
               <Button variant={smoker === 0 ? "default" : "outline"} onClick={() => setSmoker(0)} className="flex-1">No</Button>
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-8 bg-card rounded-2xl shadow-lg border border-border relative overflow-hidden">
           <motion.div 
             className="absolute w-full h-full bg-red-500/10 pointer-events-none"
             animate={{ opacity: [0.1, Math.min(1, hazardRatio/5), 0.1] }}
             transition={{ duration: 2, repeat: Infinity }}
           />
           <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Relative Hazard Ratio</span>
           <motion.span 
             key={hazardRatio}
             initial={{ scale: 1.5, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className={`text-6xl font-extrabold ${hazardRatio > 2 ? 'text-red-500' : hazardRatio > 1 ? 'text-amber-500' : 'text-green-500'}`}
           >
             {hazardRatio.toFixed(2)}x
           </motion.span>
           <p className="text-center text-sm text-muted-foreground mt-6">
             {hazardRatio > 1 ? "Higher risk than baseline" : hazardRatio < 1 ? "Lower risk than baseline" : "Baseline risk"}
           </p>
        </div>
      </div>
    </div>
  );
};


// 13. Customer Churn Real-life
const ChurnSimulation = () => {
  const [months, setMonths] = useState(1);
  const maxMonths = 36;
  const churnProb = 1 - Math.exp(-0.08 * months);

  return (
    <div className="bg-gradient-to-br from-card to-muted border border-border p-6 md:p-12 rounded-3xl relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-6 flex items-center"><TrendingDown className="mr-3 text-amber-500" /> Real-Life Simulation: Customer Churn</h3>
        <p className="text-muted-foreground mb-8">
          Predicting the probability that a customer will cancel their subscription within a certain timeframe.
        </p>

        <div className="mb-8">
           <div className="flex justify-between text-sm font-medium mb-3">
             <span>Months Subscribed</span>
             <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full">{months} Months</span>
           </div>
           <Slider value={[months]} onValueChange={(v) => setMonths(Array.isArray(v) ? v[0] : v)} min={1} max={maxMonths} step={1} className="py-2" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Probability of Churning</span>
            <span>{(churnProb * 100).toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-muted overflow-hidden rounded-full border border-border">
            <motion.div 
               className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500"
               initial={{ width: 0 }}
               animate={{ width: `${churnProb * 100}%` }}
               transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-right italic text-muted-foreground">As time increases, the chance of churning grows asymptotically.</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setActiveTab(id);
  };

  const navLinks = ["Home", "Concepts", "Simulation", "Models", "Applications"];

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 tracking-tight">
              AD3491
            </div>
            <div className="hidden md:flex ml-10 space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeTab === link ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* 1. Hero Section */}
        <section id="Home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/20 via-background to-purple-500/20"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: '400% 400%' }}
          />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <FadeInWhenVisible delay={0.2}>
              <h2 className="text-blue-500 font-semibold tracking-wide uppercase text-sm mb-3">Fundamentals of Data Science and Analytics</h2>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.4}>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Survival Analysis
              </h1>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.6}>
              <p className="text-xl md:text-3xl font-light text-muted-foreground mb-12 italic">
                “Time-to-Event Data Analysis”
              </p>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.8} direction="up">
              <button 
                onClick={() => scrollTo("Introduction")}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Start Exploring
              </button>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* 2. Introduction */}
        <section id="Introduction" className="py-24 bg-muted/30 border-y border-border/50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold mb-6">What is Survival Analysis?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Survival Analysis is a set of statistical approaches used to investigate the time it takes for an event of interest to occur. 
                Despite its name, it is not just about "death" or "failure"; the "event" can be any occurrence, such as a customer churning, a machine breaking down, or a patient recovering.
              </p>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* 3. Key Concepts */}
        <section id="Concepts" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <FadeInWhenVisible>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold">Key Concepts</h2>
                <p className="text-muted-foreground mt-4">The fundamental building blocks of survival data</p>
              </div>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Survival Time (T)", icon: Clock, desc: "The amount of time elapsed from a specific starting point until the event occurs or the observation ends." },
                { title: "The Event", icon: Activity, desc: "The occurrence of interest (e.g., machine failure, customer churn, death, recovery)." },
                { title: "Censoring", icon: Scissors, desc: "Occurs when we have some information about individual survival time, but we don't know the exact survival time." }
              ].map((item, idx) => (
                <FadeInWhenVisible key={idx} delay={idx * 0.2}>
                  <Card className="h-full bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border group overflow-hidden relative">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <CardHeader className="relative z-10">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Censoring Types */}
        <section className="py-24 bg-muted/40">
          <div className="max-w-4xl mx-auto px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold text-center mb-12">Types of Censoring</h2>
            </FadeInWhenVisible>
            <div className="space-y-6">
              {[
                { type: "Right Censoring", desc: "The subject leaves the study before an event occurs, or the study ends before the event has occurred. (Most common)", color: "border-l-blue-500" },
                { type: "Left Censoring", desc: "The event occurred before the subject entered the study, but the exact time is unknown.", color: "border-l-purple-500" },
                { type: "Interval Censoring", desc: "The event occurs within a known time interval, but the exact time is unknown.", color: "border-l-emerald-500" }
              ].map((item, idx) => (
                <FadeInWhenVisible key={idx} delay={idx * 0.3} direction="right">
                  <div className={`p-6 bg-card shadow-sm hover:shadow-md transition-shadow rounded-xl border border-border border-l-4 ${item.color}`}>
                    <h3 className="text-xl font-semibold mb-2">{item.type}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Simulations Segment */}
        <section id="Simulation" className="py-24">
          <div className="max-w-5xl mx-auto px-6 space-y-24">
            <FadeInWhenVisible>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Core Functions & Simulations</h2>
                <p className="text-muted-foreground">Interact with the graphs to understand how survival metrics evolve over time.</p>
              </div>
            </FadeInWhenVisible>

            {/* 5. Survival Function */}
            <FadeInWhenVisible delay={0.2}>
              <SurvivalSimulation />
            </FadeInWhenVisible>

            {/* 6. Hazard Function */}
            <FadeInWhenVisible delay={0.2}>
              <HazardSimulation />
            </FadeInWhenVisible>

            {/* 7 & 8. Kaplan-Meier */}
            <FadeInWhenVisible delay={0.2}>
              <KaplanMeierSimulation />
            </FadeInWhenVisible>
          </div>
        </section>

        {/* 9. Hazard Models */}
        <section id="Models" className="py-24 bg-muted/30 border-y border-border/50">
          <div className="max-w-5xl mx-auto px-6">
            <FadeInWhenVisible>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Hazard Models</h2>
                <p className="text-muted-foreground">Methods to model the hazard rate over time.</p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible>
               <Accordion className="w-full bg-card rounded-2xl border border-border px-6 py-2 shadow-sm">
                 {[
                   { title: "Exponential Model", type: "Parametric", desc: "Assumes a constant hazard rate over time. Memoryless property." },
                   { title: "Weibull Model", type: "Parametric", desc: "Allows hazard rate to increase, decrease, or remain constant over time." },
                   { title: "Cox Proportional Hazards Model", type: "Semi-parametric", desc: "Models the effect of covariates without specifying the baseline hazard shape. (Most common in modern analysis)" }
                 ].map((model, idx) => (
                    <AccordionItem value={`item-${idx}`} key={idx} className="border-b last:border-0">
                      <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-6">
                        <div className="text-left">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">{model.type}</span>
                          <span className="text-lg font-bold">{model.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                        {model.desc}
                      </AccordionContent>
                    </AccordionItem>
                 ))}
               </Accordion>
            </FadeInWhenVisible>

            {/* 10. Cox Model Demo */}
            <FadeInWhenVisible delay={0.3}>
              <CoxModelDemo />
            </FadeInWhenVisible>
          </div>
        </section>

        {/* 11 & 13. Applications / Simulation */}
        <section id="Applications" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold text-center mb-16">Real-World Applications</h2>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-3 gap-8 mb-24">
              {[
                { title: "Healthcare", icon: Heart, color: "text-red-500", bg: "bg-red-500/10", desc: "Patient survival time after diagnosis/treatment." },
                { title: "Engineering", icon: Cpu, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Predicting when a machine or component will fail." },
                { title: "Business", icon: Briefcase, color: "text-amber-500", bg: "bg-amber-500/10", desc: "Analyzing customer churn or employee retention." }
              ].map((app, idx) => (
                <FadeInWhenVisible key={idx} delay={idx * 0.2}>
                  <Card className="text-center hover:shadow-xl transition-all duration-300 group border-border">
                    <CardHeader>
                      <div className={`w-16 h-16 mx-auto rounded-2xl ${app.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <app.icon className={`w-8 h-8 ${app.color}`} />
                      </div>
                      <CardTitle>{app.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{app.desc}</p>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>

            {/* 13. Real life simulation */}
            <FadeInWhenVisible>
               <ChurnSimulation />
            </FadeInWhenVisible>
          </div>
        </section>

        {/* 12. Advantages & Limitations */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-16">
            <FadeInWhenVisible direction="right">
              <div className="p-8 bg-card border border-border hover:border-green-500/30 transition-colors shadow-sm rounded-3xl h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck className="w-32 h-32" /></div>
                <h3 className="text-2xl font-bold mb-8 flex items-center text-green-600 dark:text-green-500">
                  <ShieldCheck className="mr-3" /> Advantages
                </h3>
                <ul className="space-y-6 relative z-10">
                  <li className="flex items-start"><ChevronRight className="w-5 h-5 text-green-500 mt-1 shrink-0" /> <span className="text-muted-foreground">Properly handles censored data without dropping valuable observations.</span></li>
                  <li className="flex items-start"><ChevronRight className="w-5 h-5 text-green-500 mt-1 shrink-0" /> <span className="text-muted-foreground">Accounts for time-dependent covariates and skewed time distros.</span></li>
                  <li className="flex items-start"><ChevronRight className="w-5 h-5 text-green-500 mt-1 shrink-0" /> <span className="text-muted-foreground">Can model complex interactions longitudinally.</span></li>
                </ul>
              </div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible direction="left" delay={0.2}>
              <div className="p-8 bg-card border border-border hover:border-red-500/30 transition-colors shadow-sm rounded-3xl h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><AlertCircle className="w-32 h-32" /></div>
                <h3 className="text-2xl font-bold mb-8 flex items-center text-red-600 dark:text-red-500">
                  <AlertCircle className="mr-3" /> Limitations
                </h3>
                <ul className="space-y-6 relative z-10">
                  <li className="flex items-start"><ChevronRight className="w-5 h-5 text-red-500 mt-1 shrink-0" /> <span className="text-muted-foreground">Assumes censoring is strictly independent of survival time (non-informative).</span></li>
                  <li className="flex items-start"><ChevronRight className="w-5 h-5 text-red-500 mt-1 shrink-0" /> <span className="text-muted-foreground">Proportional hazards assumption might fail in real-world messy data.</span></li>
                  <li className="flex items-start"><ChevronRight className="w-5 h-5 text-red-500 mt-1 shrink-0" /> <span className="text-muted-foreground">Requires larger sample sizes when censoring is heavy.</span></li>
                </ul>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* 14. Tools Used */}
        <section className="py-24">
           <div className="max-w-5xl mx-auto px-6 text-center">
             <FadeInWhenVisible>
               <h2 className="text-2xl font-bold mb-10 text-muted-foreground flex items-center justify-center gap-3">
                 <Cpu className="w-6 h-6" /> Industry Standard Tools
               </h2>
             </FadeInWhenVisible>
             <div className="flex flex-wrap justify-center gap-6">
                {["Python (Lifelines/Scikit-survival)", "R (survival package)", "SAS", "STATA", "Excel (Basic)"].map((tool, i) => (
                  <motion.div 
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-6 py-4 bg-card border border-border rounded-xl shadow-sm font-semibold flex items-center text-sm md:text-base text-foreground/80 hover:text-primary hover:border-primary/30 transition-colors cursor-default"
                  >
                    <PieChart className="w-5 h-5 mr-3 text-primary" />
                    {tool}
                  </motion.div>
                ))}
             </div>
           </div>
        </section>

        {/* 15 & 16. Conclusion & Footer */}
        <footer className="pt-24 pb-12 relative overflow-hidden bg-muted/50 border-t border-border">
          <div className="max-w-4xl mx-auto px-6 text-center mb-16">
            <FadeInWhenVisible>
               <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">Summary</h2>
               <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                 Survival Analysis elegantly bridges the gap between binary outcome prediction and continuous time estimation. 
                 By properly accounting for censored data, we unlock deep insights to answer one critical question: <span className="font-semibold text-foreground">"When?"</span>
               </p>
            </FadeInWhenVisible>
          </div>

          <div className="max-w-3xl mx-auto px-6 text-center border-t border-border/50 pt-16 relative">
            <motion.h2 
              className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Thank You!
            </motion.h2>
            <p className="text-xl font-light text-muted-foreground">Any Questions?</p>
            
            <div className="mt-16 pt-8 text-sm font-medium tracking-wide flex flex-col items-center gap-2">
               <span className="text-muted-foreground">AD3491 - Fundamentals of Data Science and Analytics</span>
               <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold border border-primary/20 mt-2 hover:bg-primary/20 transition-colors">
                 Created by Pandeeswaran Pichaipandi
               </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
