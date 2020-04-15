import { GetPlanApi } from "../../_api";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import { useView, views } from "../useView";
import { getPlanLength, addDays, formatDateForQuery } from "../../functions/dateFunctions";
import { splice } from "../../functions/arrayFunctions";



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
        const { length, durationType } = plan;
        let days = new Array(getPlanLength(length, durationType)).fill(null);
        const baseDate = new Date(plan.validFrom);

        setPlanDays(days.map((val, i) => {
            const day = addDays(baseDate, i);
            const date = formatDateForQuery(day);
            const item = plan.plan.find(p => p.date === date) || {};
            return {
                ...item,
                date
            }
        }));
    }, [plan])

    const updatePlanDays = async (list) => {
        const data = {
            plan: list
        }
        const key = ['/plan', plan._id];
        mutate(key, {...plan, plan: list}, false);
        mutate(key, api.update(plan._id, data));
    }

    const state = {
        notFound: !router.query[idParam],
        plan: plan || latest,
        loading: !plan || creating,
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
        removePlanDay: ({ date }) => {
            updatePlanDays(splice(plan.plan, x => x.date === date))
        },
        infoPlanDay: ({ id, date, recipe }) => {
            router.push({
                pathname: '/recipes',
                query: {
                    view: views.history,
                    id: recipe,
                    plan: id,
                    date: formatDateForQuery(date)
                }
            });
        },
        updatePlanDay: ({ id, date, recipe }) => {
            updatePlanDays([...plan.plan.filter(x => x.date != date), { date, recipe }]);
            goTo.details(id);
        },
        createShoppingList: async () => {
            setCreating(true);
            const {_id} = await api.createShoppingList(plan._id);
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
                    id: plan.shopping_list._id
                }
            })
        },

    }


    return [state, handlers]
}