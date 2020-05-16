import useSWR from "swr";
import { GetGroupInvitesApi } from "../../_api";
import { useSelf } from "../useSelf";


export function useInvites() {
    const api = GetGroupInvitesApi();
    const [self] = useSelf();
    const {
        data: invites,
        isValidating,
        revalidate
    } = useSWR(() => ['invites', self.email],
        (_, email) => api.find({
            email,
            status: 'sent'
        }));

    return [{ invites, loading: !invites || isValidating }, revalidate];
}