import { List, Checkbox, Icon, Loader } from "semantic-ui-react";
import './shopping-list-view.scss';
import { useState } from "react";
import { IconRemove, IconEdit } from "../shared/Icon";

function ListElement({ editMode, item, onCheck, onEdit, onRemove }) {
    const { name, unit, amount } = item;
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(item.checked);
    const onClick = async () => {
        setLoading(true);
        setChecked(!checked);
        await onCheck({ ...item, checked: !checked });
        setLoading(false);
    }
    const handleRemove = async () => {
        setLoading(true);
        await onRemove({ ...item });
        setLoading(false);
    }
    const handleEdit = () => {
        if (!editMode) {
            onClick();
        } else {
            onEdit({ id: item._id });
        }
    }
    let fullname = amount ? `${amount} ${unit || ''} ${name}`
        : name;

    return <List.Item className='shopping-list-view-item'>
        <List.Content>
            <List.Header onClick={handleEdit}>
                {fullname}
            </List.Header>
        </List.Content>
        <List.Content>
            <Loader active={loading} inline size='mini' />
            {editMode && <IconEdit onClick={handleEdit} />}
            {editMode && <IconRemove onClick={handleRemove} />}
            {!editMode && <Checkbox disabled={loading} checked={checked} onChange={onClick} />}
        </List.Content>
    </List.Item >
}

export function ShoppingListView({ editMode, list, onClick, onEdit, onRemove }) {

    const onCheck = async (item) => {
        const index = list.items.indexOf(list.items.find(x => x._id === item._id));
        list.items.splice(index, 1, item);
        await onClick({ items: list.items });
        return true;
    }
    if (!list || !list.items || list.items.length <= 0) {
        if (editMode) {
            return <p>Der er endnu ikke noget på din indkøbs liste</p>
        } else {
            return <p>Din indkøbsliste er tom, tryk på <Icon name='edit' /> for at tilføje varer til listen</p>
        }
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
            onRemove={onRemove}
            item={item} />)}
    </List>)
}