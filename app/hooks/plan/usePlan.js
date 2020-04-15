import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { GetPlanApi } from "../_api";
import { splice } from "../functions/arrayFunctions";
import { formatDateForQuery } from "../functions/dateFunctions";
import { routeUpdate } from "../functions/routerFunctions";

const actions = {
    createShoppingList: 'create-shopping-list',
    openCurrentShoppingList: 'open-current-shoppinglist',
    editPlanDay: 'edit-list-item',
    removePlanDay: 'remove-list-item',
    createPlan: 'create-plan',
    deleteCurrentPlan: 'delete-current-plan',

    showRecipeInfo: 'show-recipe-info',
    showCreate: 'view-create',
    showHistory: 'history',
    showPlan: 'navigate-plan'
}

const views = {
    create: 'create',
    view: 'view',
    edit: 'edit',
    editPlanDay: 'editPlanDay',
    history: 'history'
}

export function usePlan(defaultState) {
    //api's
    const api = GetPlanApi();
    //hooks
    const router = useRouter();

    //loading
    const [loadingCurrent, setLoadingCurrent] = useState(false);
    const [loadingShoppingList, setLoadingShoppingList] = useState(false);

    //data
    const [title, setTitle] = useState("");
    const [currentPlan, setCurrentPlan] = useState(null);
    const history = useSWR('history', () => api.find());
    const [show, setShow] = useState(getVisibility(defaultState.view));

    //props
    const [noCurrentPlan, setNoCurrentPlan] = useState(false);
    const [isFirstTime, setFirstTime] = useState(defaultState.firstTime);

    const [contextMenu, setContextMenu] = useState([]);

    useEffect(() => {
        const items = [];
        if (show.view) {
            items.push({ label: 'Slet', onClick: onClick(actions.deleteCurrentPlan) });
        }
        setContextMenu(items);
    }, [show])

    useEffect(() => {
        const loadPlan = async (id) => {
            setLoadingCurrent(true);
            const current = await (id ? api.findOne(id) : api.findCurrent());
            setCurrentPlan(current);
            setLoadingCurrent(false);
        }
        loadPlan(router.query.id);
    }, [router.query.id])

    useEffect(() => {
        const planNextWeek = (history.data || []).find(x => new Date(x.validFrom) > new Date());
        setNoCurrentPlan(!planNextWeek);
    }, [history.data]);

    useEffect(() => {
        setShow(getVisibility(router.query.view || views.view, currentPlan));
    }, [router.query.view, currentPlan]);

    const getRoute = (prefix) => {
        let route = prefix;
        if (isFirstTime) {
            route = `${route}${route.includes('?') ? '&' : '?'}firstTime=true`;
        }
        return route;
    }

    const onClick = (type) => async (data) => {
        let shoppingListId = null;
        switch (type) {
            case actions.createShoppingList:
                setLoadingShoppingList(true);
                const shoppingList = await api.createShoppingList(currentPlan._id);
                shoppingListId = shoppingList._id;
                setLoadingShoppingList(false);
            case actions.openCurrentShoppingList:
                router.push(getRoute(`/shopping-list?id=${shoppingListId // if new shopping list has been created
                    || currentPlan.shopping_list._id // if plan is fetched by id
                    || currentPlan.shopping_list // if plan object is taken from history list
                    }`));

                break;
            case actions.editPlanDay:
                {
                    const { id, date } = data;
                    router.push(getRoute(`/recipes?plan=${id}&date=${date}`));
                    break;
                }
            case actions.removePlanDay:
                setLoadingCurrent(true);
                const updated = splice(currentPlan.plan, x => x.date === formatDateForQuery(data.date));
                const plan = await api.update(currentPlan._id, {
                    plan: updated
                });
                setCurrentPlan(plan);
                setLoadingCurrent(false);
                break;
            case actions.showInfo:
            case actions.showRecipeInfo:
                {
                    const { recipe, date } = data;
                    router.push(getRoute(`/recipes?view=view&plan=${currentPlan._id}&id=${recipe}&date=${formatDateForQuery(date)}`));
                }
                break;
            case actions.createPlan:
                const { name, validFrom } = data;
                setLoadingCurrent(true);
                const createdPlan = await api.create({
                    name,
                    validFrom,
                    durationType: 'days',
                    length: 7
                });
                routeUpdate(router, { view: views.view, id: createdPlan._id });
                setLoadingCurrent(false);

                break;
            case actions.showCreate:
                routeUpdate(router, { view: views.create });
                break;
            case actions.showPlan:
                routeUpdate(router, {
                    view: views.view,
                    id: data.id || router.query.id
                })
                break;
            case actions.showHistory:
                routeUpdate(router, { view: views.history });
                break;
            case actions.deleteCurrentPlan:
                setLoadingCurrent(true);
                await api.delete(currentPlan._id);
                setLoadingCurrent(false);
                router.replace({
                    pathname: '/plan',
                    query: {
                        view: views.history
                    }
                })
                break;
            default:
                console.error('unknown click command: ', { type, data });
                break;
        }
    }



    useEffect(() => {
        let value;
        switch (router.query.view) {
            case views.history:
                value = "Historik";
                break;
            case views.create:
                value = 'Opret ugeplan';
                break;
            default:
                value = currentPlan ? currentPlan.name : 'Ugeplan';
                break;
        }
        setTitle(value);
    }, [router.query.view, currentPlan]);

    const state = {
        planId: router.query.id,
        loading: loadingCurrent || loadingShoppingList,
        isFirstTime,
        currentPlan,
        planHistory: history.data,
        noCurrentPlan,
        title,
        show,
        contextMenu
    }

    return [state, onClick, actions];
}

function getVisibility(view) {
    const showViews = {
        [views.history]: false,
        [views.view]: false,
        [views.create]: false,
        [views.edit]: false,
    }

    showViews[view] = true;

    return showViews;
}