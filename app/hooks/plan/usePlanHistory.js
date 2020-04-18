import useSWR from "swr";
import { GetPlanApi } from "../../_api";


export function usePlanHistory() {
    const api = GetPlanApi();
    
    const {
        data: history,
        isValidating
    } = useSWR('/food-plans', api.find);

    const state = {
        history: history || [],
        loading: !history
    }
    return [state];
}