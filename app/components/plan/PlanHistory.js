import { List, Icon } from "semantic-ui-react";
import { formatDate } from '../../functions/dateFunctions';
import { useView } from "../../hooks/shared/useView";
import { Loader } from "../shared/Loader";
import { usePlanHistory } from "../../hooks/plan/usePlanHistory";

const EmptyMessage = () => <p>
    Du har ikke nogen madplan for den kommende uge, 
    opret en ved at trykke på {<Icon name='calendar plus outline' />}.
    </p>

export function PlanHistory() {
    const [state, handlers] = usePlanHistory();
    const [show, edit, goTo] = useView('/plan');
    return (<Loader loading={state.loading}>
        <List>
            {!state.history.length && <EmptyMessage />}
            {state.history.map(({ _id, name, validFrom }) => {
                return <List.Item key={_id} onClick={() => goTo.details(_id)}>
                    <List.Content>
                        <List.Header as='h2'>{name}</List.Header>
                        <List.Description as='a'>{formatDate(new Date(validFrom))}</List.Description>
                    </List.Content>
                </List.Item>
            })}
        </List>
    </Loader>)
}