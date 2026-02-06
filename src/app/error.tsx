'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Crash Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-red-50">
            <h1 className="text-4xl font-bold text-red-600">ERROR DETECTED</h1>
            <h1 className="text-2xl font-bold">Something went wrong!</h1>
            <p className="text-muted-foreground">{error.message}</p>
            <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                onClick={() => reset()}
            >
                Try again
            </button>
        </div>
    );
}
