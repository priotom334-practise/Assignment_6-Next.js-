'use client';

import { useRouter } from 'next/navigation';
import type { Workout } from '@/types/type';

type PlanItem = {
    id: number;
    name: string;
    equipment: string;
    image: string;
    duration: number;
    calories: number;
    rating: number;
};

const readPlan = (key: string): PlanItem[] => {
    try {
        const stored = window.localStorage.getItem(key);
        const parsed: unknown = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export default function WorkoutActions({ workout }: { workout: Workout }) {
    const router = useRouter();

    const addWorkout = (target: 'today' | 'saved') => {
        const storageKey = target === 'today' ? 'fitlog_today_plan' : 'fitlog_saved_plan';
        const current = readPlan(storageKey);
        const item: PlanItem = {
            id: workout.id,
            name: workout.name,
            equipment: workout.equipment,
            image: workout.image,
            duration: workout.duration,
            calories: workout.caloriesBurned,
            rating: workout.rating,
        };
        const next = current.some((entry) => entry.id === item.id) ? current : [...current, item];

        window.localStorage.setItem(storageKey, JSON.stringify(next));
        window.dispatchEvent(new Event('fitlog:plan-updated'));
        router.push(`/MyPlan?tab=${target}`);
    };

    return (
        <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => addWorkout('today')} className="btn btn-warning">
                Add to today&apos;s plan
            </button>
            <button type="button" onClick={() => addWorkout('saved')} className="btn btn-soft">
                Save for later
            </button>
        </div>
    );
}