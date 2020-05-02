import useSWR from "swr";
import { GetGroupInvitesApi } from "../_api";


export function useInvites() {
    const api = GetGroupInvitesApi();
    const {
        data: invites,
        isValidating,
        revalidate
    } = useSWR('invites', () => api.myInvites());

    return [{ invites, loading: !invites || isValidating }, revalidate];
}