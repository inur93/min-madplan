import './recipe-list.scss';
import { Message, Icon, List as ListSUI } from 'semantic-ui-react';
import { List } from '../shared/List';

function RecipeListItem({ id, title, onClick, onShowDetails }) {
    const onSelect = () => onClick({id});
    const showDetails = () => onShowDetails({id});
    return (<ListSUI.Item className='recipe-list-item'>
        <ListSUI.Content>
            <ListSUI.Header onClick={onSelect}>{title}</ListSUI.Header>
            <Icon name='ordered list' onClick={showDetails} />
            <Icon name='check circle outline' onClick={onSelect} />
        </ListSUI.Content>
    </ListSUI.Item>)
}

export function RecipeList({ recipes, onClick, onShowDetails }) {

    return (<List className='recipe-list' selection verticalAlign='middle'>
        {recipes.map(recipe => <RecipeListItem key={recipe._id}
            id={recipe._id}
            title={recipe.title}
            onClick={onClick}
            onShowDetails={onShowDetails} />)}
    </List>)
}