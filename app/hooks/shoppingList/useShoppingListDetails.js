import useSWR, { mutate } from "swr"
import { GetShoppingListApi, GetProductItemsApi } from "../../_api"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { splice, sortByCheckedThenName, groupBy } from "../../functions/arrayFunctions";
import { useView } from "../shared/useView";
import { transformAmount } from "../../functions/unitFunctions";
import { useSort } from "../shared/useSort";

export function useShoppingListDetails() {
    const api = GetShoppingListApi();
    const productItemsApi = GetProductItemsApi();

    const router = useRouter();
    const [, editMode] = useView('/shopping-list');
    const [product, setProduct] = useState(null);
    const [shoppingListItems, setShoppingListItems] = useState([]);
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [reloading, setReloading] = useState(false);
    const [sortBy] = useSort('shoppinglist');

    const {
        data: shoppingList,
        isValidating: shoppingListLoading,
        error
    } = useSWR(
        router.query.id ? ['shopping-lists', router.query.id] : null,
        (url, id) => api.findOne(id)
    );

    useEffect(() => {
        if (shoppingList && shoppingList.food_plan) {
            const plan = (shoppingList.food_plan.plan || [])
                .filter(x => x.recipe)
                .map(x => x.recipe.title);
            const recipes = shoppingList.extra.recipes || [];
            const missing = plan.filter(x => !recipes.includes(x));
            const shouldRemove = recipes.filter(x => !plan.includes(x));
            setShouldUpdate(!!(missing.length || shouldRemove.length));
        } else {
            setShouldUpdate(false);
        }
    }, [shoppingList])

    useEffect(() => {
        if (!shoppingList) return;
        const items = ((shoppingList || {}).extra || {}).items || [];
        switch (sortBy) {
            case 'item':
                setShoppingListItems(groupByIngredient(items));
                break;
            case 'recipe':
            default:
                setShoppingListItems(groupByRecipe(items));
                break;
        }
    }, [shoppingList, sortBy]);
    //handlers   
    //handler to load suggestions for items to add to shopping list
    const getSuggestions = async (value) => {
        const { data } = await productItemsApi.find(value);
        const suggestions = data.map(({ _id, name, defaultUnit }) => ({ _id, name, unit: defaultUnit }));
        return [...suggestions, { name: `${value} ` }]; //add a space to enable auto-suggest to trigger change event onClick
    }

    const updateShoppinglistItems = async (items) => {
        const key = ['shopping-lists', shoppingList._id];
        if (product) setProduct(null);
        mutate(key, { ...shoppingList, extra: { ...shoppingList.extra, items } }, false);
        mutate(key, api.update(shoppingList._id, { extra: { ...shoppingList.extra, items } }));
    }

    const state = {
        shoppingList: shoppingList || {},
        shoppingListItems,
        loading: !shoppingList && !error,
        error,
        reloading: shoppingListLoading || reloading,
        editMode,
        product,
        shouldUpdate,
        message: {
            header: 'Opdater indkøbslisten',
            loading: reloading || shoppingListLoading,
            content: () => <div>Vi kan se at madplanen er ændret. Opdater indkøbslisten ved at{' '}
                <a onClick={handlers.refresh} style={{ textDecoration: 'underline' }}>klikke her</a>
            </div>
        }
    }

    const handlers = {
        getSuggestions,
        refresh: async (e) => {
            e && e.preventDefault();
            setReloading(true);
            await api.refresh(shoppingList._id);
            mutate(['shopping-lists', shoppingList._id]);
            setReloading(false);
        },
        addProduct: ({ name }) => {
            let existing = shoppingList.extra.items.find(x => x.name === name);
            if (existing) {
                if (existing.parts.find(x => x.other)) {
                    //TODO notify user that item already exists 
                } else {
                    existing.parts.push({
                        key: new Date().getTime(),
                        name: 'Andet',
                        amount: 0,
                        unit: existing.unit,
                        other: true
                    });
                }
            } else {
                existing = {
                    key: new Date().getTime(),
                    name,
                    parts: [{
                        key: new Date().getTime() + 1,
                        name: 'Andet',
                        amount: 0,
                        other: true
                    }]
                }
            }
            //re-add existing to trigger update
            updateShoppinglistItems([...shoppingList.extra.items.filter(x => x.key != existing.key), existing]);
        },
        updateProduct: ({ key, change }) => {
            let root = shoppingList.extra.items.find(x => x.key === key);

            let target = null;
            if (!root) {
                root = shoppingList.extra.items.find(x => x.parts && x.parts.find(y => y.key === key));
                target = root.parts.find(x => x.key === key);
            } else {
                target = root.parts.find(x => x.other);
                //make sure item has a 'other' part to save difference between total and all other parts.
                if (!target) {
                    target = {
                        other: true,
                        key: new Date().getTime(),
                        name: 'Andet',
                        unit: root.unit,
                        amount: 0
                    };
                    root.parts.push(target);
                }

                if (Object.keys(change).includes('amount')) {
                    //when total amount has changed we have to recalculate the amount set on 'other' part.
                    change.amount = change.amount - transformAmount(root.parts.filter(x => !x.other), change);
                }

                //when unit is set on root item the unit should not be changed on other part.
                if (Object.keys(change).includes('unit')) {
                    root.unit = change.unit;
                    delete change.unit;
                }

                if (Object.keys(change).includes('checked')) {
                    root.parts = root.parts.map(x => ({ ...x, checked: change.checked }));
                    delete change.checked;
                }
            }

            //make updates to target part
            Object.assign(target, change);

            //always make sure root value is up-to-date
            root.checked = root.parts.reduce((ret, rec) => {
                if (!rec.checked) return false;
                return ret;
            }, true);

            updateShoppinglistItems([...splice(shoppingList.extra.items, x => x.key === root.key), root]);
        },
        removeProduct: ({ key }) => {
            const filtered = shoppingList.extra.items
                //filter items if possible    
                .filter(x => x.key != key)
                .map(x => ({
                    ...x,
                    //then filter parts
                    parts: x.parts ? x.parts.filter(y => y.key != key) : null
                }))
                //at last filter those items that have no parts left
                .filter(x => x.parts.length > 0);
            updateShoppinglistItems(filtered);
        },
        editProduct: ({ key }) => {
            let target = shoppingList.extra.items.find(x => x.key === key);
            if (!target) {
                const item = shoppingList.extra.items.find(x => x.parts && x.parts.find(y => y.key === key));
                if (item) {
                    target = item.parts.find(x => x.key === key);
                }
            } else {
                //make sure item amount is computed
                target.amount = transformAmount(target.parts, target);
            }
            setProduct(target);
        },
        cancelEditProduct: () => setProduct(null)
    }
    return [state, handlers];
}

