import useSWR from "swr";
import { GetGroupInvitesApi } from "../../_api";
import { useSelf } from "../useSelf";
import { toQueryStr } from "../../functions/routerFunctions";

export function useInvitesFromMe() {
    const api = GetGroupInvitesApi();
    const [self] = useSelf();
    const {
        data: invites,
        isValidating,
        revalidate
    } = useSWR(() => ['/invites', self._id],
        (_, from) => api.find({
            from,
            status: 'sent'
        }));

    return [{ invites, loading: !invites || isValidating }, revalidate];
}