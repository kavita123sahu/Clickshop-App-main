import { useEffect, useState } from "react";

export const useDebouncedValue = (inputValue: string, delay: any) => {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, delay]);

    return debouncedValue;
};