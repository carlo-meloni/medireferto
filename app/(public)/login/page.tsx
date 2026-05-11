import Image from 'next/image';
import Link from 'next/link';
import { loginAction } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-dvh flex">

      {/* Left panel — photo + brand overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col">
        <Image
          src="/login-img.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div />
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold leading-snug text-gray-900">
              La refertazione medica, reinventata.
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Registra, trascrivi e genera referti automaticamente con l&apos;aiuto dell&apos;intelligenza artificiale.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#077EFB]/4 p-4 sm:p-8 lg:p-10">
        <div className="w-full max-w-sm">

          <div className="mb-6 sm:mb-8">
            <Link href="/" className="flex justify-center mb-6 sm:mb-8">
              <Image
                src="/dottor_twin.svg"
                alt="MediReferto"
                width={140}
                height={40}
                className="w-32 sm:w-40 h-auto"
                priority
              />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Accedi</h1>
            <p className="mt-1 text-sm text-gray-500">
              Inserisci le tue credenziali per continuare
            </p>
          </div>

          <form action={loginAction} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-colors focus:border-[#077EFB] focus:outline-none focus:ring-2 focus:ring-[#077EFB]/20"
                placeholder="medico@esempio.it"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-colors focus:border-[#077EFB] focus:outline-none focus:ring-2 focus:ring-[#077EFB]/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="shrink-0 mt-0.5" aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#077EFB] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0570e0] focus:outline-none focus:ring-2 focus:ring-[#077EFB] focus:ring-offset-2"
            >
              Accedi
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
