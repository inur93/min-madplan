import { GetGroupInvitesApi } from "../pages/api";
import useSWR from "swr";


export function useInvitesCount() {
    const api = GetGroupInvitesApi();
    const data = useSWR('invites/count', () => api.count());

    return data;
}