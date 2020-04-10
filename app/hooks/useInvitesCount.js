import useSWR from "swr";
import { GetGroupInvitesApi } from "../api";


export function useInvitesCount() {
    const api = GetGroupInvitesApi();
    const data = useSWR('invites/count', () => api.count());

    return data;
}