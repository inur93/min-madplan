import { List, Icon } from "semantic-ui-react";
import { getPlanLength, addDays, formatDateForQuery, formatDay } from '../../functions/dateFunctions';
import './plan-overview.scss';

const ListItem = function ({ date, recipe, onClick, onEdit, onRemove, onInfo }) {
    const isEmpty = !recipe;
    const handleInfo = () => onInfo({ recipe: recipe._id, date });
    // const handleEdit = () => onEdit({ date });
    const handleRemove = () => onRemove({ date });
    return (<List.Item className="mmp-plan-list-item">
        <List.Header as="a">{formatDay(date)}</List.Header>
        <List.Content>
            <List.Header onClick={onClick} className={isEmpty ? 'mmp-empty' : ''} as="h2" >
                {isEmpty ?
                    "Tilføj en opskrift..."
                    : recipe.title
                }
            </List.Header>
            <Icon name='edit' onClick={onClick} />
            {!isEmpty && <Icon name='info circle' onClick={handleInfo} />}
            {!isEmpty && <Icon name='remove' onClick={handleRemove} />}
        </List.Content>
    </List.Item>)
}

export function PlanView({ plan, onClick, onRemove, onEdit, onInfo }) {

    const { _id, validFrom, length, durationType } = plan;
    if (!validFrom) return <p>empty...</p>;
    let days = new Array(getPlanLength(length, durationType)).fill(null);
    let baseDate = new Date(validFrom);
    const handleClick = (date) => () => onClick({ id: _id, date });
    return (<List>
        {days.map((val, i) => {
            const date = addDays(baseDate, i);
            const queryDate = formatDateForQuery(date);
            const entry = plan.plan.find(p => p.date === queryDate);
            return <ListItem key={date}
                onClick={handleClick(queryDate)}
                onEdit={onEdit}
                onRemove={onRemove}
                onInfo={onInfo}
                recipe={entry && entry.recipe}
                date={date} />
        })}
    </List>)
}