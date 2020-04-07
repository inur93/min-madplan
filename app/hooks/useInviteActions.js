import { useState } from "react";
import { GetGroupInvitesApi, GetUsersApi } from "../pages/api";
import { useSelf } from "./useSelf";
import { useRouter } from "next/router";

const actions = {
    decline: 'decline',
    accept: 'accept'
}
export default function useInviteActions(revalidator) {
    const api = GetGroupInvitesApi();
    const usersApi = GetUsersApi();
    const router = useRouter();
    const [self] = useSelf();
    const [loading, setLoading] = useState(false);

    const onClick = (action) => async (data) => {
        switch (action) {
            case actions.decline:
                setLoading(true);
                await api.decline(data.id);
                setLoading(false);
                break;
            case actions.accept:
                setLoading(true);
                const invite = await api.accept(data.id);
                if (!self.selectedGroup) {
                    await usersApi.update(self._id, {
                        selectedGroup: invite.group._id
                    });
                    router.push('/plan');
                }
                setLoading(false);
        }
        if (revalidator) revalidator();
    }

    const state = {
        loading
    }
    const handlers = {
        onClick
    }
    return [state, handlers, actions];
}


export {
    actions
}