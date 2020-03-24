import { useRouter } from 'next/router';
import Layout, { Actions, Content } from '../components/layout/Layout';
import { GetRecipesApi } from './api/recipeApi';
import { useState, useEffect } from 'react';
import { RecipeListItem, List } from '../components/shared/List';
import { SearchInput } from '../components/shared/Input';
import { GetPlanApi } from './api/planApi';
import { Message } from 'semantic-ui-react';
import { formatDay } from '../stores/dateStore';

function RenderPlanDate({ validFrom, plan }, date) {
    const selected = plan.find(x => x.date === date);
    return <Message info
        header={formatDay(new Date(date))}
        content={selected ? selected.recipe.title : 'Vælg en opskrift...'} />
}

const Page = () => {
    const api = GetRecipesApi();
    const planApi = GetPlanApi();
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [query, setQuery] = useState("");
    const [plan, setPlan] = useState(null);

    const planId = router.query.plan;
    const planDate = router.query.date;

    const updateRecipes = (query) => {
        api.find(query).then(({ data }) => setRecipes(data));
    }

    useEffect(() => {
        updateRecipes();
        const loadPlan = async (planId) => {
            const result = await planApi.findOne(planId);
            setPlan(result);
        }
        if (planId && planDate) loadPlan(planId);
    }, []);

    const search = (query) => {
        setQuery(query);
        updateRecipes(query);
    }

    const selectRecipe = async (id) => {
        if (plan) {
            const list = plan.plan || [];
            let selected = (list).find(x => x.date === planDate);
            if (!selected) {
                selected = { date: planDate }
            } else {
                list.splice(list.indexOf(selected), 1);
            }
            selected.recipe = id;
            list.push(selected);

            await planApi.update(plan._id, {
                plan: list
            });
            router.push(`/plan?id=${plan._id}`);
        } else {
            router.push(`/recipes/${id}`);
        }
    }

    return (
        <Layout title="Opskrifter">
            <Content>
                {plan && RenderPlanDate(plan, router.query.date)}
                <List selection verticalAlign='middle'>
                    {recipes.map(recipe => <RecipeListItem key={recipe._id}
                        id={recipe._id}
                        title={recipe.title}
                        onClick={selectRecipe} />)}
                </List>
            </Content>
            <Actions>
                <SearchInput value={query} onChange={search} placeholder="Søg efter opskrift..." />
            </Actions>
        </Layout>
    )
}

export default Page;