'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from "@/public/logo.png"

const readPlanCount = (key: string) => {
    try {
        const plan = JSON.parse(window.localStorage.getItem(key) ?? '[]');
        return Array.isArray(plan) ? plan.length : 0;
    } catch {
        return 0;
    }
};

const Navbar = () => {
    const pathname = usePathname();
    const isWorkoutsActive = pathname === '/';
    const isMyPlanActive = pathname === '/MyPlan';
    const [planCounts, setPlanCounts] = useState({ today: 0, saved: 0 });

    useEffect(() => {
        const syncPlanCounts = () => {
            setPlanCounts({
                today: readPlanCount('fitlog_today_plan'),
                saved: readPlanCount('fitlog_saved_plan'),
            });
        };

        syncPlanCounts();
        window.addEventListener('storage', syncPlanCounts);
        window.addEventListener('fitlog:plan-updated', syncPlanCounts);

        return () => {
            window.removeEventListener('storage', syncPlanCounts);
            window.removeEventListener('fitlog:plan-updated', syncPlanCounts);
        };
    }, [pathname]);

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="container mx-auto flex items-center">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><Link className={isWorkoutsActive ? 'bg-gray-700 rounded-full text-lime-600 font-bold' : ''} href="/">Workouts</Link></li>
                            <li><Link className={isMyPlanActive ? 'bg-gray-700 rounded-full text-lime-600 font-bold' : ''} href="/MyPlan">My Plan</Link></li>
                        </ul>
                    </div>
                    <Image src={logo} alt="logo" className="h-4 w-4 object-contain lg:h-4 lg:w-6" />
                    <Link href="/" className="btn btn-ghost text-xl">FITLOG</Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-4 px-1">
                        <li><Link className={isWorkoutsActive ? 'bg-gray-700 rounded-full text-lime-600 font-bold' : ''} href="/">Workouts</Link></li>
                        <li><Link className={isMyPlanActive ? 'bg-gray-700 rounded-full text-lime-600 font-bold' : ''} href="/MyPlan">My Plan</Link></li>
                    </ul>
                </div>
                <div className="navbar-end gap-4">
                    <Link href="/MyPlan" className="btn rounded-full">
                        Plan <span className="badge badge-sm bg-lime-400 text-black">{planCounts.today}</span>
                    </Link>
                    <Link href="/MyPlan" className="btn rounded-full">
                        Saved <span className="badge badge-sm">{planCounts.saved}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;