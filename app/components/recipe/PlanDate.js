import { Icon, Message } from 'semantic-ui-react';
import { formatDay } from '../../functions/dateFunctions';
import { usePlanDay } from '../../hooks/plan/usePlanDay';


export function PlanDate() {
    const [state] = usePlanDay('plan', 'date');

    if (state.hide) return null;
    const { recipe, date } = state.planDay || {};
    return <Message info icon>
        {state.loading && <Icon name='circle notch' loading />}
        <Message.Content>
            <Message.Header>{formatDay(new Date(date || 0))}</Message.Header>
            {recipe ? recipe.title : 'Vælg en opskrift...'}
        </Message.Content>
    </Message>
}