import { List } from '../shared/List';
import { formatDate } from '../../functions/dateFunctions'
import { List as ListSUI } from 'semantic-ui-react';

const ShoppinglistListItem = function ({ item, onClick }) {
    const format = "d. MMM";
    const validFrom = new Date(item.validFrom);
    const description = `${formatDate(validFrom, format)}`;
    const handleClick = () => onClick({ id: item.id });
    return <ListSUI.Item onClick={handleClick}>
        <ListSUI.Content>
            <ListSUI.Header as='h2'>{item.name}</ListSUI.Header>
            <ListSUI as='a'>{description}</ListSUI>
        </ListSUI.Content>
    </ListSUI.Item>
}

export function ShoppingListOverview({ lists, onClick }) {
    return (<List>
        {lists.map(list => <ShoppinglistListItem key={list.id}
            item={list}
            onClick={onClick} />)}
    </List>)
}