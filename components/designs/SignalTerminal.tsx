"use client";

import { FormEvent, KeyboardEvent, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";

type TerminalEntry = {
  id: number;
  kind: "command" | "output" | "system" | "shot";
  text: string;
  outcome?: "swish" | "made" | "miss";
};

const commands = ["help", "shoot", "movies", "clear", "exit"] as const;
const letterboxdUrl = "https://letterboxd.com/hadimalik12/";
const meterLength = 21;
const target = Math.floor(meterLength / 2);

export default function SignalTerminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { id: 0, kind: "system", text: "welcome to my room! type help to see available commands." },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [shooting, setShooting] = useState(false);
  const [meter, setMeter] = useState(0);
  const [score, setScore] = useState({ makes: 0, attempts: 0 });
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const nextEntryId = useRef(1);
  const meterDirection = useRef(1);
  const meterRef = useRef(0);
  const nextRoundTimer = useRef<number | null>(null);
  const dragState = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);

  const append = useCallback((kind: TerminalEntry["kind"], text: string) => {
    setEntries(current => [...current, { id: nextEntryId.current++, kind, text }]);
  }, []);

  const appendShot = useCallback((outcome: NonNullable<TerminalEntry["outcome"]>, text: string) => {
    setEntries(current => [...current, { id: nextEntryId.current++, kind: "shot", outcome, text }]);
  }, []);

  const finishShot = useCallback((position: number) => {
    const distance = Math.abs(position - target);
    const made = distance <= 3;
    const swish = distance <= 1;
    setShooting(false);
    const updated = { makes: score.makes + (made ? 1 : 0), attempts: score.attempts + 1 };
    const outcome = swish ? "swish" : made ? "made" : "miss";
    const complete = updated.attempts === 5;
    setScore(updated);
    appendShot(outcome, complete ? `${outcome} · final score ${updated.makes}/5` : `${outcome} · ${updated.makes}/${updated.attempts}`);
    if (complete) {
      setGameInProgress(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      nextRoundTimer.current = window.setTimeout(() => setShooting(true), 650);
    }
  }, [appendShot, score]);

  const cancelShot = useCallback(() => {
    setShooting(false);
    setGameInProgress(false);
    if (nextRoundTimer.current) window.clearTimeout(nextRoundTimer.current);
    append("output", "Shot cancelled.");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [append]);

  const closeTerminal = () => {
    setOpen(false);
    setShooting(false);
    setGameInProgress(false);
    if (nextRoundTimer.current) window.clearTimeout(nextRoundTimer.current);
  };

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => () => {
    if (nextRoundTimer.current) window.clearTimeout(nextRoundTimer.current);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, shooting, meter]);

  useEffect(() => {
    if (!shooting) return;
    meterDirection.current = 1;
    meterRef.current = 0;
    setMeter(0);
    const interval = window.setInterval(() => {
      setMeter(current => {
        let next = current + meterDirection.current;
        if (next >= meterLength - 1 || next <= 0) {
          next = Math.max(0, Math.min(meterLength - 1, next));
          meterDirection.current *= -1;
        }
        meterRef.current = next;
        return next;
      });
    }, 48);
    const handleShot = (event: globalThis.KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        finishShot(meterRef.current);
      }
      if (event.key === "Escape") {
        event.preventDefault();
        cancelShot();
      }
    };
    window.addEventListener("keydown", handleShot);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("keydown", handleShot);
    };
  }, [shooting, finishShot, cancelShot]);

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;
    append("command", command);
    const updatedHistory = [...commandHistory, command];
    setCommandHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length);
    setInput("");

    switch (command) {
      case "help":
        append("output", "Available commands:\n  help      list available commands\n  shoot     play a five-shot round\n  movies    open my Letterboxd\n  clear     clear the terminal\n  exit      close the terminal");
        break;
      case "shoot":
        if (gameInProgress) {
          append("output", "A five-shot round is already in progress.");
          break;
        }
        setScore({ makes: 0, attempts: 0 });
        setGameInProgress(true);
        append("output", "Five shots. Time each release with SPACE. ESC cancels the round.");
        setShooting(true);
        break;
      case "movies":
        window.open(letterboxdUrl, "_blank", "noopener,noreferrer");
        append("output", "opening my Letterboxd...");
        break;
      case "clear":
        setEntries([]);
        break;
      case "exit":
        closeTerminal();
        break;
      default:
        append("output", `command not found: ${command}\nType \"help\" to see available commands.`);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    runCommand(input);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) return;
      const nextIndex = Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex] ?? "");
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = Math.min(commandHistory.length, historyIndex + 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex] ?? "");
    }
    if (event.key === "Tab") {
      const match = commands.find(command => command.startsWith(input.toLowerCase()));
      if (match) {
        event.preventDefault();
        setInput(match);
      }
    }
  };

  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    dragState.current = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    setPosition({ x: rect.left, y: rect.top });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const drag = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragState.current;
    const panel = panelRef.current;
    if (!state || state.pointerId !== event.pointerId || !panel) return;
    const rect = panel.getBoundingClientRect();
    const x = Math.max(8, Math.min(window.innerWidth - rect.width - 8, event.clientX - state.offsetX));
    const y = Math.max(8, Math.min(window.innerHeight - rect.height - 8, event.clientY - state.offsetY));
    setPosition({ x, y });
  };

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const meterCharacters = Array.from({ length: meterLength }, (_, index) => {
    if (index === meter) return "●";
    if (Math.abs(index - target) <= 1) return "│";
    return "·";
  }).join("");

  return <div className="signal-terminal-shell">
    {open && <section className="signal-terminal-panel" ref={panelRef} role="dialog" aria-label="Interactive terminal" style={position ? { position: "fixed", left: position.x, top: position.y, bottom: "auto" } : undefined}>
      <header className="signal-terminal-titlebar" onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <div className="signal-terminal-controls" aria-label="Window controls">
          <button className="signal-terminal-close" type="button" onClick={closeTerminal} aria-label="Close terminal" />
          <span className="signal-terminal-minimize" aria-hidden="true" />
          <span className="signal-terminal-expand" aria-hidden="true" />
        </div>
        <span className="signal-terminal-title">hadi — zsh — 80×24</span>
        <span className="signal-terminal-title-spacer" aria-hidden="true" />
      </header>

      <div className="signal-terminal-log" ref={logRef} aria-live="polite">
        {entries.map(entry => entry.kind === "shot"
          ? <div className="signal-terminal-result" data-outcome={entry.outcome} key={entry.id}>
              <span className="signal-terminal-result-visual" aria-hidden="true"><i className="signal-terminal-result-ball" /><i className="signal-terminal-result-rim" /></span>
              <span>{entry.text}</span>
            </div>
          : entry.kind === "system"
            ? <pre className="signal-terminal-entry signal-terminal-system" key={entry.id}>welcome to my room!{"\n"}type <span className="signal-terminal-accent">help</span> to see available commands.</pre>
            : entry.kind === "command"
              ? <pre className="signal-terminal-entry signal-terminal-command" key={entry.id}><span className="signal-terminal-prompt">hadi@home:~/room$</span> {entry.text}</pre>
              : <pre className="signal-terminal-entry signal-terminal-output" key={entry.id}>{entry.text}</pre>)}
        {shooting && <div className="signal-terminal-shot" role="progressbar" aria-label="Shot meter" aria-valuemin={0} aria-valuemax={meterLength - 1} aria-valuenow={meter}>
          <span>shot {score.attempts + 1}/5 [{meterCharacters}]</span>
          <small>SPACE to shoot · ESC to cancel</small>
        </div>}
      </div>

      <form className="signal-terminal-form" onSubmit={submit}>
        <label htmlFor="signal-terminal-input">hadi@home:~/room$</label>
        <input
          id="signal-terminal-input"
          ref={inputRef}
          value={input}
          onChange={event => setInput(event.target.value)}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          disabled={gameInProgress}
          aria-label="Terminal command"
        />
      </form>
    </section>}

    <button className="signal-terminal-launcher" type="button" aria-expanded={open} onClick={() => open ? closeTerminal() : setOpen(true)} aria-label={open ? "Close terminal" : "Open terminal"} data-tooltip="terminal">
      <span aria-hidden="true">&gt;_</span>
    </button>
  </div>;
}
