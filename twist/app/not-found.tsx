import React from 'react';

export default function NotFound() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold">404 Not Found</h1>
            <p className="text-xl mt-1">
                The page you are looking for was not found.
            </p>
        </div>
    );
}
