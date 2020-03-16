import { List as ListSUI, Icon as IconSUI } from 'semantic-ui-react';
import { useRouter } from 'next/router';

export const List = function ({ children, ...otherProps }) {
    return (
        <ListSUI divided relaxed {...otherProps}>
            {children}
        </ListSUI>
    )
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

export const WeekplanListItem = function () {
    return (<ListSUI.Item>
        <ListSUI.Content>
            <ListSUI.Header as="a">Mandag</ListSUI.Header>
        </ListSUI.Content>
        <ListSUI.List>
            <ListSUI.Description >Spaghetti kødsovs</ListSUI.Description>
            <ListSUI.Description >brød</ListSUI.Description>
        </ListSUI.List>
    </ListSUI.Item>)
}

export const ShoppingListItem = function ({ id, name, unit, amount, onClick, removable }) {

    const action = (type) => () => onClick(type, id);
    return (
        <ListSUI.Item >
            <ListSUI.Content>
                <ListSUI.Header onClick={action('edit')} className="shopping-list-item-header" as='h3'>
                    <span className="shopping-list-item-amount">{amount} {unit}</span>
                    {name}
                </ListSUI.Header>
                {removable && <IconSUI onClick={action('delete')} name='remove' size='large' />}
            </ListSUI.Content>

            <style jsx>{`
                .shopping-list-item-amount{
                    margin-right: 1rem;
                }
                :global(.item .content .header.shopping-list-item-header){
                    display: inline-block;
                    width: calc(100% - 3rem);
                }
                `}</style>
        </ListSUI.Item>
    )
}