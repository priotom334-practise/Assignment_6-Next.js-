import Image from 'next/image';
import Link from 'next/link';
import type { Workout } from '../types/type';

const Items = async () => {
    const res = await fetch('https://api.abcz.workers.dev/api/fitlog');
    const data = await res.json();
    return data;
};

const library = async () => {
    const items = await Items();
    return (
        <div className="my-8">
            <div className="container mx-auto px-4 sm:px-6">
                <h1 className="text-2xl font-bold">THE LIBRARY</h1>
                <p className="mt-1 text-sm text-gray-400">Twelve lifts covering every major muscle group.</p>
            </div>

            <div className="container mx-auto mt-6 grid gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
                {items.map((item: Workout) => (
                    <Link key={item.id} href={`/workouts/${item.id}`} className="block overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-lg">
                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                            {item.image 
                               ? (<Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />) 
                           :"" }
                        </div>
                        
                        <div className="space-y-4 p-5">
                            <div className="flex flex-wrap gap-2">
                                {item.muscleGroups.slice(0, 2).map((muscleGroup) => (
                                    <span key={muscleGroup} className="rounded-full bg-lime-400 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-black">
                                        {muscleGroup}
                                    </span>
                                ))}
                            </div>

                            <div>
                                <h2 className="text-lg font-black uppercase leading-tight tracking-wide text-white">{item.name}</h2>
                                <p className="mt-1 text-sm text-gray-400">{item.equipment}</p>
                            </div>

                            <div className="flex items-center justify-between border border-gray-800 px-3 py-2 text-xs text-gray-400">
                                <span>{item.duration} min</span>
                                <span>{item.caloriesBurned} kcal</span>
                                <span className="text-yellow-300">★ {item.rating}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default library;