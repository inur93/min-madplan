import { List, Button } from 'semantic-ui-react';
import { IconCheck, IconInfo } from '../shared/Icon';
import { useRecipeSearch } from '../../hooks/recipe/useRecipeSearch';
import { Loader } from '../shared/Loader';
import { SearchInput } from '../shared/Input';
import { useView } from '../../hooks/useView';
import { usePlanDay } from '../../hooks/plan/usePlanDay';
import { PlanDate } from './PlanDate';
import { useRouter } from 'next/router';
import { usePlanDetails } from '../../hooks/plan/usePlanDetails';

function RecipeListItem({ recipe }) {
    const { _id, title } = recipe;
    const [state] = usePlanDay('plan', 'date');
    const router = useRouter();
    const [, planHandlers] = usePlanDetails('plan');
    const [, , goTo] = useView('/recipes');

    const onCheck = () => planHandlers.updatePlanDay({
        id: router.query.plan,
        date: state.planDay.date,
        recipe: _id
    })
    const showInfo = () => goTo.details(_id, true);
    const onSelect = () => state.hide ? showInfo() : onCheck()
    return (<List.Item >
        <List.Content>
            <List.Header onClick={onSelect}>{title}</List.Header>
        </List.Content>
        <List.Content>
            {!state.hide && <IconInfo onClick={showInfo} />}
            {!state.hide && <IconCheck onClick={onCheck} />}
        </List.Content>
    </List.Item>)
}

export function RecipeSearch() {
    const [state, handlers] = useRecipeSearch();
    return (<div>
        <SearchInput loading={state.loading} placeholder="Søg efter opskrift..." />
        <p>{state.results.length} ud af {state.count}</p>
        <Loader loading={state.loading}>
            <List className='recipe-list' selection verticalAlign='middle'>
                {state.results.map(r => <RecipeListItem recipe={r} />)}
            </List>
    <Button disabled={state.isLoadingMore || state.isReachingEnd} loading={state.isLoadingMore} fluid onClick={handlers.loadMore}>{state.isReachingEnd ? 'der er ikke flere resultater' : 'indlæs flere'}</Button>
        </Loader>
    </div>)
}