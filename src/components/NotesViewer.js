'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mermaid from 'mermaid';
import {
  BookOpen, Brain, Target, FileText, Star,
  CheckCircle, Lightbulb, BarChart2, ChevronDown, ChevronUp,
  Code, Sparkles, Layers, Zap, Eye, FlaskConical, Hash,
  ArrowRight, BookMarked, Cpu, TrendingUp, AlertCircle, CheckSquare
} from 'lucide-react';

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

/* ────────────────────────────────────────────── */
/*  Mermaid Diagram                               */
/* ────────────────────────────────────────────── */
const MermaidDiagram = ({ content }) => {
  const ref = useRef(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const render = async () => {
      if (!ref.current || !content) return;
      try {
        let cleanContent = content
          .replace(/```mermaid/g, '')
          .replace(/```/g, '')
          .trim();

        await mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral', // Better for light mode
          securityLevel: 'loose',
          fontFamily: 'Inter',
        });

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, cleanContent);

        if (ref.current) {
          ref.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (err) {
        console.error('Mermaid Render Error:', err);
        if (ref.current) {
          ref.current.innerHTML = `<div style="padding:1rem;background:var(--accent-red-light);border:1px solid var(--accent-red-light);border-radius:10px;">
            <p style="color:var(--accent-red);font-weight:bold;font-size:0.8rem;margin-bottom:0.5rem">Diagram Render Error</p>
            <pre style="color:var(--accent-red);font-size:0.7rem;white-space:pre-wrap;margin:0">${err.message}</pre>
          </div>`;
        }
      }
    };
    render();
  }, [content]);

  return (
    <div
      className="mermaid-wrapper flex justify-center my-4 overflow-hidden"
      style={{ minHeight: !rendered ? '100px' : 'auto' }}
    >
      <div ref={ref} className="w-full flex justify-center" />
    </div>
  );
};

