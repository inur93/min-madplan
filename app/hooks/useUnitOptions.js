import useSWR from "swr";
import { GetUnitsApi } from "../_api";



export function useUnitOptions() {
    const api = GetUnitsApi();
    const { data } = useSWR('unitoptions', async () => {
        return await api.getAll();
    });
    return [data || []];
}