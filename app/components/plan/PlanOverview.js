import { List } from "semantic-ui-react";
import { getPlanLength, addDays, formatDateForQuery, formatDay } from '../../functions/dateFunctions';
import './plan-overview.scss';

const ListItem = function ({ date, recipe, onClick }) {
    const isEmpty = !recipe;
    return (<List.Item className="mmp-plan-list-item" onClick={onClick}>
        <List.Content>
            <List.Header as="a">{formatDay(date)}</List.Header>
            <List.Header className={isEmpty ? 'mmp-empty' : ''} as="h2" >
                {isEmpty ?
                    "Tilføj en opskrift..."
                    : recipe.title
                }
            </List.Header>
        </List.Content>
    </List.Item>)
}

export function PlanView({ plan, onClick }) {

    const { _id, validFrom, length, durationType } = plan;
    if (!validFrom) return <p>empty...</p>;
    let days = new Array(getPlanLength(length, durationType)).fill(null);
    let baseDate = new Date(validFrom);
    const handleClick = (date) => () => onClick(_id, date);
    return (<List>
        {days.map((val, i) => {
            const date = addDays(baseDate, i);
            const queryDate = formatDateForQuery(date);
            const entry = plan.plan.find(p => p.date === queryDate);
            return <ListItem key={date}
                onClick={handleClick(queryDate)}
                recipe={entry && entry.recipe}
                date={date} />
        })}
    </List>)
}