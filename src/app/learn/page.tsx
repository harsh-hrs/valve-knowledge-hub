'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ACADEMY_CURRICULUM, GLOSSARY_TERMS, Lesson, GlossaryTerm } from '@/lib/academy-data';
import {
  GraduationCap,
  BookOpen,
  Search,
  CheckCircle,
  Clock,
  PlayCircle,
  HelpCircle,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  BarChart2
} from 'lucide-react';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'glossary' | 'tracker'>('syllabus');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // Quiz active states
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  // Glossary query search states
  const [glossaryQuery, setGlossaryQuery] = useState<string>('');

  // Progress states tracking completed lesson IDs and scores
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  // Fetch progress from localStorage on initial render
  useEffect(() => {
    const savedCompleted = localStorage.getItem('vh_completed_lessons');
    const savedScores = localStorage.getItem('vh_quiz_scores');
    if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));
    if (savedScores) setQuizScores(JSON.parse(savedScores));
  }, []);

  // Sync progress back to localStorage
  const saveProgress = (newCompleted: string[], newScores: Record<string, number>) => {
    setCompletedLessons(newCompleted);
    setQuizScores(newScores);
    localStorage.setItem('vh_completed_lessons', JSON.stringify(newCompleted));
    localStorage.setItem('vh_quiz_scores', JSON.stringify(newScores));
  };

  const handleResetProgress = () => {
    saveProgress([], {});
  };

  // Open Lesson View
  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setUserAnswers({});
    setShowQuizResult(false);
  };

  // Check Quiz Selection
  const handleCheckAnswer = () => {
    if (selectedOption === null || !selectedLesson) return;
    setIsAnswerChecked(true);
    setUserAnswers(prev => ({ ...prev, [currentQuizIdx]: selectedOption }));
  };

  // Move to next question or show results
  const handleNextQuestion = () => {
    if (!selectedLesson) return;
    
    setSelectedOption(null);
    setIsAnswerChecked(false);
    
    if (currentQuizIdx + 1 < selectedLesson.quiz.length) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setShowQuizResult(true);
      
      // Calculate final score correctly (using the last selected option as well)
      let correctCount = 0;
      selectedLesson.quiz.forEach((q, idx) => {
        const chosen = idx === currentQuizIdx ? selectedOption : userAnswers[idx];
        if (chosen === q.correctIndex) {
          correctCount++;
        }
      });
      const newScoreValue = Math.round((correctCount / selectedLesson.quiz.length) * 100);
      
      const nextCompleted = completedLessons.includes(selectedLesson.id)
        ? completedLessons
        : [...completedLessons, selectedLesson.id];
      const nextScores = { ...quizScores, [selectedLesson.id]: newScoreValue };
      
      saveProgress(nextCompleted, nextScores);
    }
  };

  // Calculate stats
  const totalLessonsCount = useMemo(() => {
    return ACADEMY_CURRICULUM.reduce((sum, mod) => sum + mod.lessons.length, 0);
  }, []);

  const progressPercentage = useMemo(() => {
    if (totalLessonsCount === 0) return 0;
    return Math.round((completedLessons.length / totalLessonsCount) * 100);
  }, [completedLessons, totalLessonsCount]);

  const averageQuizScore = useMemo(() => {
    const scores = Object.values(quizScores);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  }, [quizScores]);

  // Filter glossary
  const filteredGlossary = useMemo(() => {
    if (!glossaryQuery.trim()) return GLOSSARY_TERMS;
    const q = glossaryQuery.toLowerCase();
    return GLOSSARY_TERMS.filter(
      t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    );
  }, [glossaryQuery]);

  // Calculate score for active quiz session
  const currentSessionScore = useMemo(() => {
    if (!selectedLesson) return 0;
    let count = 0;
    selectedLesson.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        count++;
      }
    });
    return count;
  }, [userAnswers, selectedLesson]);

  return (
    <div className="flex flex-col gap-10 py-8 max-w-4xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 p-2.5 flex items-center justify-center border border-purple-500/20">
            <GraduationCap className="h-5 w-5 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Valve Academy</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Run deep learning modules, complete conceptual quizzes, and build certified pipeline skills.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5 self-start overflow-x-auto max-w-full">
        <button
          onClick={() => { setActiveTab('syllabus'); setSelectedLesson(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'syllabus' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Curriculum Course
        </button>
        <button
          onClick={() => { setActiveTab('glossary'); setSelectedLesson(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'glossary' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          Glossary Search
        </button>
        <button
          onClick={() => { setActiveTab('tracker'); setSelectedLesson(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tracker' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BarChart2 className="h-3.5 w-3.5" />
          Academy Progress
        </button>
      </div>

      {/* Dynamic Tabs Views */}
      <div className="flex flex-col gap-6">
        {/* Tab 1: Curriculum Module Directory */}
        {activeTab === 'syllabus' && !selectedLesson && (
          <div className="flex flex-col gap-6">
            {/* Interactive Sandbox Promo Card */}
            <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-cyan-500/5 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400 animate-spin-slow" />
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Interactive Simulator</span>
                </div>
                <h3 className="text-base font-extrabold text-foreground">Valve Animation Sandbox</h3>
                <p className="text-muted-foreground text-xs max-w-xl">
                  Simulate mechanical stroke operations (0% to 100%) for Gate, Ball, and Globe valves. Investigate internal velocity changes, pressure drops, and throttling characteristics.
                </p>
              </div>
              <Link
                href="/learn/animations"
                className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-lg transition-all shrink-0 hover:scale-[1.02] flex items-center gap-1.5"
              >
                Launch Sandbox &rarr;
              </Link>
            </div>

            {/* Modules List */}
            <div className="flex flex-col gap-8">
              {ACADEMY_CURRICULUM.map((mod) => (
                <div key={mod.id} className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-white/5">
                  <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                    <h3 className="text-lg font-bold text-primary">{mod.title}</h3>
                    <p className="text-muted-foreground text-xs">{mod.description}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {mod.lessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => handleOpenLesson(lesson)}
                          className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-primary/20 hover:bg-slate-900/60 cursor-pointer group transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                            ) : (
                              <PlayCircle className="h-5 w-5 text-muted-foreground/60 shrink-0 group-hover:text-primary transition-colors" />
                            )}
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{lesson.title}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" /> {lesson.estimatedTime} study
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Inner Lesson study View */}
        {activeTab === 'syllabus' && selectedLesson && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Lesson Details Content (7 cols) */}
            <div className="lg:col-span-7 glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6 border border-white/5">
              <button
                onClick={() => setSelectedLesson(null)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground self-start mb-2 flex items-center gap-1"
              >
                &larr; Back to Curriculum
              </button>
              <h2 className="text-2xl font-bold text-primary">{selectedLesson.title}</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
                {selectedLesson.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Right: Knowledge Checkpoint Quiz Drawer (5 cols) */}
            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col gap-6 border border-white/5 bg-primary/[0.01]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span className="font-bold text-xs uppercase tracking-widest">Checkpoint Quiz</span>
                </div>
                {!showQuizResult && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Q: {currentQuizIdx + 1} / {selectedLesson.quiz.length}
                  </span>
                )}
              </div>

              {!showQuizResult ? (
                <div className="flex flex-col gap-4">
                  <div className="text-xs font-bold text-foreground leading-normal">
                    {selectedLesson.quiz[currentQuizIdx].question}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {selectedLesson.quiz[currentQuizIdx].options.map((opt, oIdx) => {
                      const isSelected = selectedOption === oIdx;
                      const isCorrect = oIdx === selectedLesson.quiz[currentQuizIdx].correctIndex;
                      
                      let optColor = 'border-white/5 hover:border-white/10 hover:bg-white/5';
                      if (isSelected) optColor = 'border-primary bg-primary/5 text-primary';
                      if (isAnswerChecked) {
                        if (isCorrect) optColor = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                        else if (isSelected) optColor = 'border-rose-500 bg-rose-500/10 text-rose-400';
                        else optColor = 'border-white/5 opacity-50';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswerChecked}
                          onClick={() => setSelectedOption(oIdx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${optColor}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback annotation */}
                  {isAnswerChecked && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[11px] text-muted-foreground leading-relaxed mt-2 animate-fade-in">
                      <div className="font-bold text-primary mb-1 uppercase tracking-wider text-[9px]">Feedback Analysis</div>
                      {selectedLesson.quiz[currentQuizIdx].explanation}
                    </div>
                  )}

                  {/* Operational Button */}
                  {!isAnswerChecked ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={selectedOption === null}
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:cyan-glow transition-all text-xs disabled:opacity-50 mt-4"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3 rounded-xl bg-secondary hover:bg-muted text-foreground font-bold border border-white/5 transition-all text-xs mt-4"
                    >
                      {currentQuizIdx + 1 < selectedLesson.quiz.length ? 'Next Question' : 'Finish Quiz'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">Checkpoint Cleared!</h3>
                  <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
                    You have studied the mechanics and recorded a score of **{Math.round((currentSessionScore / selectedLesson.quiz.length) * 100)}%**. Progress synced.
                  </p>
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:cyan-glow text-xs transition-all mt-2"
                  >
                    Return to Curriculum
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Technical Glossary Directory */}
        {activeTab === 'glossary' && (
          <div className="flex flex-col gap-6">
            {/* Search inputs */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search definitions (e.g. Cavitation, Trim, Choked Flow)..."
                value={glossaryQuery}
                onChange={(e) => setGlossaryQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm focus:outline-none focus:border-primary focus:cyan-glow transition-all"
              />
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
              {filteredGlossary.map((term, idx) => (
                <div key={idx} className="glass-panel rounded-2xl p-5 flex flex-col gap-2.5 border border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h4 className="font-bold text-sm text-primary">{term.term}</h4>
                    <span className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Spec Definition</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{term.definition}</p>
                  <div className="text-[10px] text-muted-foreground/60 italic mt-1 font-medium">
                    Usage: &ldquo;{term.context}&rdquo;
                  </div>
                </div>
              ))}
              {filteredGlossary.length === 0 && (
                <div className="text-center py-12 text-sm text-muted-foreground italic">
                  No terms found matching your query.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Student Tracker Metrics */}
        {activeTab === 'tracker' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Stats Dashboard */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 border border-white/5">
              <h3 className="font-bold text-sm text-primary uppercase tracking-widest border-b border-white/5 pb-2">
                Academy Performance
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[10px] text-muted-foreground font-medium mb-1">Lessons Completed</div>
                  <div className="text-xl font-black text-foreground">{completedLessons.length} / {totalLessonsCount}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[10px] text-muted-foreground font-medium mb-1">Average Quiz Score</div>
                  <div className="text-xl font-black text-foreground">{averageQuizScore}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Course Completion</span>
                  <span className="text-primary font-mono">{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
            </div>

            {/* Completed Modules list */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-white/5">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm text-primary uppercase tracking-widest">
                  Completed Badges
                </h3>
                {completedLessons.length > 0 && (
                  <button
                    onClick={handleResetProgress}
                    className="text-[10px] font-bold text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset Progress
                  </button>
                )}
              </div>

              {completedLessons.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {completedLessons.map((id) => {
                    // Find matching lesson name
                    let lessonTitle = id;
                    ACADEMY_CURRICULUM.forEach((mod) => {
                      const found = mod.lessons.find(l => l.id === id);
                      if (found) lessonTitle = found.title;
                    });

                    return (
                      <div key={id} className="flex justify-between items-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>{lessonTitle}</span>
                        </div>
                        <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded text-emerald-400">
                          Score: {quizScores[id]}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground italic">
                  No completed lessons yet. Start Module 1 to record progress.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

