import { List } from "semantic-ui-react";
import { formatDate } from '../../functions/dateFunctions';
export function PlanHistoryList({ list, onClick }) {
    const handleClick = (id) => () => onClick({id});
    return (<List>
        {list.map(({ _id, name, validFrom }) => {            
            return <List.Item key={_id} onClick={handleClick(_id)}>
                <List.Content>
                    <List.Header as='h2'>{name}</List.Header>
                    <List.Description as='a'>{formatDate(new Date(validFrom))}</List.Description>
                </List.Content>
            </List.Item>
        })}
    </List>)
}