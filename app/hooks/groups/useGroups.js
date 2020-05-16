import useSWR from "swr";
import { GetGroupsApi } from "../../_api";



export function useGroups() {
    const api = GetGroupsApi();
    const {
        data: groups,
        isValidating,
        error
    } = useSWR('/groups', api.find);

    const state = {
        groups: groups || [],
        loading: !groups,
        reloading: isValidating,
        error
    }

    const handlers = {

    }
    return [state, handlers];
}