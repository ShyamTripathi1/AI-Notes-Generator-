'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, FileText, Loader2, BookOpen, Sparkles,
  File, Brain, Code, BarChart2, Zap, Target, Sun, Moon,
  GraduationCap, Lightbulb, TrendingUp, CheckSquare, Star
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import NotesViewer from '@/components/NotesViewer';

/* ─────────────── Constants ─────────────── */
const FIELDS_OF_STUDY = [
  'General', 'Science', 'Mathematics', 'Computer Science',
  'Engineering', 'Medical / Biology', 'Chemistry', 'Physics',
  'Arts & Humanities', 'History', 'Geography', 'Economics',
  'Business & Commerce', 'Law', 'Psychology', 'Education',
  'Environmental Science', 'Political Science', 'Literature', 'Philosophy',
];

/* ─────────────── Typewriter Hook ─────────────── */
function useTypewriter(words, speed = 75, pause = 2200) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx % words.length];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(w => (w + 1) % words.length);
    }
    setDisplayed(current.substring(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

/* ─────────────── Animated Counter ─────────────── */
function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const progress = Math.min((Date.now() - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────── Pill Chips ─────────────── */
function PillChips({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`pill-chip ${value === opt ? 'active' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ─────────────── 3D Live Background ─────────────── */
function Background3D() {
  const assets = ['/assets/hero.png', '/assets/bg-pen.png'];
  const particles = Array.from({ length: 18 });
  
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((_, i) => {
        const asset = assets[i % assets.length];
        return (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 110}vh`,
              scale: 0.2 + Math.random() * 0.3,
              rotate: Math.random() * 360
            }}
            animate={{ 
              opacity: [0, 0.12, 0],
              y: [null, `${Math.random() * -250}px`],
              rotate: [null, Math.random() * 360 + 90]
            }}
            transition={{ 
              duration: 15 + Math.random() * 25, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 15 
            }}
            style={{ position: 'absolute' }}
          >
            <img 
              src={asset} 
              alt="" 
              style={{ 
                width: '120px', 
                height: 'auto', 
                filter: 'blur(3px) brightness(1.2) contrast(0.8)',
                opacity: 0.7
              }} 
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────── Floating Particle ─────────────── */
function FloatingParticle({ delay, x, size, color }) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: `${x}%`, bottom: '-20px',
        width: `${size}px`, height: `${size}px`, borderRadius: '50%',
        background: color, opacity: 0, pointerEvents: 'none',
      }}
      animate={{ y: [0, -500], opacity: [0, 0.5, 0], scale: [1, 1.2, 0.8] }}
      transition={{ duration: 9 + Math.random() * 4, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

/* ─────────────── Loading State ─────────────── */
const LoadingState = () => {
  const steps = [
    'Analyzing topic structure…',
    'Building concept map…',
    'Writing explanations…',
    'Generating diagrams…',
    'Compiling Q&A and MCQs…',
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="glass-panel"
      style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Spinner */}
      <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '2rem' }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            style={{
              position: 'absolute', inset: `${i * 14}px`,
              borderRadius: '50%', border: '2px solid transparent',
              borderTopColor: ['var(--primary)', 'var(--secondary)', 'var(--accent-green)'][i],
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2 + i * 0.35, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <div style={{
          position: 'absolute', inset: '30px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={20} color="white" />
        </div>
      </div>

      <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', marginBottom: '0.4rem' }}>
        Crafting Your Notes…
      </h3>

      <AnimatePresence mode="wait">
        <motion.p key={step}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.9rem' }}
        >
          {steps[step]}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2.25rem' }}>
        {steps.map((_, i) => (
          <motion.div key={i}
            animate={{ width: i === step ? 24 : 8, background: i <= step ? 'var(--primary)' : 'var(--border)' }}
            style={{ height: '8px', borderRadius: '9999px' }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Skeleton preview */}
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[90, 70, 100, 60, 80].map((w, i) => (
          <div key={i} className="skeleton"
            style={{ height: '13px', width: `${w}%`, alignSelf: i % 2 ? 'flex-end' : 'flex-start' }}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ─────────────── Empty State ─────────────── */
const EmptyState = () => {
  const typeWords = ['Data Structures', 'Quantum Physics', 'Organic Chemistry', 'Machine Learning', 'World History', 'Calculus'];
  const typed = useTypewriter(typeWords);

  const features = [
    { icon: <Sparkles size={18} />,     title: 'AI-Generated',   desc: 'Powered by Llama 3.3 & Gemini', color: '#7c5cfc' },
    { icon: <Brain size={18} />,        title: 'Deep Content',   desc: 'Theory dives + real examples',   color: '#4facfe' },
    { icon: <BarChart2 size={18} />,    title: 'Visual Diagrams',desc: 'Auto Mermaid flowcharts',         color: '#10b981' },
    { icon: <Code size={18} />,         title: 'Code Examples',  desc: 'C++, Java & Python impls',        color: '#f59e0b' },
    { icon: <Target size={18} />,       title: 'Practice MCQs',  desc: 'Interactive with feedback',       color: '#ec4899' },
    { icon: <FileText size={18} />,     title: 'Export Ready',   desc: 'PDF, Word & Markdown',            color: '#06b6d4' },
  ];

  const stats = [
    { value: 20, suffix: '+', label: 'Fields of Study', icon: <GraduationCap size={18} /> },
    { value: 10, suffix: '+', label: 'Note Sections',   icon: <FileText size={18} /> },
    { value: 100, suffix: '%', label: 'AI-Powered',     icon: <Sparkles size={18} /> },
    { value: 5, suffix: 'x',  label: 'Faster Study',    icon: <Zap size={18} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel"
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', boxShadow: 'var(--shadow-3d)' }}
    >
      {/* Hero card */}
      <div className="glass-panel text-center" style={{ padding: '3rem 2rem', overflow: 'visible' }}>
        {/* Floating particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '24px', pointerEvents: 'none' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.7} x={8 + (i / 10) * 84}
              size={3 + (i % 3) + 1}
              color={['rgba(124,92,252,0.4)', 'rgba(79,172,254,0.4)', 'rgba(16,185,129,0.3)'][i % 3]}
            />
          ))}
        </div>

        {/* Central orb */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            style={{ position: 'relative', display: 'inline-block', marginBottom: '1.75rem', cursor: 'pointer' }}
          >
            {/* Ambient glow behind image */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                position: 'absolute', inset: '-30px', borderRadius: '50%',
                background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
                filter: 'blur(25px)', zIndex: 0
              }} 
            />
            
            <motion.img
              src="/assets/hero.png"
              alt="AI Study Illustration"
              className="animate-float"
              style={{
                width: '380px', height: 'auto', position: 'relative', zIndex: 1,
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
                perspective: '1000px'
              }}
              whileHover={{ rotateY: 10, rotateX: -5 }}
            />
          </motion.div>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>Your Ultimate Study Companion</h2>

        {/* Typewriter */}
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Currently generating notes for{' '}
          <span style={{
            color: 'var(--primary)', fontWeight: 700,
            borderRight: '2px solid var(--primary)', paddingRight: '2px',
          }}>
            {typed || '\u00a0'}
          </span>
        </p>
        <p style={{ color: 'var(--text-subtle)', fontSize: '0.87rem' }}>
          Fill the form on the left and click "Generate Magic" to begin.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
        {stats.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="card"
            style={{ textAlign: 'center', padding: '1.1rem 0.75rem' }}
          >
            <div style={{ color: 'var(--primary)', display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}>
              {s.icon}
            </div>
            <div style={{
              fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Outfit',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.2rem', fontWeight: 500 }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feature grid with staggered animation */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
      >
        {features.map((f, i) => (
          <motion.div key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.9, y: 30 },
              show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 12 } }
            }}
            whileHover={{ y: -8, scale: 1.02, boxShadow: 'var(--shadow-md)' }}
            className="glass-card"
            style={{
              padding: '1.25rem',
              background: 'var(--surface)',
              border: `1px solid ${f.color}33`,
              borderRadius: 'var(--radius-lg)',
              display: 'flex', gap: '1rem',
              position: 'relative', overflow: 'hidden'
            }}
          >
            {/* Subtle background feature set hint */}
            <div style={{
              position: 'absolute', right: '-10px', bottom: '-10px',
              width: '60px', height: '60px', opacity: 0.05,
              backgroundImage: 'url(/assets/features.png)',
              backgroundSize: 'cover', pointerEvents: 'none'
            }} />

            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `${f.color}20`, border: `1px solid ${f.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: f.color, flexShrink: 0,
            }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>{f.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

/* ─────────────── Theme Toggle ─────────────── */
function ThemeToggle({ theme, onToggle }) {
  return (
    <motion.button
      className="theme-toggle hide-on-print"
      onClick={onToggle}
      aria-label="Toggle theme"
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        <motion.div key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

/* ─────────────── Main Page ─────────────── */
export default function Home() {
  const [theme, setTheme] = useState('light');
  const [formData, setFormData] = useState({
    subject: '', topic: '', fieldOfStudy: 'General',
    difficulty: 'Intermediate', purpose: 'Exam preparation',
    length: 'Detailed', level: 'College', examType: 'General',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState(null);
  const contentRef = useRef(null);
  const resultsRef = useRef(null);

  /* Load saved theme */
  useEffect(() => {
    const saved = localStorage.getItem('studyapp-theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('studyapp-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleChange = (e) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const setPill = (key, value) =>
    setFormData(p => ({ ...p, [key]: value }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setNotes(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate notes');
      }
      const data = await res.json();
      setNotes(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* Downloads */
  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setLoading(true);
    try {
      // 1. Temporarily lock width for stable high-res capture
      // We use 1050px to ensure it looks like a standard desktop document
      const originalStyle = contentRef.current.getAttribute('style') || '';
      contentRef.current.style.width = '1050px';
      contentRef.current.style.minWidth = '1050px';
      contentRef.current.style.margin = '0';
      contentRef.current.style.padding = '40px';
      contentRef.current.style.background = '#ffffff';

      // 2. Wait for Mermaid diagrams and any layout shifts to settle
      await new Promise(resolve => setTimeout(resolve, 800));

      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: [10, 5],
        filename: `${formData.topic.replace(/\s+/g, '_')}_Notes.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 3, // High resolution
          useCORS: true, 
          letterRendering: true, 
          scrollX: 0, 
          scrollY: 0,
          windowWidth: 1100, // Ensure no clipping
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { 
          mode: ['css', 'legacy'], // Avoid "avoid-all" which causes blank pages
          before: '.section-container',
          avoid: ['.card', '.glass-panel', '.mermaid-wrapper']
        },
      };

      // 3. Generate and Save
      await html2pdf().set(opt).from(contentRef.current).save();

      // 4. Restore original styles
      contentRef.current.setAttribute('style', originalStyle);
    } catch (err) { 
      console.error('PDF Error:', err);
      setError('PDF generation failed. Please try again.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `${formData.subject || formData.topic}_Notes`,
  });

  const downloadMarkdown = () => {
    if (!notes) return;
    let md = `# ${formData.topic} Notes\n\n`;
    md += `**Field:** ${formData.fieldOfStudy} | **Level:** ${formData.difficulty}\n\n---\n\n`;
    md += `## Overview\n${notes.topicOverview?.explanation}\n\n`;
    notes.detailedExplanation?.forEach(item => {
      md += `### ${item.subtopic}\n${item.explanation}\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${formData.topic.replace(/\s+/g, '_')}_Notes.md`; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDocx = () => {
    if (!contentRef.current) return;
    const html = `<html><head><meta charset="utf-8"><title>${formData.topic}</title></head><body>${contentRef.current.innerHTML}</body></html>`;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = source; a.download = `${formData.topic.replace(/\s+/g, '_')}_Notes.doc`; a.click();
    document.body.removeChild(a);
  };

  /* ── Render ── */
  return (
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="bg-grid" />
      <Background3D />

      {/* Background blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Theme toggle (optional, since we are hybrid) */}
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {/* ── Landing Page Wrapper (CRYSTALLINE BLUE) ── */}
      <div className="w-full flex flex-col items-center">
        {/* ── Hero ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
          style={{ width: '100%', marginBottom: '3.5rem', paddingTop: '2.5rem', position: 'relative' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--primary-light)', border: '1px solid var(--border-hover)',
              borderRadius: '9999px', padding: '0.4rem 1.2rem', marginBottom: '1.4rem',
              fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <Sparkles size={13} />
            </motion.div>
            AI-Powered Study Companion
          </motion.div>

          {/* Headline */}
          <h1 className="text-gradient-animated"
            style={{
              fontSize: 'clamp(2.6rem, 8vw, 4.8rem)',
              letterSpacing: '-0.04em', fontWeight: 900,
              marginBottom: '0.75rem', lineHeight: 1.05,
            }}
          >
            AI Exam Notes
          </h1>

          {/* Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              height: '3px', width: '100px', margin: '0 auto 1.25rem',
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              borderRadius: '9999px', transformOrigin: 'left',
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}
          >
            Generate comprehensive, structured study notes — with diagrams, Q&A, code examples, and MCQs — in seconds.
          </motion.p>

          {/* Floating Emoji Stickers (Clean 3D Look) */}
          <div style={{ position: 'relative', height: 0, pointerEvents: 'none' }}>
            {[
              { char: '📚', x: '5%',  top: -210, size: 36, delay: 0.1 },
              { char: '🧠', x: '92%', top: -180, size: 34, delay: 0.5 },
              { char: '✍️', x: '18%', top: -140, size: 30, delay: 1.2 },
              { char: '💡', x: '82%', top: -210, size: 28, delay: 0.8 },
              { char: '🎓', x: '10%', top: -60,  size: 34, delay: 1.5 },
              { char: '🚀', x: '88%', top: -80,  size: 32, delay: 2.0 },
              { char: '📊', x: '13%', top: -110, size: 30, delay: 1.0 },
              { char: '🧪', x: '80%', top: -130, size: 32, delay: 1.8 },
              { char: '📝', x: '24%', top: -200, size: 28, delay: 0.3 },
              { char: '🎯', x: '75%', top: -160, size: 30, delay: 2.2 },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 0.75, 
                  scale: 1,
                  y: [0, i % 2 === 0 ? -25 : 25, 0],
                  rotateY: [0, 20, -20, 0],
                  rotateZ: [0, 15, -15, 0]
                }}
                transition={{ 
                  opacity: { delay: 1 + (item.delay || 0), duration: 1 },
                  scale: { delay: 1 + (item.delay || 0), type: 'spring' },
                  y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
                  rotateY: { duration: 7 + i, repeat: Infinity, ease: 'easeInOut' },
                  rotateZ: { duration: 8 + i, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{ 
                  position: 'absolute', left: item.x, top: item.top, 
                  perspective: '1000px',
                  filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))'
                }}
              >
                <div style={{ 
                  fontSize: item.size, 
                  filter: 'saturate(1.3)',
                  transform: 'rotateY(10deg)'
                }}>
                  {item.char}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.header>
      </div>

      {/* ── Content Area (FLUID WIDTH & HIGH SPACING) ── */}
      <div className="w-full flex flex-col gap-12 items-center" 
           style={{ background: 'var(--bg)', padding: '5rem 4vw' }}>
        
        {/* Main 2-col layout - FLUID with large GAP */}
        <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start', flexWrap: 'wrap', width: '100%', padding: '0 2rem' }}>

          {/* ── Form Panel (SAND-GREY MIXTURE) ── */}
          <motion.div
            className="sand-grey-card hide-on-print"
            style={{ 
              width: '100%', maxWidth: '420px', flexShrink: 0, 
              borderRadius: 'var(--radius-xl)', padding: '2.5rem',
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
          {/* Panel header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '9px',
                background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={17} style={{ color: 'var(--primary)' }} />
              </div>
              <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Create Study Plan</h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', paddingLeft: '46px' }}>
              Configure your notes for best results
            </p>
          </div>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Subject */}
            <div>
              <label className="input-label">📚 Subject</label>
              <input id="input-subject" required type="text" name="subject"
                value={formData.subject} onChange={handleChange}
                className="input-field" placeholder="e.g. Computer Science" />
            </div>

            {/* Topic */}
            <div>
              <label className="input-label">🎯 Topic</label>
              <input id="input-topic" required type="text" name="topic"
                value={formData.topic} onChange={handleChange}
                className="input-field" placeholder="e.g. Data Structures" />
            </div>

            {/* Field */}
            <div>
              <label className="input-label">🔬 Field of Study</label>
              <select id="input-field" name="fieldOfStudy"
                value={formData.fieldOfStudy} onChange={handleChange} className="input-field">
                {FIELDS_OF_STUDY.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Difficulty — pill chips */}
            <div>
              <label className="input-label">⚡ Difficulty</label>
              <PillChips
                options={['Beginner', 'Intermediate', 'Advanced']}
                value={formData.difficulty}
                onChange={v => setPill('difficulty', v)}
              />
            </div>

            {/* Level — pill chips */}
            <div>
              <label className="input-label">🎓 Academic Level</label>
              <PillChips
                options={['School', 'College', 'Graduate']}
                value={formData.level}
                onChange={v => setPill('level', v)}
              />
            </div>

            {/* Detail level */}
            <div>
              <label className="input-label">📋 Detail Level</label>
              <PillChips
                options={['Short', 'Detailed', 'Comprehensive']}
                value={formData.length}
                onChange={v => setPill('length', v)}
              />
            </div>

            {/* Submit */}
            <motion.button
              id="btn-generate"
              type="submit"
              className="primary-btn w-full animate-glow"
              disabled={loading}
              style={{ marginTop: '0.5rem', fontWeight: 800, letterSpacing: '0.02em' }}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 25px var(--primary-glow)' } : undefined}
              whileTap={!loading ? { scale: 0.98 } : undefined}
            >
              {loading
                ? <Loader2 size={19} className="animate-spin" />
                : <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}>
                    <Sparkles size={19} />
                  </motion.span>
              }
              {loading ? 'Designing Notes…' : 'Generate Magic ✨'}
            </motion.button>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--accent-red-light)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--accent-red)',
                    fontSize: '0.85rem',
                  }}
                >
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* ── Results Panel ── */}
        <div ref={resultsRef} style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {loading && <LoadingState key="loading" />}
            {!loading && !notes && !error && <EmptyState key="empty" />}
            {!loading && notes && (
              <motion.div key="results"
                initial={{ opacity: 0, rotateX: -15, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
                className="glass-panel"
                style={{ 
                  boxShadow: 'var(--shadow-3d)', 
                  padding: '2.5rem',
                  transformOrigin: 'top center',
                  perspective: '1200px'
                }}
                transition={{ 
                  type: 'spring',
                  damping: 18,
                  stiffness: 100,
                  duration: 0.8
                }}
              >
                {/* Download bar */}
                <div className="flex gap-3 justify-end flex-wrap hide-on-print"
                  style={{ marginBottom: '1.25rem' }}>
                  <button id="btn-pdf" onClick={handleDownloadPDF} className="secondary-btn"
                    style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}>
                    <File size={15} /> PDF
                  </button>
                  <button id="btn-docx" onClick={downloadDocx} className="secondary-btn">
                    <FileText size={15} /> Word
                  </button>
                  <button id="btn-md" onClick={downloadMarkdown} className="secondary-btn">
                    <Download size={15} /> Markdown
                  </button>
                </div>

                {/* Notes */}
                <div ref={contentRef} className="print-container">
                  <NotesViewer notes={notes} topic={formData.topic} subject={formData.subject} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', color: 'var(--text-subtle)', padding: '5rem 0 3rem', fontSize: '0.85rem' }}>
        <div style={{ marginBottom: '0.4rem', fontWeight: 500 }}>AI Notes Generator · Next-Gen Education</div>
        <div style={{ opacity: 0.6 }}>Built with ❤️ for learners everywhere</div>
      </footer>
    </div>
  );
}
