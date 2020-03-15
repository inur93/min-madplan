import Layout from "../../components/Layout";
import { auth } from "../api/auth";
import { GetShoppingListApi } from "../api/shoppingListsApi";
import { ButtonAdd } from "../../components/shared/Button";
import { Router } from "next/router";
import { List, ListItem, ShoppingListItem } from '../../components/shared/List';
import { RecipeItemAutoComplete } from "../../components/shared/Input";
import { GetRecipeItemsApi } from "../api/recipeItemsApi";
import { GetUnitsApi } from '../api/unitsApi';
import { useState, useEffect } from "react";
import { EditShoppingItem } from '../../components/shared/Modals';

function Page({ id }) {
    const api = GetShoppingListApi();
    const [shoppinglist, setShoppinglist] = useState({});
    const [unitOptions, setUnitOptions] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const { name, items } = shoppinglist;
    const itemsList = items && items.list || [];

    useEffect(() => {
        api.getShoppingList(id).then(({ data }) => setShoppinglist(data));
        GetUnitsApi().getAll().then((data) => setUnitOptions(data));
    }, []);

    const getSuggestions = async (value) => {
        const { data } = await GetRecipeItemsApi().find(value);
        return [...data, { name: `${value} ` }]; //add a space to enable auto-suggest to trigger change event onClick
    }

    const updateList = async (list) => {
        const { data } = await api.updateShoppingList(id, {
            items: { list }
        });
        setShoppinglist(data);
    }
    const onSelect = async (value) => await updateList([...itemsList, value]);

    const onClick = async (type, _id) => {
        switch (type) {
            case 'edit':
                setEditItem(itemsList.find(x => x._id === _id));
                break;
            case 'delete':
                await updateList(itemsList.filter(x => x._id != _id));
                break;
            default:
                break;

        }
    }

    const handleUpdateItem = async (type, { unit, amount }) => {
        switch (type) {
            case 'cancel':
                setEditItem(null);
                break;
            case 'save':
                editItem.unit = unit;
                editItem.amount = amount;
                await updateList(itemsList);
                setEditItem(null);
                break;
            default: console.log('unknown type', { type, unit, amount });
        }
    }
    return (<Layout showBackBtn={true} title={name}>
        <List className="shopping-list-container">
            {itemsList.map(({ _id, ...item }) => <ShoppingListItem key={_id} removable {...item} id={_id} onClick={onClick} />)}
        </List>
        <RecipeItemAutoComplete getSuggestions={getSuggestions} onSelect={onSelect} placeholder="Hvad skal du handle?" />
        {editItem && <EditShoppingItem item={editItem}
            unitOptions={unitOptions}
            onComplete={handleUpdateItem} />}
        <style jsx>{`
            :global(.shopping-list-container){
                height: 76vh;
                overflow: overlay;
            }
            `}</style>
    </Layout>)
}

Page.getInitialProps = async (ctx) => {
    return { id: ctx.query.id }
}
export default Page;