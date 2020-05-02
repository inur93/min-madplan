import { Icon, List } from 'semantic-ui-react';
import { formatDate } from '../../functions/dateFunctions';
import { useShoppingListHistory } from '../../hooks/shoppingList/useShoppingListHistory';
import { useView } from '../../hooks/useView';
import { Loader } from '../shared/Loader';

function MessageEmptyHistory() {
    return <p>Du har ikke noget indkøbsliste endnu.
      Opret en ved at trykke på <Icon name='add' /> nedenfor.
      Eller opret en madplan og efterfølgende opret en indkøbsliste derfra.</p>
}
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

export function ShoppingListOverview() {
    const [state] = useShoppingListHistory();
    const [show, edit, goTo] = useView('/shopping-list');
    return (
        <Loader loading={state.loading}>
            {!state.history.length && <MessageEmptyHistory />}
            <List>
                {state.history.map(list =>
                    <ShoppinglistListItem key={list._id}
                        item={list}
                        onClick={() => goTo.details(list._id)} />)}
            </List>
        </Loader>)
}