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

    const updateProducts = async (items) => {
        const key = ['shopping-lists', shoppingList._id];
        if (product) setProduct(null);
        mutate(key, { ...shoppingList, items }, false);
        mutate(key, api.update(shoppingList._id, { items }));
    }

    const products = ((shoppingList || {}).items || []).filter(x => !!x);
    const state = {
        shoppingList: shoppingList || latest,
        products,
        loading: !shoppingList,
        reloading: shoppingListLoading,
        editMode,
        product
    }

    const handlers = {
        getSuggestions,
        addProduct: ({ name }) => updateProducts([...products, { name }]),
        updateProduct: ({ item }) => updateProducts([...splice(products, x => x._id === item._id), item]),
        removeProduct: ({ id }) => updateProducts(products.filter(x => x._id != id)),
        editProduct: ({ id }) => setProduct(products.find(x => x._id === id)),
        cancelEditProduct: () => setProduct(null)
    }
    return [state, handlers];
}