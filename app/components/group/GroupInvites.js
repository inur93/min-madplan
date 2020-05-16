import { List } from "semantic-ui-react";
import useInviteActions from "../../hooks/invites/useInviteActions";
import { useInvites } from "../../hooks/invites/useInvites";
import { Loader } from "../shared/Loader";
import { Invite } from "./Invite";

export default function GroupInvites({ loading, invites, onAccept, onDecline }) {

    if (!loading && (!invites || !invites.length)) {
        return <p>Du har ingen afventende invitationer i øjeblikket.</p>;
    }
    return (
        <List>
            {invites.map(
                invite => <Invite key={invite._id} invite={invite} onAccept={onAccept} onDecline={onDecline} />
            )}
        </List>
    )
}

export function GroupInvitesWrapped() {
    const [state, revalidate] = useInvites();
    const [, handlers, actions] = useInviteActions(revalidate);
    const { onClick } = handlers;

    return <Loader loading={state.loading} >
        {(state.invites && state.invites.length > 0) && <p>Du har en invititation liggende. Godkend invitationen for at komme i gang og planlægge madplanen for næste uge.</p>}
        <GroupInvites invites={state.invites}
            onAccept={onClick(actions.accept)}
            onDecline={onClick(actions.decline)} />
    </Loader>
}