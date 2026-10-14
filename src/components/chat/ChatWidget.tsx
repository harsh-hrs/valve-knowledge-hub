'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BotMessageSquare, X, ArrowUp, RotateCcw } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

const SUGGESTIONS = [
  'How does a vertical turbine pump work?',
  'Gate valve vs globe valve: when do I use each?',
  'What causes cavitation in a pump?',
  'What does the Cv of a valve mean?',
];
const MAX_CHARS = 1200;
const UNAVAILABLE = 'The assistant is unavailable right now. Please try again in a minute.';

// Floating "Ask AI" assistant, answered by the /api/chat Pages Function.
export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Grow the textarea with its content, up to about four lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input]);

  const send = async (text: string) => {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!question || busy) return;
    const history: ChatMessage[] = [...messages.filter((m) => !m.error), { role: 'user', content: question }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    const setAnswer = (content: string, error = false) =>
      setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', content, error }]);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          page: `${document.title} (${pathname})`,
        }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        let msg = UNAVAILABLE;
        try {
          const data: unknown = await res.json();
          if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') msg = data.error;
        } catch {
          // not JSON: keep the generic message
        }
        setAnswer(msg, true);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setAnswer(answer);
      }
      if (!answer.trim()) setAnswer('Sorry, no answer came back. Please ask again.', true);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setAnswer('Could not reach the assistant. Check your internet connection and try again.', true);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 h-12 pl-3.5 pr-3.5 sm:pr-5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-[0_8px_30px_-6px_rgba(6,182,212,0.7)] hover:cyan-glow transition-all"
          aria-label="Ask the ValveHub AI assistant"
        >
          <BotMessageSquare className="h-5 w-5" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="ValveHub Assistant"
          className="fixed z-[60] inset-2 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[400px] sm:h-[min(620px,calc(100svh-2rem))] flex flex-col rounded-2xl border border-white/10 bg-[#0a0f1c]/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <BotMessageSquare className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold">ValveHub Assistant</div>
              <div className="text-[11px] text-muted-foreground">Ask about valves, pumps and piping</div>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
                aria-label="Start a new chat"
                title="New chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" aria-live="polite">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hi! I can explain how valves and pumps work, compare valve types, and help with sizing, materials,
                  operation and maintenance questions.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-left text-xs font-medium px-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-foreground/90 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-primary/15 border border-primary/20 px-3.5 py-2 text-sm whitespace-pre-wrap break-words">
                    {m.content}
                  </div>
                ) : (
                  <div
                    key={i}
                    className={`self-start max-w-[92%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm leading-relaxed break-words ${
                      m.error ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200' : 'bg-white/[0.04] border border-white/10'
                    }`}
                  >
                    {m.content ? <Answer text={m.content} /> : <TypingDots />}
                  </div>
                ),
              )
            )}
          </div>

          <form
            className="border-t border-white/10 p-3 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-primary/40 px-3 py-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_CHARS}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your question…"
                aria-label="Your question"
                className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 max-h-28 py-1"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="h-8 w-8 shrink-0 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/80 px-1">
              Free AI assistant. Answers can be wrong, so check important values against standards and manufacturer manuals.
            </p>
          </form>
        </div>
      )}
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="Writing an answer">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}

// Minimal Markdown: paragraphs, bullet and numbered lists, **bold**, `code`. Builds React nodes, never raw HTML.
function Answer({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const items = list.items.map((it, i) => <li key={i}>{inline(it)}</li>);
    blocks.push(
      list.ordered ? (
        <ol key={blocks.length} className="list-decimal pl-5 flex flex-col gap-1">{items}</ol>
      ) : (
        <ul key={blocks.length} className="list-disc pl-5 flex flex-col gap-1">{items}</ul>
      ),
    );
    list = null;
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      const ordered = !!numbered;
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push((bullet || numbered)![1]);
    } else {
      flush();
      if (line) blocks.push(<p key={blocks.length}>{inline(line.replace(/^#{1,6}\s+/, ''))}</p>);
    }
  }
  flush();
  return <div className="flex flex-col gap-2">{blocks}</div>;
}

function inline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i} className="font-mono text-[12px] px-1 py-0.5 rounded bg-white/10">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
