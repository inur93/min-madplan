import { List, ListDescription, Icon } from "semantic-ui-react";
import { useInvites } from "../../hooks/useInvites";
import useInviteActions from "../../hooks/useInviteActions";
import { IconCheck, IconRemove } from "../shared/Icon";


function Invite({ invite, onAccept, onDecline }) {
    const handleAccept = () => onAccept({ id: invite._id });
    const handleDecline = () => onDecline({ id: invite._id });
    return <List.Item>
        <List.Content>
            <List.Header>{invite.group.name}</List.Header>
            <ListDescription>{invite.from.firstname}</ListDescription>
        </List.Content>
        <List.Content>
            <IconCheck onClick={handleAccept} />
            <IconRemove onClick={handleDecline} />
        </List.Content>
    </List.Item>
}

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
    const [invites, revalidate] = useInvites();
    const [state, handlers, actions] = useInviteActions(revalidate);
    const { onClick } = handlers;

    return <div>
        {(invites && invites.length > 0) && <p>Du har en invititation liggende. Godkend invitationen for at komme i gang og planlægge madplanen for næste uge.</p>}
        <GroupInvites invites={invites}
        onAccept={onClick(actions.accept)}
        onDecline={onClick(actions.decline)} />
    </div>
}