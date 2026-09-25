import React, { Suspense } from 'react';
import Banner from "@/components/banner"
import Library from '@/components/library';

const page = () => {
  return (
    <div>
      <Banner />
      <Suspense
        fallback={
          <div role="status" aria-live="polite" className="container mx-auto flex min-h-64 flex-col items-center justify-center gap-4 px-4 text-sm text-gray-400 sm:px-6">
            <span aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-lime-400" />
            Loading exercises...
          </div>
        }
      >
        <Library />
      </Suspense>
    </div>
  );
};

export default page;