import Image from 'next/image';
import { notFound } from 'next/navigation';
import WorkoutActions from './workout-actions';
import type { Workout } from '@/types/type';

const getWorkout = async (id: string): Promise<Workout | null> => {
    const response = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`);
    if (!response.ok) return null;

    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || !('id' in data) || String(data.id) !== id) {
        return null;
    }

    return data as Workout;
};

export default async function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) notFound();

    const workout = await getWorkout(id);
    if (!workout) notFound();

    const details = [
        ['Equipment', workout.equipment],
        ['Difficulty', workout.difficulty],
        ['Sets', String(workout.sets)],
        ['Reps', workout.reps],
        ['Duration', `${workout.duration} min`],
        ['Calories', `${workout.caloriesBurned} kcal`],
        ['Rating', String(workout.rating)],
    ];
    const instructions = Array.isArray(workout.instructions)
        ? workout.instructions
        : [workout.instructions];

    return (
        <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 text-white sm:px-6 lg:grid-cols-2 lg:gap-10 lg:py-12">
            <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-gray-700 bg-gray-900 lg:aspect-3/4">
                <Image src={workout.image} alt={workout.name} fill unoptimized className="object-cover" priority />
            </div>

            <section className="space-y-6">
                <header>
                    <h1 className="text-3xl font-black uppercase leading-tight sm:text-4xl">{workout.name}</h1>
                    <p className="mt-2 text-sm text-gray-400">{workout.description}</p>
                </header>

                <div className="flex flex-wrap gap-2">
                    {workout.muscleGroups.map((muscleGroup) => (
                        <span key={muscleGroup} className="rounded-full bg-lime-400 px-3 py-1 text-[11px] font-black uppercase text-black">
                            {muscleGroup}
                        </span>
                    ))}
                </div>

                <dl className="divide-y divide-gray-800 overflow-hidden rounded-xl border border-gray-800 bg-gray-900 px-4">
                    {details.map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-4 py-3 text-xs">
                            <dt className="font-bold uppercase tracking-wide text-gray-400">{label}</dt>
                            <dd className="text-right font-semibold text-gray-200">{value}</dd>
                        </div>
                    ))}
                </dl>

                <div>
                    <h2 className="text-sm font-black uppercase tracking-wide">Instructions</h2>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-300">
                        {instructions.map((instruction, index) => (
                            <li key={`${instruction}-${index}`}>{instruction}</li>
                        ))}
                    </ol>
                </div>

                <WorkoutActions workout={workout} />
            </section>
        </main>
    );
}