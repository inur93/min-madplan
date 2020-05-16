import { List, ListDescription } from "semantic-ui-react";
import { IconCheck, IconRemove } from "../shared/Icon";

export function Invite({ invite, onAccept, onDecline }) {
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