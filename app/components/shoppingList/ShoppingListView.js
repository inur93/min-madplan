import { List, Checkbox, Icon, Loader } from "semantic-ui-react";
import './shopping-list-view.scss';
import { useState } from "react";

function ListElement({ editMode, item, onCheck, onEdit }) {
    const { checked, name, unit, amount } = item;
    const [loading, setLoading] = useState(false);
    const onClick = async () => {
        setLoading(true);
        await onCheck({ ...item, checked: !checked });
        setLoading(false);
    }
    const handleEdit = () => {
        if (!editMode) return;
        onEdit({ id: item._id });
    }
    let fullname = amount ? `${amount} ${unit || ''} ${name}`
        : name;

    return <List.Item className='shopping-list-view-item'>
        <List.Content>
            {!editMode && <Checkbox disabled={loading} checked={checked} onChange={onClick} />}
            <List.Header onClick={handleEdit}>
                {fullname}
            </List.Header>
            <Loader active={loading} inline size='mini' />
            {editMode && <Icon name='remove' />}
        </List.Content>
    </List.Item >
}

export function ShoppingListView({ editMode, list, onClick, onEdit }) {

    const onCheck = async (item) => {
        const index = list.items.indexOf(list.items.find(x => x._id === item._id));
        list.items.splice(index, 1, item);
        await onClick({ items: list.items });
        return true;
    }
    if (!list || !list.items || list.items.length <= 0) {
        return <p>Der er endnu ikke noget på din indkøbs liste</p>
    }
    const items = list.items.sort((x, y) => {
        if (x.checked) return 1;
        if (y.checked) return -1;

        if (x.name < y.name) {
            return -1;
        } else if (x.name > y.name) {
            return 1;
        }
        return 0;
    });
    return (<List>
        {items.map(item => <ListElement key={item._id}
            editMode={editMode}
            onCheck={onCheck}
            onEdit={onEdit}
            item={item} />)}
    </List>)
}