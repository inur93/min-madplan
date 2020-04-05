import { GetRecipesApi, GetPlanApi } from "../pages/api";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { routeUpdate } from "../functions/routerFunctions";

const actions = {
    select: 'select',
    showDetails: 'showDetails',
    showInstructions: 'showInstructions',
    showIngredients: 'showIngredients',

}

const views = {
    view: 'view',
    search: 'search',
    instructions: 'instructions',
    ingredients: 'ingredients'
}
export function useRecipes(defaultState) {
    //api's
    const api = GetRecipesApi();
    const planApi = GetPlanApi();

    //hooks
    const router = useRouter();
    //loading
    const [isLoadingRecipes, setLoadingRecipes] = useState(false);
    const [isLoadingPlan, setLoadingPlan] = useState(false);
    const [isLoadingSelected, setLoadingSelected] = useState(false);

    //data
    const [title, setTitle] = useState("");
    const [visibility, setVisibility] = useState(getVisibility(defaultState.view));
    const [recipes, setRecipes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [plan, setPlan] = useState(null);

    //handle search
    useEffect(() => {
        const updateRecipes = async () => {
            setLoadingRecipes(true);
            setRecipes(await api.find(router.query.query));
            setLoadingRecipes(false);
        };
        updateRecipes();
    }, [router.query.query]);

    useEffect(() => {
        const id = router.query.id;
        const load = async () => {
            if (id) {
                setLoadingSelected(true);
                const result = await api.findOne(id);
                setSelected(result);
                setLoadingSelected(false);
            }
        }
        load();
    }, [router.query.id])

    //handle plan day
    useEffect(() => {
        const { date, plan } = router.query;
        const loadPlan = async () => {
            setLoadingPlan(true);
            console.log('what???', planApi);
            const result = await planApi.findOne(plan);
            setPlan(result);
            setLoadingPlan(false);
        }
        if (plan && date) loadPlan();
    }, [router.query.plan, router.query.date]);

    useEffect(() => {
        const { view } = router.query;
        setVisibility(getVisibility(view || views.search, plan));
    }, [router.query.view, plan]);

    //handles actions
    const onClick = (action) => async (data) => {
        switch (action) {
            case actions.select:
                if (plan) {
                    // id can be implicit in query.
                    const id = data.id || router.query.id;
                    await planApi.update(plan._id, {
                        plan: getUpdatedPlan(plan, router.query.date, id)
                    });
                    router.push(`/plan?id=${plan._id}`);
                } else {
                    routeUpdate(router, { id })
                }
                break;
            case actions.showDetails:
                router.push({
                    pathname: '/recipes',
                    query: {
                        ...router.query,
                        view: views.view,
                        id: data.id || router.query.id
                    }
                });
                break;
            case actions.showIngredients:
                routeUpdate(router, { view: views.ingredients });
                break;
            case actions.showInstructions:
                routeUpdate(router, { view: views.instructions });
                break;
            default:
                console.error('unknown action', { action });
                break;
        }
    }

    const state = {
        loading: (isLoadingPlan || isLoadingRecipes),
        query: router.query.query,
        date: router.query.date,
        selected,
        plan: plan || [],
        recipes,
        title,
        visibility
    }

    const setQuery = (query) => {
        routeUpdate(router, { query });
    }
    const handlers = {
        onClick,
        setQuery
    }
    return [state, handlers, actions];
}

const getUpdatedPlan = (plan, date, recipeId) => {
    const list = plan.plan || [];
    //check if day already exists
    let selected = list.find(x => x.date === date);
    //if not create new object
    if (!selected) {
        selected = { date }
    } else {
        //else remove the selected before adding again below
        list.splice(list.indexOf(selected), 1);
    }
    //
    selected.recipe = recipeId;
    list.push(selected);
    return list;
}

const getVisibility = (view, plan) => {
    const showView = {
        [views.search]: false,
        [views.view]: false,
        [views.instructions]: false,
        [views.ingredients]: false,
        showPlanDay: false
    }

    showView[view] = true;

    if (plan) {
        showView.showPlanDay = true;
    }

    return showView;
}