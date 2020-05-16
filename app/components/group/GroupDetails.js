
import { Loader } from "../shared/Loader";
import { ScrollView } from "../shared/ScrollView";
import FlipMove from 'react-flip-move';
import { List, Label, Button } from "semantic-ui-react";
import { useGroups } from "../../hooks/groups/useGroups";
import { forwardRef } from "react";
import { Page } from "../shared/Page";
import { useGroupDetails } from "../../hooks/groups/useGroupDetails";
import { IconRemove } from "../shared/Icon";

const Member = forwardRef(({ user}, ref) => {

    return <List.Item>
        <List.Content>
            <List.Header>
                {user.firstname} {user.lastname || ''}
            </List.Header>
            <List.Description>
                {user.email}
            </List.Description>
        </List.Content>
        <List.Content>
            <IconRemove />
        </List.Content>
    </List.Item>
})

export function GroupDetails() {
    const [state, handlers] = useGroupDetails();
    return <Loader loading={state.loading}>
        <Page>
            <ScrollView>
                <h2>{state.group && state.group.name}</h2>
                <p>Administrer gruppe og medlemmer her. Kun ejeren af gruppen kan slette medlemmer.</p>
                <h3>Medlemmer</h3>
                <List>
                    <FlipMove>
                        {state.group && state.group.users.map(user => <Member key={user._id} user={user} />)}
                    </FlipMove>
                </List>
                <Button color='red' type='submit' onClick={handlers.leaveGroup}>Leave group</Button>
            </ScrollView>
        </Page>
    </Loader>
}