import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export function useSort(name, defaultValue) {
    const key = `${name || 'sort'}_sortBy`;
    const router = useRouter();
    const [sortBy, setSortBy] = useState(defaultValue || localStorage.getItem(key));

    useEffect(() => {
        if (router.query.sortBy) {
            localStorage.setItem(key, router.query.sortBy);
            setSortBy(router.query.sortBy);
        }
    }, [router.query.sortBy])
    return [sortBy];
}