import { Message, Icon, List as ListSUI } from 'semantic-ui-react';
import { formatDay } from '../../functions/dateFunctions';


export function PlanDate({ loading, plan, date }) {
    if (loading) return null;
    const selected = plan.find(x => x.date === date);
    return <Message info
        header={formatDay(new Date(date))}
        content={selected ? selected.recipe.name : 'Vælg en opskrift...'} />
}