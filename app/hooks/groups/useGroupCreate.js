import { useRouter } from "next/router";
import { useState } from "react";
import { GetGroupsApi, GetUsersApi } from "../../_api";
import { useSelf } from "../useSelf";

const actions = {
    create: 'create',
    addEmail: 'addEmail',
    removeEmail: 'removeEmail'
}
export function useGroupCreate(firstTime) {
    //api's
    const api = GetGroupsApi();
    const usersApi = GetUsersApi();

    const [name, setName] = useState("");
    const [sharedWith, setSharedWith] = useState([]);
    const [email, setEmail] = useState("");
    const router = useRouter();

    const [self] = useSelf();

    const onClick = (action) => async ({e, user}) => {

        switch (action) {
            case actions.create:
                const group = await api.create({
                    name,
                    groupInvites: sharedWith.map(email => ({ email }))
                });
                if (firstTime) {
                    await usersApi.update(self._id, {
                        selectedGroup: group._id
                    });
                    router.push(`/plan?view=history`);
                } else {
                    router.push('/');
                }
                break;
            case actions.addEmail:
                e.preventDefault();
                if (!email) return;
                setSharedWith([...sharedWith, email]);
                setEmail("");
                break;
            case actions.removeEmail:
                const updated = [...sharedWith];
                updated.splice(updated.indexOf(user), 1);
                setSharedWith(updated);
                break;
        }
    }

    const state = {
        name,
        email,
        sharedWith,
        firstTime: router.query.firstTime
    }

    const handlers = {
        setName,
        setEmail,
        onClick
    }
    return [state, handlers, actions];
}