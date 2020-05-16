import { Loader } from "../shared/Loader";
import { ScrollView } from "../shared/ScrollView";
import FlipMove from 'react-flip-move';
import { List, Label } from "semantic-ui-react";
import { useGroups } from "../../hooks/groups/useGroups";
import { forwardRef } from "react";
import { Page } from "../shared/Page";
import { useRouter } from "next/router";
const ListElement = forwardRef(({ group }, ref) => {
    const router = useRouter();
    const onClick = () => router.push(`/groups?view=details&id=${group._id}`);
    return <List.Item ref={ref} onClick={onClick}>
        <List.Content>
            <List.Header>
                {group.name}
            </List.Header>
        </List.Content>
        <List.Content>
            <Label color='blue'>{group.users.length}</Label>
        </List.Content>
    </List.Item>
});

export function GroupsOverview({ }) {
    const [state, handlers] = useGroups();

    return <Loader loading={state.loading}>
        <Page>
            <ScrollView>
                <h2>Dine grupper</h2>
                <List>
                    <FlipMove id="groups-overview">
                        {state.groups.map(x => <ListElement key={x._id} group={x} />)}
                    </FlipMove>
                </List>
            </ScrollView>
        </Page>
    </Loader>
}