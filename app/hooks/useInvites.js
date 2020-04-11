import useSWR from "swr";
import { GetGroupInvitesApi } from "../_api";


export function useInvites() {
    const api = GetGroupInvitesApi();
    const cache = useSWR('invites', () => api.myInvites());

    const { data, revalidate } = cache;
    return [data, revalidate];
}