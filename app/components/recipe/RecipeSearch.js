import { useRouter } from 'next/router';
import FlipMove from 'react-flip-move';
import { Button, List } from 'semantic-ui-react';
import { usePlanDay } from '../../hooks/plan/usePlanDay';
import { usePlanDetails } from '../../hooks/plan/usePlanDetails';
import { useRecipeSearch } from '../../hooks/recipe/useRecipeSearch';
import { useView } from '../../hooks/useView';
import { IconCheck, IconInfo } from '../shared/Icon';
import { SearchInput } from '../shared/Input';
import { Loader } from '../shared/Loader';
import { forwardRef } from 'react';

const RecipeListItem = forwardRef(({ recipe }, ref) => {
    const { _id, title } = recipe;
    const [state] = usePlanDay('plan', 'date');
    const router = useRouter();
    const [, planHandlers] = usePlanDetails('plan');
    const [, , goTo] = useView('/recipes');

    const onCheck = () => planHandlers.updatePlanDay({
        id: router.query.plan,
        date: state.planDay.date,
        recipe: recipe
    })
    const showInfo = () => goTo.details(_id, true);
    const onSelect = () => state.hide ? showInfo() : onCheck()
    return (<List.Item ref={ref} >
        <List.Content>
            <List.Header onClick={onSelect}>{title}</List.Header>
        </List.Content>
        <List.Content>
            {!state.hide && <IconInfo onClick={showInfo} />}
            {!state.hide && <IconCheck onClick={onCheck} />}
        </List.Content>
    </List.Item>)
});

export function RecipeSearch() {
    const [state, handlers] = useRecipeSearch();
    return (<div>
        <SearchInput loading={state.loading} placeholder="Søg efter opskrift..." />
        <p>{state.results.length} ud af {state.count}</p>
        <Loader loading={state.loading}>
            <List className='recipe-list' selection verticalAlign='middle'>
                <FlipMove>
                    {state.results.map(r => <RecipeListItem key={r._id} recipe={r} />)}
                </FlipMove>
            </List>
            <Button disabled={state.isLoadingMore || state.isReachingEnd}
                loading={state.isLoadingMore}
                fluid
                onClick={handlers.loadMore}>
                {state.isReachingEnd ? 'der er ikke flere resultater' : 'indlæs flere'}
            </Button>
        </Loader>
    </div>)
}