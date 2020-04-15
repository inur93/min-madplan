import { useRouter } from "next/router";
import { GetRecipesApi, GetPlanApi } from "../../_api";
import useSWR, { useSWRPages } from "swr";
import { List } from "semantic-ui-react";
import { IconInfo, IconCheck } from "../../components/shared/Icon";
import { useView } from "../useView";
import { usePlanDetails } from "../plan/usePlanDetails";
import { usePlanDay } from "../plan/usePlanDay";
import { useEffect, useState } from "react";

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

export function useRecipeSearch(pageSize) {
    //api's
    const api = GetRecipesApi();
    const planApi = GetPlanApi();

    const router = useRouter();

    const { data: count } = useSWR(['/recipes/count', router.query.query], (url, q) => api.count(q));
    const [results, setResults] = useState([]);
    const [q, setQ] = useState(null);

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadResults = async (start, num, query, reset) => {
        setIsLoadingMore(true);
        const data = await api.find(query, start, num);
        setResults(reset ? [...data] : [...results, ...data]);
        setIsLoadingMore(false);
    }

    const loadMore = () => {
        loadResults(results.length, 10, router.query.query);
    }

    useEffect(() => {
        loadResults(0, 10, router.query.query);
    }, []);

    useEffect(() => {
        loadResults(0, 10, router.query.query, true);
    }, [router.query.query])


    const state = {
        results: results || [],
        loading: false,
        count,
        isLoadingMore,
        isReachingEnd: (results || []).length >= count,

    }
    const handlers = {
        loadMore
    }
    return [state, handlers]
}