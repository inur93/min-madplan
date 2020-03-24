import useSWR from "swr";


export function useData(name, endpoint) {
    const result = useSWR(name, () => endpoint());
    return result && result.data;
}