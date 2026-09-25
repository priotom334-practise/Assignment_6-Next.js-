import React from 'react';
import Image from 'next/image';
import logo from "@/public/logo.png";

const footer = () => {
    return (
        <div className='flex flex-col items-center justify-between gap-4 bg-gray-900 px-4 py-6 text-white sm:flex-row sm:px-6 md:px-8'>
            <div className='flex items-center gap-3'>
                <Image src={logo} alt="logo" className='h-4 w-4 object-contain' />
                <a className="text-xl font-bold tracking-wide text-white">FITLOG</a>
            </div>

            <div className='text-center text-sm text-gray-300 sm:text-left'>
                <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
            </div>
        </div>
    );
};

export default footer;