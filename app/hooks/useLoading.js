import { useState } from "react";

export function useLoading() {
    const [loading, setLoading] = useState(false);

    const load = async (asyncFunction) => {
        setLoading(true);
        const result = await asyncFunction();
        setLoading(false);
        return result;
    }
    return [loading, load];
}