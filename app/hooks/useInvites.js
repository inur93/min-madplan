import useSWR from "swr";
import { GetGroupInvitesApi } from "../pages/api";


export function useInvites() {
    const api = GetGroupInvitesApi();
    const cache = useSWR('invites', () => api.myInvites());

    console.log('cache', cache);
    const { data, revalidate } = cache;
    return [data, revalidate];
}