/* ────────────────────────────────────────────── */
/*  Animated Section Wrapper                      */
/* ────────────────────────────────────────────── */
const Section = ({ id, icon, title, children, defaultOpen = true, accentColor = 'var(--primary)', badge }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="glass-panel"
      style={{ borderTop: `4px solid ${accentColor}`, scrollMarginTop: '2rem', background: 'var(--surface)', marginBottom: '1.5rem' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between outline-none cursor-pointer"
        style={{ background: 'none', border: 'none', color: 'inherit', padding: '1.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accentColor, flexShrink: 0
          }}>
            {icon}
          </div>
          <div style={{ textAlign: 'left' }}>
            <h2 className="section-title" style={{ color: 'var(--text-main)', fontSize: '1.2rem', margin: 0 }}>
              {title}
            </h2>
            {badge && (
              <span style={{ 
                fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', 
                letterSpacing: '0.08em', padding: '0.2rem 0.6rem', borderRadius: '99px',
                background: 'var(--primary-light)', color: 'var(--primary)', marginTop: '0.25rem', display: 'inline-block' 
              }}>
                {badge}
              </span>
            )}
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid var(--border)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ────────────────────────────────────────────── */
/*  Interactive MCQ Component                      */
/* ────────────────────────────────────────────── */
const InteractiveMCQ = ({ mcq, index }) => {
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSelect = (idx) => {
    if (selected !== null) return; // Prevent double clicking
    setSelected(idx);
    
    // Correct answer is usually provided as a string like "A", "Oxygen", etc.
    // If it's a letter (A/B/C/D), we convert it to index
    const correctLetter = mcq.answer.trim().charAt(0).toUpperCase();
    const correctIdx = correctLetter.charCodeAt(0) - 65;
    
    // If the answer is the full string, we compare that too
    const isActuallyCorrect = (idx === correctIdx) || (mcq.options[idx] === mcq.answer);
    setIsCorrect(isActuallyCorrect);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'var(--surface-2)' }}>
      <p className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Q{index + 1}: {mcq.q}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {mcq.options.map((opt, oi) => {
          const letter = String.fromCharCode(65 + oi);
          const isThisSelected = selected === oi;
          const isThisCorrect = mcq.answer.includes(letter) || mcq.answer === opt;
          
          let borderColor = 'var(--border)';
          let bgColor = 'var(--surface-3)';
          let textColor = 'var(--text-muted)';
          
          if (selected !== null) {
            if (isThisCorrect) {
              borderColor = 'var(--accent-green)';
              bgColor = 'var(--accent-green-light)';
              textColor = 'var(--accent-green)';
            } else if (isThisSelected) {
              borderColor = 'var(--accent-red)';
              bgColor = 'var(--accent-red-light)';
              textColor = 'var(--accent-red)';
            }
          }

          return (
            <motion.button
              key={oi}
              onClick={() => handleSelect(oi)}
              whileHover={selected === null ? { 
                scale: 1.02, 
                rotateX: 5, 
                rotateY: 5,
                boxShadow: '0 10px 20px rgba(0,0,0,0.08)' 
              } : {}}
              whileTap={selected === null ? { scale: 0.97 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-3 text-xs rounded-lg border text-left transition-all duration-200"
              style={{ 
                background: bgColor, 
                borderColor: borderColor,
                color: textColor,
                cursor: selected === null ? 'pointer' : 'default',
                fontWeight: isThisSelected ? 700 : 400,
                perspective: '1000px'
              }}
            >
              <span style={{ fontWeight: 800, marginRight: '0.5rem', opacity: 0.7 }}>{letter}.</span> {opt}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-2 p-3 rounded-lg"
            style={{ 
              background: isCorrect ? 'var(--accent-green-light)' : 'var(--accent-red-light)',
              borderLeft: `4px solid ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'}`
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              {isCorrect ? <CheckCircle size={14} className="text-green" /> : <AlertCircle size={14} className="text-red" />}
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {isCorrect ? 'Correct!' : `Incorrect. The correct answer is ${mcq.answer}`}
              </span>
            </div>
            {mcq.explanation && (
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                {mcq.explanation}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ────────────────────────────────────────────── */
/*  Tabbed Interface for Q&A                      */
/* ────────────────────────────────────────────── */
const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="tab-bar">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`tab-btn ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tabs[activeTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ────────────────────────────────────────────── */
/*  Subtopic Card                                 */
/* ────────────────────────────────────────────── */
const SubtopicCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(true);
  const accents = ['var(--primary)', 'var(--secondary)', 'var(--accent-green)', 'var(--accent-amber)', 'var(--accent-pink)'];
  const accent = accents[index % accents.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileHover={{ 
        rotateY: 4, 
        rotateX: -2,
        z: 30,
        boxShadow: '0 25px 60px rgba(0,0,0,0.1)' 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      viewport={{ once: true }}
      style={{
        background: 'var(--surface)',
        border: `1px solid var(--border)`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 px-6 outline-none cursor-pointer"
        style={{ background: 'transparent', border: 'none', color: 'inherit' }}
      >
        <div className="flex items-center gap-4">
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: `${accent}15`, color: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 800
          }}>
            {index + 1}
          </div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.subtopic}</h3>
        </div>
        <motion.div animate={{ rotate: expanded ? 0 : -90 }}>
          <ChevronUp size={18} style={{ color: 'var(--text-subtle)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{item.explanation}</p>
              
              {item.deepdive && (
                <div style={{
                  padding: '1.1rem',
                  background: 'var(--primary-ultra-light)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <Layers size={14} /> Theory Deep Dive
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>{item.deepdive}</p>
                </div>
              )}

              {item.example && (
                <div style={{
                  padding: '1.1rem',
                  background: 'var(--accent-green-light)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <Lightbulb size={14} /> Practical Example
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, fontStyle: 'italic' }}>{item.example}</p>
                </div>
              )}

              {item.examTip && (
                <div style={{
                  padding: '1.1rem',
                  background: 'var(--accent-amber-light)',
                  border: '1px solid rgba(245, 158, 11, 0.15)',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <Target size={14} /> Exam Insight
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>{item.examTip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ────────────────────────────────────────────── */
/*  Main NotesViewer Component                    */
/* ────────────────────────────────────────────── */
export default function NotesViewer({ notes, topic, subject }) {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: <BookOpen size={16} /> },
    { id: 'explanation', label: 'Study Guide', icon: <Brain size={16} /> },
    { id: 'diagrams', label: 'Visual Aids', icon: <BarChart2 size={16} />, hidden: !(notes.visualAids?.length > 0) },
    { id: 'qa', label: 'Q&A Prep', icon: <FileText size={16} /> },
    { id: 'revision', label: 'Quick Revision', icon: <Zap size={16} /> },
    { id: 'practice', label: 'Practice MCQs', icon: <CheckCircle size={16} />, hidden: !(notes.practiceSection?.mcqs?.length > 0) }
  ].filter(s => !s.hidden), [notes]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0% -70% 0%', threshold: 0 });

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (!notes) return null;

  return (
    <div className="flex justify-center relative w-full">
      {/* ── Sidebar Dot Nav (Shifted side for symmetry) ── */}
      <div className="study-nav hide-on-print" style={{ position: 'fixed', left: '2rem', top: '50%', transform: 'translateY(-50%)' }}>
        {sections.map(s => (
          <button
            key={s.id}
            title={s.label}
            className={`study-nav-dot ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
          />
        ))}
      </div>

      <div className="notes-container flex flex-col gap-8 w-full animate-fade-in mx-auto" id="notes-content" style={{ maxWidth: '1000px' }}>
        {/* ── Meta Header ── */}
        <div className="glass-panel" style={{ padding: '1.25rem 2rem' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{topic}</h1>
              <p className="text-sm text-muted">Study Module • {subject || notes.metadata?.subject || 'General'}</p>
            </div>
            <div className="flex gap-3">
              <span className="badge badge-primary">{notes.metadata?.difficultyTags?.[0] || 'Modern Study'}</span>
              <span className="badge badge-secondary">{notes.metadata?.estimatedStudyTime || '45 min read'}</span>
            </div>
          </div>
        </div>

        {/* ── 1. Overview ── */}
        <div className="section-container">
          <Section id="overview" icon={<BookOpen size={20} />} title="Core Concepts" accentColor="var(--secondary)" badge="Fundamentals">
          {/* AI Generated Section Image */}
          <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', height: '180px', border: '1px solid var(--border)' }}>
            <img src="/assets/overview.png" alt="Concept Overview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
          </div>
          <p className="leading-relaxed mb-6" style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            {notes.topicOverview?.explanation}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {notes.topicOverview?.definitions?.length > 0 && (
              <div className="card" style={{ background: 'var(--surface-2)' }}>
                <h4 style={{ color: 'var(--secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  <Hash size={14} /> Key Definitions
                </h4>
                <ul className="space-y-3">
                  {notes.topicOverview.definitions.map((def, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm">
                      <ArrowRight size={14} className="mt-1 text-secondary opacity-60 flex-shrink-0" />
                      <span style={{ color: 'var(--text-muted)' }}>{def}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {notes.topicOverview?.realWorldExamples?.length > 0 && (
              <div className="card" style={{ background: 'var(--surface-2)' }}>
                <h4 style={{ color: 'var(--accent-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  <TrendingUp size={14} /> Application
                </h4>
                <ul className="space-y-3">
                  {notes.topicOverview.realWorldExamples.map((ex, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm">
                      <CheckSquare size={14} className="mt-1 text-green opacity-60 flex-shrink-0" />
                      <span style={{ color: 'var(--text-muted)' }}>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          </Section>
        </div>

        {/* ── 2. Detailed Explanation ── */}
        <div className="section-container">
          <Section id="explanation" icon={<Brain size={20} />} title="In-Depth Study Guide" accentColor="var(--primary)" badge={`${notes.detailedExplanation?.length} Lessons`}>
          {/* AI Generated Section Image */}
          <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', height: '160px', border: '1px solid var(--border)' }}>
            <img src="/assets/guide.png" alt="Study Guide" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
          </div>
          <div className="flex flex-col gap-4">
            {notes.detailedExplanation?.map((item, i) => (
              <SubtopicCard key={i} item={item} index={i} />
            ))}
          </div>
          </Section>
        </div>

        {/* ── 3. Visual Aids ── */}
        {notes.visualAids?.length > 0 && (
          <div className="section-container">
            <Section id="diagrams" icon={<BarChart2 size={20} />} title="Visual Learning Aids" accentColor="var(--accent-cyan)" badge="Diagrams">
            <div className="flex flex-col gap-8">
              {notes.visualAids.map((vis, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div style={{ width: '4px', height: '18px', background: 'var(--accent-cyan)', borderRadius: '2px' }} />
                    <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>{vis.title}</h4>
                  </div>
                  {vis.type === 'mermaid' ? (
                    <div className="holographic-card" style={{ padding: '1rem' }}>
                      <MermaidDiagram content={vis.content} />
                    </div>
                  ) : (
                    <pre className="mermaid-wrapper" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{vis.content}</pre>
                  )}
                </div>
              ))}
            </div>
            </Section>
          </div>
        )}

        {/* ── 4. Q&A ── */}
        <div className="section-container">
          <Section id="qa" icon={<FileText size={20} />} title="Expert prep Q&A" accentColor="var(--accent-pink)" badge="Exam Ready">
          <Tabs tabs={[
            {
              label: 'Short Qs',
              content: (
                <div className="grid md:grid-cols-2 gap-4">
                  {notes.shortQuestions?.map((q, i) => (
                    <div key={i} className="q-short-card">
                      <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-main)' }}>Q: {q.q}</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>{q.a}</p>
                    </div>
                  ))}
                </div>
              )
            },
            {
              label: 'Long Explanations',
              content: (
                <div className="flex flex-col gap-4">
                  {notes.longQuestions?.map((q, i) => (
                    <div key={i} className="q-long-card">
                      <p className="font-bold mb-3" style={{ color: 'var(--primary)' }}>Q: {q.q}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{q.a}</p>
                    </div>
                  ))}
                </div>
              )
            },
            {
              label: 'Repeated Topics',
              content: (
                <div className="flex flex-col gap-3">
                  {notes.importantQuestions?.map((q, i) => (
                    <div key={i} className="q-important-card flex gap-3 items-start">
                      <Star size={18} className="text-amber flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-main)' }}>{q.q}</p>
                        <p className="text-xs" style={{ color: 'var(--accent-red)', opacity: 0.8 }}>Reasoning: {q.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          ]} />
          </Section>
        </div>

        {/* ── 5. Algorithms & Code ── */}
        {notes.algorithmsAndCode?.length > 0 && (
          <div className="section-container">
            <Section icon={<Code size={20} />} title="Logic & Code Studio" accentColor="var(--text-main)" badge="Implementation">
            <div className="flex flex-col gap-6">
              {notes.algorithmsAndCode.map((item, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{item.title}</h4>
                    <span className="badge" style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', fontSize: '0.65rem' }}>{item.language}</span>
                  </div>
                  <div className="card" style={{ background: '#1e1e1e', padding: '1.25rem', overflowX: 'auto' }}>
                    <code style={{ color: '#dcdcdc', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre' }}>{item.code}</code>
                  </div>
                  <p className="text-xs text-muted">💡 {item.explanation}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

        {/* ── 6. Revision ── */}
        <div className="section-container">
          <Section id="revision" icon={<Zap size={20} />} title="Last-Minute Revision" accentColor="var(--accent-amber)" badge="Fast Pass">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-6 rounded-xl" style={{ background: 'var(--accent-amber-light)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3 text-amber">
                <Lightbulb size={20} />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Summary Sketch</h4>
              </div>
              <p className="font-medium" style={{ color: 'var(--text-main)', lineHeight: 1.7 }}>{notes.revisionNotes?.summary}</p>
            </div>
            <div className="md:w-64 p-5 rounded-xl border-dashed border-2 flex flex-col items-center justify-center text-center" style={{ borderColor: 'var(--accent-amber)', background: 'var(--surface-3)' }}>
              <span className="text-xs font-bold text-amber uppercase mb-2">Mnemonic / Trick</span>
              <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>{notes.revisionNotes?.memoryTricks}</p>
            </div>
          </div>

          {notes.revisionNotes?.revisionCheatSheet?.length > 0 && (
            <div className="mt-8">
              <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={16} className="text-amber" /> Essential Cheat Sheet
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {notes.revisionNotes.revisionCheatSheet.map((fact, fi) => (
                  <motion.div 
                    key={fi}
                    whileHover={{ x: 5 }}
                    style={{ 
                      padding: '0.75rem 1rem', background: 'var(--surface-2)', 
                      border: '1px solid var(--border)', borderRadius: '10px',
                      fontSize: '0.85rem', color: 'var(--text-muted)',
                      display: 'flex', gap: '0.75rem', alignItems: 'center'
                    }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
                    {fact}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          </Section>
        </div>

        {/* ── 7. MCQs ── */}
        {notes.practiceSection?.mcqs?.length > 0 && (
          <div className="section-container">
            <Section id="practice" icon={<CheckCircle size={20} />} title="Concept Checkpoint" accentColor="var(--accent-green)" badge="Live Quiz">
             <div className="flex flex-col gap-4">
                {notes.practiceSection.mcqs.map((mcq, i) => (
                  <InteractiveMCQ key={i} mcq={mcq} index={i} />
                ))}
             </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
