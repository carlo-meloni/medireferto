'use client';

import { useState, useRef, useEffect } from 'react';

type RecorderState = 'idle' | 'recording' | 'stopped';

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionResultEvent extends Event {
  results: SpeechRecognitionResult[] & { length: number };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

interface AudioRecorderProps {
  onAudioReady: (transcript: string) => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function AudioRecorder({ onAudioReady }: AudioRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [trackUrl, setTrackUrl] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Coordination refs — both must finish before calling onAudioReady
  const blobRef = useRef<Blob | null>(null);
  const transcriptRef = useRef('');
  const durationRef = useRef(0);
  const recorderDoneRef = useRef(false);
  const recognitionDoneRef = useRef(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (trackUrl) URL.revokeObjectURL(trackUrl);
    };
  }, [audioUrl, trackUrl]);

  function tryFinalize() {
    if (!recorderDoneRef.current || !recognitionDoneRef.current || !blobRef.current) return;
    const url = URL.createObjectURL(blobRef.current);
    setAudioUrl(url);
    const text = transcriptRef.current.trim();
    if (text) {
      const vtt = `WEBVTT\n\n00:00:00.000 --> 99:59:59.999\n${text}`;
      setTrackUrl(URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' })));
    }
    onAudioReady(text);
  }

  async function startRecording() {
    setError(null);
    setLiveTranscript('');
    transcriptRef.current = '';
    blobRef.current = null;
    durationRef.current = 0;
    recorderDoneRef.current = false;
    recognitionDoneRef.current = false;

    const win = window as WindowWithSpeech;
    const SpeechRecognitionAPI = win.SpeechRecognition ?? win.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError('Trascrizione non supportata in questo browser. Usa Chrome o Edge.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // ── MediaRecorder ──────────────────────────────────────────────────────
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        blobRef.current = blob;
        durationRef.current = Math.round((Date.now() - startTimeRef.current) / 1000);
        recorderDoneRef.current = true;
        stream.getTracks().forEach((t) => t.stop());
        tryFinalize();
      };

      // ── SpeechRecognition ──────────────────────────────────────────────────
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'it-IT';

      recognition.onresult = (event: SpeechRecognitionResultEvent) => {
        let final = '';
        let interim = '';
        for (let i = 0; i < event.results.length; i++) {
          const r = event.results[i];
          if (r.isFinal) {
            final += r[0].transcript + ' ';
          } else {
            interim += r[0].transcript;
          }
        }
        // Keep full text (final + latest interim) for final callback
        transcriptRef.current = final + interim;
        setLiveTranscript(final + interim);
      };

      recognition.onend = () => {
        // Restart automatically if still recording (browser can stop on silence)
        if (mediaRecorderRef.current?.state === 'recording') {
          recognition.start();
          return;
        }
        recognitionDoneRef.current = true;
        tryFinalize();
      };

      recognition.onerror = () => {
        recognitionDoneRef.current = true;
        tryFinalize();
      };

      recorder.start();
      recognition.start();

      mediaRecorderRef.current = recorder;
      recognitionRef.current = recognition;
      startTimeRef.current = Date.now();
      setState('recording');
      setElapsed(0);
      intervalRef.current = setInterval(() => {
        setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch {
      setError('Impossibile accedere al microfono. Verifica i permessi del browser.');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    recognitionRef.current?.stop();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState('stopped');
  }

  function reset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (trackUrl) URL.revokeObjectURL(trackUrl);
    setAudioUrl(null);
    setTrackUrl(null);
    setElapsed(0);
    setLiveTranscript('');
    transcriptRef.current = '';
    blobRef.current = null;
    recorderDoneRef.current = false;
    recognitionDoneRef.current = false;
    setState('idle');
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-4">
        {state === 'idle' && (
          <button
            type="button"
            onClick={startRecording}
            className="inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          >
            <span className="flex items-center justify-center w-4 h-4 rounded-full ring-2 ring-white/40">
              <span className="w-2 h-2 rounded-full bg-white" />
            </span>
            Avvia registrazione
          </button>
        )}

        {state === 'recording' && (
          <>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10">
                <span className="absolute w-10 h-10 rounded-full bg-red-500/20 animate-ping" />
                <span className="absolute w-7 h-7 rounded-full bg-red-500/15" />
                <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
              </div>
              <span className="text-lg font-mono font-semibold text-red-600 tabular-nums tracking-wider">
                {formatTime(elapsed)}
              </span>
            </div>
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-600/25 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all"
            >
              <span className="w-3 h-3 rounded-sm bg-white" />
              Ferma
            </button>
          </>
        )}

        {state === 'stopped' && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-300/40 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Registra di nuovo
          </button>
        )}
      </div>

      {liveTranscript && (
        <div className="rounded-xl border border-zinc-200 bg-linear-to-b from-zinc-50/80 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            {state === 'recording' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            )}
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Trascrizione{state === 'recording' ? ' in corso…' : ' completata'}
            </p>
          </div>
          <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
            {liveTranscript}
          </p>
        </div>
      )}

      {audioUrl && state === 'stopped' && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <p className="mb-3 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Registrazione completata — {formatTime(elapsed)}
          </p>
          <audio controls src={audioUrl} className="w-full h-10" aria-label="Registrazione audio della visita">
            {trackUrl && <track kind="descriptions" src={trackUrl} label="Trascrizione" default />}
          </audio>
        </div>
      )}
    </div>
  );
}
