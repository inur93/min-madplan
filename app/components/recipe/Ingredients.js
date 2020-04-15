import { List, ListHeader, Loader } from "semantic-ui-react";


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

    if (loading) return <Loader />;
    return <div id='ingredients'>
        <h2>Dette skal du bruge</h2>
        <List >
            {recipe.ingredients.map(
                i => <ListItem key={i._id} ingredient={i} />
            )}
        </List>
    </div>
}