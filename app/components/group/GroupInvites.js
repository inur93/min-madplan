import { List, ListDescription, Icon } from "semantic-ui-react";
import './group-invites.scss';
import { useInvites } from "../../hooks/useInvites";
import useInviteActions from "../../hooks/useInviteActions";


function Invite({ invite, onAccept, onDecline }) {
    const handleAccept = () => onAccept({ id: invite._id });
    const handleDecline = () => onDecline({ id: invite._id });
    return <List.Item className='invite-list-item'>
        <List.Content className='invite-headers'>
            <List.Header>{invite.group.name}</List.Header>
            <ListDescription as='a'>{invite.from.firstname}</ListDescription>
        </List.Content>
        <List.Content className='invite-actions'>
            <Icon name='check circle outline' color='green' onClick={handleAccept} />
            <Icon name='remove circle' color='red' onClick={handleDecline} />
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

    return <GroupInvites invites={invites}
        onAccept={onClick(actions.accept)}
        onDecline={onClick(actions.decline)} />
}