import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-4 py-16 text-center text-white">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-400">FitLog / 404</p>
            <h1 className="mt-4 text-6xl font-black tracking-tight sm:text-8xl">NOT FOUND</h1>
            <p className="mt-4 max-w-md text-sm text-gray-400">
                This page or workout does not exist.
            </p>
            <Link href="/" className="mt-8 rounded-full bg-lime-400 px-5 py-3 text-sm font-black uppercase text-black transition hover:bg-lime-300">
                Back to workouts
            </Link>
        </main>
    );
}
