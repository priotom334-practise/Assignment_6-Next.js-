

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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

const MyPlanPage = () => {
    const [tab, setTab] = useState<TabKey>('today');
    const [sortBy, setSortBy] = useState<SortKey>('duration');
    const [todayPlan, setTodayPlan] = useState<PlanItem[]>(() => readPlan(STORAGE_KEYS.today));
    const [savedPlan, setSavedPlan] = useState<PlanItem[]>(() => readPlan(STORAGE_KEYS.saved));

    const activeItems = tab === 'today' ? todayPlan : savedPlan;
    const sortedItems = [...activeItems].sort((left, right) =>
        sortBy === 'rating' ? right.rating - left.rating : left[sortBy] - right[sortBy]
    );
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
                        <button
                            type="button"
                            onClick={() => setTab('today')}
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                                tab === 'today' ? 'bg-[#d9ff3f] text-black' : 'text-gray-300'
                            }`}
                        >
                            Today&apos;s Plan
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('saved')}
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                                tab === 'saved' ? 'bg-[#d9ff3f] text-black' : 'text-gray-300'
                            }`}
                        >
                            Saved
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="text-gray-400">Sort by</span>
                        <select
                            aria-label="Sort workouts by"
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as SortKey)}
                            className="rounded-full border border-gray-700 bg-[#111a22] px-3 py-2 font-semibold text-gray-200"
                        >
                            <option value="duration">Time</option>
                            <option value="calories">Calories</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                </div>

                {activeItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-700 bg-[#0d141b] p-6 text-center text-sm text-gray-400">
                        No workouts in this list yet.
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
                                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 text-orange-400">
                                                    <path d="M12 22a7 7 0 0 0 7-7c0-3.5-2.5-5.5-4-8-1 2-2 3-3 3-1-3-3-5-3-5s.5 4-2 7a7 7 0 0 0 5 10Z" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 22a3 3 0 0 0 3-3c0-1.5-1-2.5-2-3.5-.5 1-1.5 1.5-2.5 2A3 3 0 0 0 12 22Z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {item.calories} kcal
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-[#d9ff3f]">
                                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                                                    <path d="m12 2.75 2.86 5.8 6.4.93-4.63 4.51 1.09 6.37L12 17.35l-5.72 3.01 1.09-6.37-4.63-4.51 6.4-.93L12 2.75Z" />
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

export default MyPlanPage;