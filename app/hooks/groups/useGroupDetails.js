import { GetGroupsApi } from "../../_api";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { useState } from "react";


export function useGroupDetails() {
    const api = GetGroupsApi();
    const router = useRouter();
    const [isLeaving, setLeaving] = useState(false);
    const {
        data: group,
        isValidating
    } = useSWR(
        () => ['/groups', router.query.id],
        (_, id) => api.findOne(id));


    const state = {
        group,
        loading: !group,
        promptNewAdmin: false,
        promptLeaveGroup: false,
        isLeaving,
        reloading: isValidating
    }

    const handlers = {
        leaveGroup: async (e) => {
            e.preventDefault();
            setLeaving(true);
            await api.leave(group._id);
            mutate('/groups');
            setLeaving(false);
            router.replace('/groups?view=history');
        }
    }

    return [state, handlers];
}