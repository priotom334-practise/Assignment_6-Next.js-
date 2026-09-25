'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type PlanItem = {
    id: number;
    name: string;
    equipment: string;
    image: string;
    duration: number;
    calories: number;
    rating: number;
};

type TabKey = 'today' | 'saved';
type SortKey = 'duration' | 'calories' | 'rating';

const STORAGE_KEYS = {
    today: 'fitlog_today_plan',
    saved: 'fitlog_saved_plan',
};

const readPlan = (key: string): PlanItem[] => {
    if (typeof window === 'undefined') return [];

    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const persistPlan = (key: string, items: PlanItem[]) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(items));
        window.dispatchEvent(new Event('fitlog:plan-updated'));
    }
};

const MyPlanContent = () => {
    const [sortBy, setSortBy] = useState<SortKey>('duration');
    const [todayPlan, setTodayPlan] = useState<PlanItem[]>(() => readPlan(STORAGE_KEYS.today));
    const [savedPlan, setSavedPlan] = useState<PlanItem[]>(() => readPlan(STORAGE_KEYS.saved));
    const searchParams = useSearchParams();
    const tab: TabKey = searchParams.get('tab') === 'saved' ? 'saved' : 'today';

    const activeItems = tab === 'today' ? todayPlan : savedPlan;
    const sortedItems = [...activeItems].sort((first, second) => {
        if (sortBy === 'rating') return second.rating - first.rating;
        return first[sortBy] - second[sortBy];
    });
    const totalMinutes = activeItems.reduce((sum, item) => sum + item.duration, 0);
    const totalCalories = activeItems.reduce((sum, item) => sum + item.calories, 0);

    const handleDone = (id: number) => {
        if (tab === 'today') {
            const next = todayPlan.filter((item) => item.id !== id);
            setTodayPlan(next);
            persistPlan(STORAGE_KEYS.today, next);
            return;
        }

        const next = savedPlan.filter((item) => item.id !== id);
        setSavedPlan(next);
        persistPlan(STORAGE_KEYS.saved, next);
    };

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6 lg:px-8">
            <header className="mb-6">
                <h1 className="text-4xl font-black uppercase tracking-tight">MY PLAN</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Cap of five lifts for today. Finish them, then load more.
                </p>
            </header>

            <section className="mb-6 grid gap-4 rounded-2xl border border-gray-800 bg-[#0b1117] p-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-800 bg-[#111a22] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Exercises</p>
                    <div className="mt-2 flex items-end gap-3">
                        <span className="text-3xl font-black text-[#d9ff3f]">{activeItems.length}</span>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-[#111a22] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Minutes</p>
                    <div className="mt-2 flex items-end gap-3">
                        <span className="text-3xl font-black text-[#d9ff3f]">{totalMinutes}</span>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-[#111a22] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Calories</p>
                    <div className="mt-2 flex items-end gap-3">
                        <span className="text-3xl font-black text-[#d9ff3f]">{totalCalories}</span>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-[#0b1117] p-4 sm:p-5">
                <div className="mb-5 flex flex-col gap-3 border-b border-gray-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-[#111a22] p-1">
                        <Link
                            href="/MyPlan?tab=today"
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                                tab === 'today' ? 'bg-[#d9ff3f] text-black' : 'text-gray-300'
                            }`}
                        >
                            Today&apos;s Plan
                        </Link>
                        <Link
                            href="/MyPlan?tab=saved"
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                                tab === 'saved' ? 'bg-[#d9ff3f] text-black' : 'text-gray-300'
                            }`}
                        >
                            Saved
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-3">
                        <span className="font-bold uppercase tracking-[0.14em] text-gray-500">Sort by</span>
                        <div
                            role="group"
                            aria-label="Sort exercises"
                            className="inline-flex w-fit max-w-full items-center gap-1 rounded-xl border border-gray-800 bg-[#080d12] p-1"
                        >
                            <button
                                type="button"
                                aria-label="Sort by shortest duration"
                                aria-pressed={sortBy === 'duration'}
                                onClick={() => setSortBy('duration')}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 sm:px-3 ${
                                    sortBy === 'duration'
                                        ? 'bg-[#d9ff3f] text-black shadow-sm'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0">
                                    <circle cx="12" cy="12" r="8" />
                                    <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Duration
                            </button>
                            <button
                                type="button"
                                aria-label="Sort by lowest calories"
                                aria-pressed={sortBy === 'calories'}
                                onClick={() => setSortBy('calories')}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 sm:px-3 ${
                                    sortBy === 'calories'
                                        ? 'bg-[#d9ff3f] text-black shadow-sm'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0">
                                    <path d="M12 22c4 0 7-3 7-7 0-2.7-1.5-4.8-4-6.5.2 2-1 3-2 3.5.2-3.3-1.3-6.2-4.5-9C9 7 5 10.5 5 15c0 4 3 7 7 7Z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Calories
                            </button>
                            <button
                                type="button"
                                aria-label="Sort by highest rating"
                                aria-pressed={sortBy === 'rating'}
                                onClick={() => setSortBy('rating')}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 sm:px-3 ${
                                    sortBy === 'rating'
                                        ? 'bg-[#d9ff3f] text-black shadow-sm'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                                    <path d="m10 2 2.47 5 5.53.8-4 3.9.94 5.5L10 14.6l-4.94 2.6.94-5.5-4-3.9L7.53 7 10 2Z" />
                                </svg>
                                Rating
                            </button>
                        </div>
                    </div>
                </div>

                {activeItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-700 bg-[#0d141b] p-6 text-center text-sm text-gray-400 flex flex-col items-center gap-4">
                        Browse the library and add a lift to get today moving.
                        <Link href="/" className='btn rounded-full bg-lime-500'> Go to workouts</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-[#0d141b] p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
                                        <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" unoptimized />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-black uppercase tracking-tight text-white">{item.name}</h2>
                                        <p className="mt-1 text-sm text-gray-400">{item.equipment}</p>

                                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-300">
                                            <span className="inline-flex items-center gap-1">
                                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                                                    <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <circle cx="12" cy="12" r="8" />
                                                </svg>
                                                {item.duration} min
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                                                    <path d="M12 22c4 0 7-3 7-7 0-2.7-1.5-4.8-4-6.5.2 2-1 3-2 3.5.2-3.3-1.3-6.2-4.5-9C9 7 5 10.5 5 15c0 4 3 7 7 7Z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {item.calories} kcal
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-[#d9ff3f]">
                                                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                                                    <path d="m10 2 2.47 5 5.53.8-4 3.9.94 5.5L10 14.6l-4.94 2.6.94-5.5-4-3.9L7.53 7 10 2Z" />
                                                </svg>
                                                {item.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end sm:self-center">
                                    <Link
                                        href={`/workouts/${item.id}`}
                                        className="inline-flex items-center justify-center rounded-full border border-gray-600 bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:border-gray-400 hover:bg-gray-800"
                                    >
                                        View Details
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => handleDone(item.id)}
                                        className="inline-flex items-center gap-2 rounded-full bg-[#d9ff3f] px-4 py-2 text-xs font-black uppercase tracking-wide text-black transition hover:bg-[#c9f128]"
                                    >
                                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                            <path d="M5 12.5h14M12 5.5v14" strokeLinecap="round" />
                                        </svg>
                                        Mark as Done
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

const MyPlanPage = () => (
    <Suspense fallback={<main className="px-4 py-10 text-center text-gray-400">Loading plan...</main>}>
        <MyPlanContent />
    </Suspense>
);

export default MyPlanPage;