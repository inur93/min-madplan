import { GetShoppingListApi, GetUnitsApi, GetProductItemsApi } from "../pages/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { routeUpdate } from "../functions/routerFunctions";
import { splice } from "../functions/arrayFunctions";

const actions = {
    updateItems: 'updateItems',
    updateItem: 'updateItem',
    editItem: 'editItem',
    deleteItem: 'deleteItem',
    selectItem: 'selectItem',

    createList: 'createList',

    showHistory: 'showHistory',
    showView: 'showView',
    showCreate: 'showCreate'
}

const views = {
    view: 'view',
    history: 'history',
    create: 'create'
}

export function useShoppingList() {
    const api = GetShoppingListApi();
    const unitsApi = GetUnitsApi();
    const productItemsApi = GetProductItemsApi();

    const router = useRouter();

    const [editSelected, setEditSelected] = useState(false);
    const [show, setShow] = useState({});
    const [unitOptions, setUnitOptions] = useState([]);
    const [history, setHistory] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    //loading
    const [loadingSelected, setLoadingSelected] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);

    //load units only on Mount
    useEffect(() => {
        unitsApi.getAll().then((data) => setUnitOptions(data));
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoadingHistory(true);
            const data = await api.myShoppingLists();
            setHistory(data);
            setLoadingHistory(false);
        }
        if (router.query.view === views.history) {
            load();
        }
    }, [router.query.view]);

    useEffect(() => {
        setShow(getVisibility(router.query.view || views.view));
    }, [router.query.view])

    //selected shopping list
    useEffect(() => {
        const load = async () => {
            const id = router.query.id;
            setLoadingSelected(true);
            const list = await (id
                ? api.getShoppingList(id)
                : api.latestShoppingList());
            console.log('list', list);
            setSelected(list);
            setLoadingSelected(false);
        }
        load();
    }, [router.query.id]);

    //handler to load suggestions for items to add to shopping list
    const getSuggestions = async (value) => {
        const { data } = await productItemsApi.find(value);
        const suggestions = data.map(({ _id, name, defaultUnit }) => ({ _id, name, unit: defaultUnit }));
        return [...suggestions, { name: `${value} ` }]; //add a space to enable auto-suggest to trigger change event onClick
    }

    const updateItemList = async (id, list) => {
        const data = await api.updateShoppingList(id, {
            items: list
        });
        if (data) {
            setSelected(data);
        } else {
            setSelected({ ...selected, list });
        }
        return true;
    }
    // const onSelect = async ({ _id, ...value }) => 


    const onClick = (action) => async (data) => {
        console.log('shopping list action', {action, data});
        switch (action) {
            case actions.selectItem:
                await updateItemList(selected._id, [...selected.items, { name: data.name }]);
                break;
            case actions.updateItems:
                await updateItemList(selected._id, data.items);
                break;
            case actions.editItem:
                setSelectedItem(selected.items.find(x => x._id === data.id));
                break;
            case actions.updateItem:
                const updatedList = splice(selected.items, x => x._id === data.item._id);
                updatedList.push(data.item);
                await updateItemList(selected._id, updatedList);
                setSelectedItem(null);
                break;
            case actions.deleteItem:
                const { items } = selected;
                updateItemList(selected._id, items.filter(x => x._id != _id));
                break;
            case actions.showCreate:
                break;
            case actions.showView:
                routeUpdate(router, {
                    view: views.view,
                    id: data.id
                })
                break;
            case actions.showHistory:
                routeUpdate(router, { view: views.history });
                break;
            default:
                console.error('unknown action', { action, data });
                break;
        }

        return true;
    }

    const state = {
        loadingHistory,
        loadingSelected,
        selected,
        history,
        views,
        isEmpty: (!history || history.length <= 0) && !selected,
        show,
        editSelected,
        selectedItem
    }

    const handlers = {
        getSuggestions,
        onClick,
        setEditSelected,
        setSelectedItem
    }

    return [state, handlers, actions];
}


function getVisibility(view) {
    const showViews = Object.keys(views).reduce((map, key) => {
        map[key] = false;
        return map;
    }, {});

    showViews[view] = true;

    return showViews;
}