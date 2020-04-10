import { Message } from 'semantic-ui-react';
import { formatDay } from '../../functions/dateFunctions';


export function PlanDate({ loading, plan, date }) {
    if (loading || !plan || !date) return null;
    const selected = plan.find(x => x.date === date);
    return <Message info
        header={formatDay(new Date(date))}
        content={selected ? selected.recipe.title : 'Vælg en opskrift...'} />
}