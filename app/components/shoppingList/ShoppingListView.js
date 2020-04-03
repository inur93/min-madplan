import { List } from "semantic-ui-react";


function ListElement({}){

    return <List.Item>
        <List.Content>
            <List.Header>

            </List.Header>
        </List.Content>
    </List.Item>
}

export function ShoppingListView({list, onClick}){

    return (<List>
        {list && list.name}
        </List>)
}