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
    };
  }, [audioUrl]);

  function tryFinalize() {
    if (!recorderDoneRef.current || !recognitionDoneRef.current || !blobRef.current) return;
    const url = URL.createObjectURL(blobRef.current);
    setAudioUrl(url);
    onAudioReady(transcriptRef.current.trim());
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
    setAudioUrl(null);
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
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-100">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        {state === 'idle' && (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
          >
            <span className="w-3 h-3 rounded-full bg-white" />
            Avvia registrazione
          </button>
        )}

        {state === 'recording' && (
          <>
            <span className="flex items-center gap-2 text-sm font-medium text-red-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              {formatTime(elapsed)}
            </span>
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition"
            >
              <span className="w-3 h-3 rounded bg-white" />
              Ferma
            </button>
          </>
        )}

        {state === 'stopped' && (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300/40 transition"
          >
            Registra di nuovo
          </button>
        )}
      </div>

      {liveTranscript && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Trascrizione{state === 'recording' ? ' in corso…' : ''}
          </p>
          <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
            {liveTranscript}
          </p>
        </div>
      )}

      {audioUrl && state === 'stopped' && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Anteprima — {formatTime(elapsed)}
          </p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={audioUrl} className="w-full h-10" />
        </div>
      )}
    </div>
  );
}
