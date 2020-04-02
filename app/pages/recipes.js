import Layout, { Actions, Content } from '../components/layout/Layout';
import { SearchInput } from '../components/shared/Input';
import { useRecipes } from '../hooks/useRecipes';
import { auth } from './api';
import { PlanDate } from '../components/recipe/PlanDate';
import { RecipeList } from '../components/recipe/RecipeList';
import { Instructions } from '../components/recipe/Instructions';
import { Button, ButtonSuccess } from '../components/shared/Button';
import { Ingredients } from '../components/recipe/Ingredients';
import { RecipeDetails } from '../components/recipe/RecipeDetails';

const Page = (props) => {

    const [state, handlers, actions] = useRecipes(props);


    const { loading, query, date, plan, recipes, selected, visibility } = state;
    const { setQuery, onClick } = handlers;

    return (
        <Layout title="Opskrifter">
            {visibility.showPlanDay && <PlanDate loading={loading} plan={plan.plan} date={date} />}
            <Content>
                {visibility.instructions && <Instructions loading={loading} recipe={selected} />}
                {visibility.ingredients && <Ingredients loading={loading} recipe={selected} />}
                {visibility.view && <RecipeDetails loading={loading} recipe={selected} />}
                {visibility.search && <RecipeList recipes={recipes}
                    onClick={onClick(actions.select)}
                    onShowDetails={onClick(actions.showDetails)} />}
            </Content>
            <Actions>
                {visibility.search && <SearchInput value={query} onChange={setQuery} placeholder="Søg efter opskrift..." />}
                {!visibility.search && <Button icon='info' onClick={onClick(actions.showDetails)} />}
                {!visibility.search && <Button icon='clipboard list' onClick={onClick(actions.showIngredients)} />}
                {!visibility.search && <Button icon='numbered list' onClick={onClick(actions.showInstructions)} />}
                {(!visibility.search && plan) && <ButtonSuccess onClick={onClick(actions.select)} />}
            </Actions>
        </Layout>
    )
}
Page.getInitialProps = async (ctx) => {
    const { id, view, plan, date, firstTime, query } = ctx.query;
    auth(ctx);

    return {
        id,
        view,
        firstTime: !!firstTime,
        plan,
        date,
        query
    }
}
export default Page;