import { useEffect, useState } from 'react';

interface TypingDotsProps {
    speed?: number; // ms per dot change
}

export default function TypingDots({ speed = 350 }: TypingDotsProps) {
    const [count, setCount] = useState(1);

    useEffect(() => {
        const id = setInterval(() => {
            setCount((c) => (c >= 3 ? 1 : c + 1));
        }, speed);

        return () => clearInterval(id);
    }, [speed]);

    return (
        <span className="inline-flex items-center">
            {Array.from({ length: count }).map((_, i) => (
                <span
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-0.5"
                    style={{ opacity: 0.9 - i * 0.2 }}
                />
            ))}
        </span>
    );
}
