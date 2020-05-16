import useSWR from "swr";
import { GetGroupInvitesApi } from "../../_api";
import { useSelf } from "../useSelf";


export function useInvitesCount() {
    const api = GetGroupInvitesApi();
    const [self] = useSelf();
    const data = useSWR(() => ['/invites/count', self.email],
        (_, email) => api.count({
            email,
            status: 'sent'
        }));

    return data;
}