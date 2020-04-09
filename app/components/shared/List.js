import { List, Icon, Image, Checkbox } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import './list.scss';
import { IconRemove } from './Icon';

export const ListItemDelete = function ({ title, onDelete }) {
    return (<List.Item className="mmp-list-item-delete">
        <List.Content>
            <List.Header as="p">{title}</List.Header>
        </List.Content>
        <List.Icon name='delete' onClick={onDelete} verticalAlign='middle' />
    </List.Item>);
}
export const ListItem = function ({ icon, title, description, link, ...otherProps }) {
    const router = useRouter();
    const handleClick = () => router.push(link);
    return (
        <List.Item onClick={handleClick}>
            {icon && <List.Icon name={icon} size='large' verticalAlign='middle' />}
            <List.Content>
                <List.Header as='h2'>{title}</List.Header>
                {description && <List as='a'>{description}</List>}
            </List.Content>
        </List.Item>
    )
}

export const ShoppingListItem = function ({ id, checked, name, unit, amount, onClick, removable }) {

    const action = (type) => () => onClick(type, id);
    const showUnit = !!amount;
    const showAmount = !!amount;
    return (
        <List.Item className="shopping-list-item">
            <List.Content>
                <Checkbox value={!!checked} onClick={action('check')} />
                <List.Header onClick={action('edit')} className="shopping-list-item-header" as='h3'>
                    <span className="shopping-list-item-amount">
                        {showAmount ? amount : ''}
                        {showUnit ? ' ' : ''}
                        {showUnit ? unit : ''}
                    </span>
                    {name}
                </List.Header>
                {removable && <IconRemove onClick={action('delete')} size='large' />}
            </List.Content>
        </List.Item>
    )
}
