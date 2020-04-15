import useSWR, { mutate } from "swr"
import { GetShoppingListApi, GetProductItemsApi } from "../../_api"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { splice } from "../../functions/arrayFunctions";
import { useView } from "../useView";

export function useShoppingListDetails() {
    const api = GetShoppingListApi();
    const productItemsApi = GetProductItemsApi();

    const router = useRouter();
    const [show, editMode, goTo] = useView('/shopping-list');

    const [product, setProduct] = useState(null);

    const { data: latest } = useSWR('shopping-list/latest', api.latest);

    const {
        data: shoppingList,
        isValidating: shoppingListLoading
    } = useSWR(
        router.query.id ? ['shopping-lists', router.query.id] : null,
        (url, id) => api.findOne(id)
    );

    useEffect(() => {
        if (!router.query.id && !router.query.view && latest) {
            goTo.details(latest._id);
        }
    }, [router.query.id, router.query.view, latest]);


    //handlers   
    //handler to load suggestions for items to add to shopping list
    const getSuggestions = async (value) => {
        const { data } = await productItemsApi.find(value);
        const suggestions = data.map(({ _id, name, defaultUnit }) => ({ _id, name, unit: defaultUnit }));
        return [...suggestions, { name: `${value} ` }]; //add a space to enable auto-suggest to trigger change event onClick
    }

    const updateProducts = async (list) => {
        const data = {
            ...shoppingList,
            items: list
        };
        const key = ['shopping-lists', data._id];
        if (product) setProduct(null);
        mutate(key, data, false);
        mutate(key, api.update(data._id, data));
    }

    const state = {
        shoppingList: shoppingList || latest,
        products: (shoppingList || {}).items || [],
        loading: !shoppingList,
        reloading: shoppingListLoading,
        editMode,
        product
    }

    const handlers = {
        getSuggestions,
        addProduct: ({ name }) =>
            updateProducts([...shoppingList.items, { name }]),
        updateProduct: ({ item }) => updateProducts([...splice(shoppingList.items, x => x._id === item._id), item]),
        removeProduct: ({ id }) => updateProducts(shoppingList.items.filter(x => x._id != id)),
        editProduct: ({ id }) => setProduct(shoppingList.items.find(x => x._id === id)),
        cancelEditProduct: () => setProduct(null)
    }
    return [state, handlers];
}