import './recipe-list.scss';
import { Message, Icon, List } from 'semantic-ui-react';
import { IconInfoCircle, IconInfo, IconCheck } from '../shared/Icon';

function RecipeListItem({ id, title, onClick, onShowDetails, showActions }) {
    const onSelect = () => onClick({ id });
    const showDetails = () => onShowDetails({ id });
    return (<List.Item className='recipe-list-item'>
        <List.Content>
            <List.Header onClick={onSelect}>{title}</List.Header>
        </List.Content>
        <List.Content>
            {showActions && <IconInfo onClick={showDetails} />}
            {showActions && <IconCheck onClick={onSelect} />}
        </List.Content>
    </List.Item>)
}

export function RecipeList({ recipes, onClick, onShowDetails, showActions }) {

    return (<List className='recipe-list' selection verticalAlign='middle'>
        {recipes.map(recipe => <RecipeListItem key={recipe._id}
            id={recipe._id}
            title={recipe.title}
            onClick={onClick}
            showActions={showActions}
            onShowDetails={onShowDetails} />)}
    </List>)
}