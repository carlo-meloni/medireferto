import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Prova con il modello 2.0 Flash (o 1.5 Flash se preferisci la stabilità)
export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

