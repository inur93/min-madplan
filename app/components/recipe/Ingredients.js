import { List, ListHeader } from "semantic-ui-react";


const ListItem = ({ ingredient }) => {
    const { amount, unit, name } = ingredient;
    let fullname = amount ? `${amount} ${unit || ''} ${name}`
        : name;
    return <List.Item>
        <List.Content>
            <ListHeader>{fullname}</ListHeader>
        </List.Content>
    </List.Item>
}

export function Ingredients({ loading, recipe }) {

    return <List>
        {recipe.ingredients.map(
            i => <ListItem key={i._id} ingredient={i} />
        )}
    </List>
}