function groupByIngredient(list) {
    return list.filter(x => !!x)
        .sort(sortByCheckedThenName)
        .map(({ amount, unit, name, checked, _id, key, parts }) => {
            return {
                _id,
                key,
                label: `${transformAmount(parts, { unit }) || ''} ${amount && unit || ''} ${name}`,
                checked
            }
        })
}

function groupByRecipe(list) {
    const grouped = list
        .filter(x => !!x)
        .reduce((groups, item) => {

            item.parts.reduce((_groups, part) => {
                const existing = _groups.find(x => x.name === part.name);
                const amount = transformAmount(part, item) || 0;
                const totalAmount = transformAmount(item.parts, item) || 0;
                const totalLabel = (amount === totalAmount) ? (part.unit || '') : `/ ${totalAmount || 0} ${item.unit || ''}`;
                const label = `${amount || ''} ${totalLabel} ${item.name}`;
                const nestedItem = {
                    key: part.key,
                    checked: part.checked,
                    label
                }
                if (existing) {
                    existing.items.push(nestedItem);
                } else {
                    _groups.push({
                        grouped: true,
                        key: `${part.name}-${part.date}`,
                        name: part.name,
                        date: part.date,
                        items: [nestedItem]
                    })
                }
                return _groups;
            }, groups);
            return groups;
        }, [{
            grouped: true,
            key: `Andet`,
            name: 'Andet',
            date: new Date(0), //make sure show at top
            hideDate: true,
            items: []
        }])
        //only keep groups that actually contain any items
        .filter(x => x.items.length > 0);

    return grouped.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA > dateB) return 1;
        if (dateB > dateA) return -1;
        return 0;
    }).map(item => {
        return {
            ...item,
            items: item.items.sort(sortByCheckedThenName)
        }
    });
}