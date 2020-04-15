import useSWR from "swr";
import { GetPlanApi } from "../../_api";


export function usePlanHistory() {
    const api = GetPlanApi();
    
    const {
        data: history,
        isValidating
    } = useSWR('/plans', api.find);

    const state = {
        history: history || [],
        loading: !history
    }
    return [state];
}