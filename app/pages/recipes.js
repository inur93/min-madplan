import { useRouter } from 'next/router';
import Layout, { Actions, Content } from '../components/layout/Layout';
import { PlanDate } from '../components/recipe/PlanDate';
import { RecipeDetails } from '../components/recipe/RecipeDetails';
import { RecipeSearch } from '../components/recipe/RecipeSearch';
import { ButtonAction, ButtonSuccess } from '../components/shared/Button';
import { usePlanDetails } from '../hooks/plan/usePlanDetails';
import { useView } from '../hooks/useView';

const Page = () => {
    const [show] = useView('/recipes');
    const router = useRouter();
    const [planState, planHandlers] = usePlanDetails('plan');

    const selectPlan = () => {
        planHandlers.updatePlanDay({
            id: router.query.plan,
            date: router.query.date,
            recipe: router.query.id
        })
    }

    const toHash = (hash) => () => {
        router.replace({
            pathname: router.pathname,
            query: router.query,
            hash
        })
    }
    return (
        <Layout title={'Opskrifter'}>
            <PlanDate />
            <Content>
                {show.search && <RecipeSearch />}
                {show.details && <RecipeDetails />}
            </Content>
            <Actions>
                {show.details && <ButtonAction icon='info' onClick={toHash('stats')} />}
                {show.details && <ButtonAction icon='clipboard list' onClick={toHash('ingredients')} />}
                {show.details && <ButtonAction icon='numbered list' onClick={toHash('instructions')} />}
                {show.details && !planState.notFound && <ButtonSuccess onClick={selectPlan} />}
            </Actions>
        </Layout>
    )
}

export default Page;

/**
 *  {show.instructions && <Instructions loading={loading} recipe={selected} />}
                {show.ingredients && <Ingredients loading={loading} recipe={selected} />}
                {show.view && <RecipeDetails loading={loading} recipe={selected} />}


 */