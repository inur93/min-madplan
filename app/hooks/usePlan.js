import { GetPlanApi } from "../pages/api";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { routeUpdate } from "../functions/routerFunctions";

const actions = {
    createShoppingList: 'create-shopping-list',
    openCurrentShoppingList: 'open-current-shoppinglist',
    editPlanDay: 'edit-list-item',
    createPlan: 'create-plan',
    history: 'history',
    viewPlan: 'navigate-plan'
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
    const [loading, setLoading] = useState(true);

    //data
    const [title, setTitle] = useState("");
    const [currentPlan, setCurrentPlan] = useState(null);
    const [planHistory, setPlanHistory] = useState([]);
    const [visibility, setVisibility] = useState(getVisibility(defaultState.view));

    //props
    // const [view, setView] = useState(defaultState.view || views.view);
    // const [planId, setPlanId] = useState(defaultState.planId);

    const [noCurrentPlan, setNoCurrentPlan] = useState(false);
    const [isFirstTime, setFirstTime] = useState(defaultState.firstTime);
    const [disableOpenCurrent, setDisableOpenCurrent] = useState(true);


    useEffect(() => {
        const loadPlan = async (id) => {

            setLoading(true);

            const [history, current] = await Promise.all([
                api.find(),
                id ? api.findOne(id) : api.findCurrent()
            ]);

            setPlanHistory(history);
            setCurrentPlan(current);
            setLoading(false);
        }
        loadPlan(router.query.id);
    }, [router.query.id])

    const getRoute = (prefix) => {
        let route = prefix;
        if (isFirstTime) {
            route = `${route}${route.includes('?') ? '&' : '?'}firstTime=true`;
        }
        return route;
    }

    const onClick = (type) => async (id, date) => {
        let shoppingListId = null;
        switch (type) {
            case actions.createShoppingList:
                const shoppingList = await api.createShoppingList(currentPlan._id);
                shoppingListId = shoppingList._id;
            case actions.openCurrentShoppingList:
                router.push(getRoute(`/shopping-list/${shoppingListId || currentPlan.shopping_list}`));
                break;
            case actions.editPlanDay:
                router.push(getRoute(`/recipes?plan=${id}&date=${date}`));
                break;
            case actions.createPlan:
                routeUpdate(router, { view: views.create });
                break;
            case actions.viewPlan:
                routeUpdate(router, {
                    view: views.view,
                    id
                })
                break;
            case actions.history:
                routeUpdate(router, { view: views.history });
                break;
            default:
                console.error('unknown click command: ', type);
                break;
        }
    }

    useEffect(() => {
        const planNextWeek = (planHistory || []).find(x => new Date(x.validFrom) > new Date());
        setNoCurrentPlan(!loading && !planNextWeek);
    }, [planHistory, loading]);

    useEffect(() => {
        setVisibility(getVisibility(router.query.view || views.view, currentPlan));
    }, [router.query.view, currentPlan]);

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
                value = currentPlan ? currentPlan.title : 'Ugeplan';
                break;
        }
        setTitle(value);
    }, [router.query.view, currentPlan]);

    const state = {
        planId: router.query.id,
        loading,
        isFirstTime,
        currentPlan,
        planHistory,
        noCurrentPlan,
        title,
        visibility
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

    console.log('calculate visibility', { view, showViews });
    return showViews;
}