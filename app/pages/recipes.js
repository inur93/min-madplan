import Layout, { Actions, Content } from '../components/layout/Layout';
import { SearchInput } from '../components/shared/Input';
import { useRecipes } from '../hooks/useRecipes';
import { auth } from './api';
import { PlanDate } from '../components/recipe/PlanDate';
import { RecipeList } from '../components/recipe/RecipeList';
import { Instructions } from '../components/recipe/Instructions';
import { Button, ButtonSuccess, ButtonAction } from '../components/shared/Button';
import { Ingredients } from '../components/recipe/Ingredients';
import { RecipeDetails } from '../components/recipe/RecipeDetails';

const Page = (props) => {

    const [state, handlers, actions] = useRecipes(props);


    const { loading, query, date, plan, recipes, selected, show, showSelect } = state;
    const { setQuery, onClick } = handlers;

    return (
        <Layout loading={loading} title="Opskrifter">
            {show.planDay && <PlanDate loading={loading} plan={plan.plan} date={date} />}
            {show.search && <SearchInput defaultValue={query} onChange={setQuery} placeholder="Søg efter opskrift..." />}
            <Content>
                {show.instructions && <Instructions loading={loading} recipe={selected} />}
                {show.ingredients && <Ingredients loading={loading} recipe={selected} />}
                {show.view && <RecipeDetails loading={loading} recipe={selected} />}
                {show.search && <RecipeList recipes={recipes}
                    showActions={show.planDay}
                    onClick={onClick(actions.select)}
                    onShowDetails={onClick(actions.showDetails)} />}
            </Content>
            <Actions>
                {!show.search && <ButtonAction view='view' icon='info' onClick={onClick(actions.showDetails)} />}
                {!show.search && <ButtonAction view='ingredients'  icon='clipboard list' onClick={onClick(actions.showIngredients)} />}
                {!show.search && <ButtonAction view='instructions' icon='numbered list' onClick={onClick(actions.showInstructions)} />}
                {(showSelect) && <ButtonSuccess onClick={onClick(actions.select)} />}
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