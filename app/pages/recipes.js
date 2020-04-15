import { auth } from '../_api';
import Layout, { Actions, Content } from '../components/layout/Layout';
import { Ingredients } from '../components/recipe/Ingredients';
import { Instructions } from '../components/recipe/Instructions';
import { PlanDate } from '../components/recipe/PlanDate';
import { RecipeDetails } from '../components/recipe/RecipeDetails';
import { RecipeList, RecipeSearch } from '../components/recipe/RecipeSearch';
import { ButtonAction, ButtonSuccess } from '../components/shared/Button';
import { SearchInput } from '../components/shared/Input';
import { useRecipes } from '../hooks/useRecipes';
import { useView, views } from '../hooks/useView';
import { usePlanDetails } from '../hooks/plan/usePlanDetails';
import { useRouter } from 'next/router';

const Page = (props) => {
    const [show, edit, goTo] = useView('/recipes');
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
                {show.details && <ButtonAction icon='numbered list' onClick={toHash('instructions')}/>}
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