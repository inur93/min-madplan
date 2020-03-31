import { List as ListSUI, Icon as IconSUI, Image, Checkbox } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import './list.scss';

export const List = function ({ children, ...otherProps }) {
    return (
        <ListSUI divided relaxed {...otherProps}>
            {children}
        </ListSUI>
    )
}
export const ListItemDelete = function ({ title, onDelete }) {
    return (<ListSUI.Item className="mmp-list-item-delete">
        <ListSUI.Content>
            <ListSUI.Header as="p">{title}</ListSUI.Header>
        </ListSUI.Content>
        <ListSUI.Icon name='delete' onClick={onDelete} verticalAlign='middle' />
    </ListSUI.Item>);
}
export const ListItem = function ({ icon, title, description, link, ...otherProps }) {
    const router = useRouter();
    const handleClick = () => router.push(link);
    return (
        <ListSUI.Item onClick={handleClick}>
            {icon && <ListSUI.Icon name={icon} size='large' verticalAlign='middle' />}
            <ListSUI.Content>
                <ListSUI.Header as='h2'>{title}</ListSUI.Header>
                {description && <ListSUI as='a'>{description}</ListSUI>}
            </ListSUI.Content>
        </ListSUI.Item>
    )
}

export const ShoppingListItem = function ({ id, checked, name, unit, amount, onClick, removable }) {

    const action = (type) => () => onClick(type, id);
    const showUnit = !!amount;
    const showAmount = !!amount;
    return (
        <ListSUI.Item className="shopping-list-item">
            <ListSUI.Content>
                <Checkbox value={!!checked} onClick={action('check')} />
                <ListSUI.Header onClick={action('edit')} className="shopping-list-item-header" as='h3'>
                    <span className="shopping-list-item-amount">
                        {showAmount ? amount : ''}
                        {showUnit ? ' ' : ''}
                        {showUnit ? unit : ''}
                    </span>
                    {name}
                </ListSUI.Header>
                {removable && <IconSUI onClick={action('delete')} name='remove' size='large' />}
            </ListSUI.Content>
        </ListSUI.Item>
    )
}
