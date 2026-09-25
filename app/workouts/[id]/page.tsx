import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Workout } from '@/types/type';

const getWorkout = async (id: string): Promise<Workout | null> => {
    const res = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`);
    const data = await res.json();
    return data;
}

const WorkoutDetails = async ({ params }: PageProps<'/workouts/[id]'>) => {
    const { id } = await params;
    const workout = await getWorkout(id);

    if (!workout) {
        notFound();
    }

    const details = [
        ['Equipment', workout.equipment],
        ['Difficulty', workout.difficulty],
        ['Sets', String(workout.sets)],
        ['Reps', workout.reps],
        ['Duration', `${workout.duration} min`],
        ['Calories', `${workout.caloriesBurned} kcal`],
        ['Rating', String(workout.rating)],
    ];

    return (
        <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:py-12">
            <div className="relative aspect-\[4/3] overflow-hidden rounded-xl border border-gray-700 bg-gray-900 lg:aspect-\[3/4]">
                <Image src={workout.image} alt={workout.name} fill unoptimized className="object-cover" priority />
            </div>

            <section className="space-y-6 text-white">
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
                        {workout.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button className="btn btn-warning inline-flex items-center gap-2">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                            <path d="M7 3.75v3M17 3.75v3M4.5 9.5h15" strokeLinecap="round" />
                            <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
                            <path d="M8.5 13.5h7M12 10v7" strokeLinecap="round" />
                        </svg>
                        Add to today's Plan
                    </button>
                    <button className="btn btn-soft inline-flex items-center gap-2">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                            <path d="M7.5 4.5h9a1.5 1.5 0 0 1 1.5 1.5v14.25l-6-3.6-6 3.6V6A1.5 1.5 0 0 1 7.5 4.5Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Save For Later
                    </button>
                </div>
            </section>
        </main>
    );
};

export default WorkoutDetails;