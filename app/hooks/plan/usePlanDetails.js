import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { splice } from "../../functions/arrayFunctions";
import { addDays, formatDateForQuery, getPlanLength } from "../../functions/dateFunctions";
import { GetPlanApi } from "../../_api";
import { useView, views } from "../shared/useView";



export function usePlanDetails(idParam = 'id') {
    const api = GetPlanApi();

    const router = useRouter();
    const [show, editMode, goTo] = useView('/plan');

    const { data: latest } = useSWR('/plan/latest', api.latest);
    const {
        data: plan,
        isValidating: planLoading
    } = useSWR(
        router.query[idParam] ? ['/plan', router.query[idParam]] : null,
        (url, id) => api.findOne(id)
    );
    const [planDays, setPlanDays] = useState([]);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (!router.query[idParam] && !router.query.view && latest) {
            goTo.details(latest._id);
        }
    }, [router.query[idParam], router.query.view, latest]);

    useEffect(() => {
        if (!plan) return;
        const _plan = plan;
        const { length, durationType } = _plan;
        let days = new Array(getPlanLength(length, durationType)).fill(null);
        const baseDate = new Date(_plan.validFrom);
        const planDays = days.map((val, i) => {
            const day = addDays(baseDate, i);
            const date = formatDateForQuery(day);
            const item = _plan.plan.find(p => {
                return (p && p.date) === date;
            }) || {};
            return {
                ...item,
                date
            }
        })
        setPlanDays(planDays);
    }, [plan])

    const updatePlanDays = async (list) => {
        const key = ['/plan', plan._id];

        const content = list.map(e => ({ ...e, shopping_list: null, owner: null, items: [] }));
        //we want to mutate cache with all data
        plan.plan = content;
        mutate(key, plan, false);
        //the api is only updated with changed values
        mutate(key, api.update(plan._id, { plan: list }));

    }

    const state = {
        notFound: !router.query[idParam],
        plan: plan || latest,
        loading: !plan || creating || !planDays.length,
        planDays,
        shoppingList: plan && plan.shopping_list
    }

    const handlers = {
        editPlanDay: ({ id, date }) => {
            router.push({
                pathname: '/recipes',
                query: {
                    view: views.search,
                    plan: id,
                    date
                }
            })
        },
        removePlanDay: ({ date }) => updatePlanDays(splice(plan.plan, x => x.date === date)),
        infoPlanDay: ({ id, date, recipe }) => {
            router.push({
                pathname: '/recipes',
                query: {
                    view: views.details,
                    id: recipe,
                    plan: id,
                    date: date
                }
            });
        },
        updatePlanDay: ({ id, date, recipe }) => {
            updatePlanDays([...plan.plan.filter(x => x.date != date), { date, recipe: recipe }]);
            goTo.details(id);
        },
        createShoppingList: async () => {
            setCreating(true);
            const { _id } = await api.createShoppingList(plan._id);
            router.push({
                pathname: '/shopping-list',
                query: {
                    view: views.details,
                    id: _id
                }
            })
            setCreating(false);
        },
        openShoppingList: () => {
            router.push({
                pathname: '/shopping-list',
                query: {
                    view: views.details,
                    id: plan.shopping_list
                }
            })
        },

    }


    return [state, handlers]
}