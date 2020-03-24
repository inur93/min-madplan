import Layout, { Actions, Content } from "../../components/layout/Layout";
import { auth } from "../api/auth";
import { GetShoppingListApi } from "../api/shoppingListsApi";
import { ButtonAdd, Button } from "../../components/shared/Button";
import { Router } from "next/router";
import { List, ListItem, ShoppingListItem } from '../../components/shared/List';
import { ProductItemAutoComplete } from "../../components/shared/Input";
import { GetProductItemsApi } from "../api/productItemsApi";
import { GetUnitsApi } from '../api/unitsApi';
import { useState, useEffect } from "react";
import { EditShoppingItem } from '../../components/shared/Modals';
import { ContainerFixed } from "../../components/shared/Container";

function Page({ id }) {
    const api = GetShoppingListApi();
    const [shoppinglist, setShoppinglist] = useState({ items: [] });
    const [unitOptions, setUnitOptions] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const { name, items } = shoppinglist;

    useEffect(() => {
        api.getShoppingList(id).then(({ data }) => setShoppinglist(data));
        GetUnitsApi().getAll().then((data) => setUnitOptions(data));
    }, []);

    const getSuggestions = async (value) => {
        const { data } = await GetProductItemsApi().find(value);
        const suggestions = data.map(({ _id, name, defaultUnit }) => ({ _id, name, unit: defaultUnit }));
        return [...suggestions, { name: `${value} ` }]; //add a space to enable auto-suggest to trigger change event onClick
    }

    const updateList = async (list) => {
        const { data } = await api.updateShoppingList(id, {
            items: list
        });
        setShoppinglist(data);
    }
    const onSelect = async ({ _id, ...value }) => await updateList([...items, value]);

    const onClick = async (type, _id) => {
        switch (type) {
            case 'edit':
                setEditItem(items.find(x => x._id === _id));
                break;
            case 'delete':
                await updateList(items.filter(x => x._id != _id));
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
                await updateList(items);
                setEditItem(null);
                break;
            default: console.log('unknown type', { type, unit, amount });
        }
    }
    return (<Layout showBackBtn={true} title={name}>
        <Content>
            <List className="shopping-list-container">
                {items.map(({ _id, ...item }) => <ShoppingListItem key={_id} removable {...item} id={_id} onClick={onClick} />)}
            </List>
            <ProductItemAutoComplete getSuggestions={getSuggestions}
                onSelect={onSelect}
                placeholder="Hvad skal du handle?" />
        </Content>
        <Actions>
            <Button icon='ordered list' />
            <Button icon='calendar alternate outline' />
            <Button icon='add' />
        </Actions>
        {editItem && <EditShoppingItem item={editItem}
            unitOptions={unitOptions}
            onComplete={handleUpdateItem} />}

    </Layout>)
}

Page.getInitialProps = async (ctx) => {
    return { id: ctx.query.id }
}
export default Page;