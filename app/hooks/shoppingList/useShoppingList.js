import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetProductItemsApi, GetShoppingListApi } from "../../_api";
import { splice } from "../../functions/arrayFunctions";
import { routeUpdate } from "../../functions/routerFunctions";
import useSWR from "swr";

const actions = {
    updateItems: 'updateItems',
    updateItem: 'updateItem',
    editItem: 'editItem',
    deleteItem: 'deleteItem',
    selectItem: 'selectItem',

    createList: 'createList',
    deleteCurrent: 'delete-current-shopping-list',

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
    const productItemsApi = GetProductItemsApi();

    const router = useRouter();

    const [title, setTitle] = useState('Indkøbsliste');
    const [editSelected, setEditSelected] = useState(false);
    const [show, setShow] = useState({});
    
    const [selected, setSelected] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [contextMenu, setContextMenu] = useState([]);
    //loading
    const [loadingSelected, setLoadingSelected] = useState(false);
    
    useEffect(() => {
        const items = [];
        if(show.view){
            items.push({
                label: 'Slet',
                onClick: onClick(actions.deleteCurrent)
            })
        }
        setContextMenu(items);
    }, [show]);
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
        if (show.history) setTitle('Indkøbslister');
        else if (show.view) setTitle(selected ? selected.name : 'Indkøbsliste');
        else if (show.create) setTitle('Indkøbsliste');
    }, [show, selected])

  

    //selected shopping list
    useEffect(() => {
        const load = async () => {
            const id = router.query.id;
            setLoadingSelected(true);
            const list = await (id
                ? api.getShoppingList(id)
                : api.latestShoppingList());
            setSelected(list);
            setLoadingSelected(false);
        }
        load();
    }, [router.query.id]);

 

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

    const onClick = (action) => async (data) => {
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

            case actions.createList:
                setLoadingSelected(true);
                const created = await api.createShoppingList(data);
                setLoadingSelected(false);
                routeUpdate(router, { view: views.view, id: created._id });
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
            case actions.deleteCurrent:
                setLoadingSelected(true);
                await api.delete(selected._id);
                setLoadingSelected(false);
                router.replace({
                    pathname: '/shopping-list',
                    query: {
                        view: views.history
                    }
                })
                break;
            default:
                console.error('unknown action', { action, data });
                break;
        }

        return true;
    }

    const state = {
        contextMenu,
        title,
        loadingHistory,
        loadingSelected,
        loading: loadingHistory || loadingSelected,
        selected,
        history,
        views,
        isEmpty: !loadingHistory && loadingSelected && (!history || history.length <= 0) && !selected,
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


