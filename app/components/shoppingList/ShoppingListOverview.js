import { formatDate } from '../../functions/dateFunctions'
import { List } from 'semantic-ui-react';

const ShoppinglistListItem = function ({ item, onClick }) {
    const format = "d. MMM";
    const validFrom = new Date(item.validFrom);
    const description = `${formatDate(validFrom, format)}`;
    const handleClick = () => onClick({ id: item.id });
    return <List.Item onClick={handleClick}>
        <List.Content>
            <List.Header as='h2'>{item.name}</List.Header>
            <List.Description >{description}</List.Description>
        </List.Content>
    </List.Item>
}

export function ShoppingListOverview({ lists, onClick }) {
    return (<List>
        {lists.map(list => <ShoppinglistListItem key={list.id}
            item={list}
            onClick={onClick} />)}
    </List>)
}