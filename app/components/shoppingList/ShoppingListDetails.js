import { forwardRef } from "react";
import FlipMove from 'react-flip-move';
import { Checkbox, Icon, List, Progress } from "semantic-ui-react";
import { useShoppingListDetails } from "../../hooks/shoppingList/useShoppingListDetails";
import { ErrorMessage } from "../shared/ErrorMessage";
import { IconEdit, IconRemove } from "../shared/Icon";
import { ProductItemAutoComplete } from "../shared/Input";
import { Loader } from "../shared/Loader";
import './shopping-list-view.scss';
import { ShoppingItemEdit } from "./ShoppingItemEdit";
import { InfoMessage } from "../shared/InfoMessage";
import { Page } from "../shared/Page";
import { ScrollView } from "../shared/ScrollView";

const ListElementGroup = forwardRef(({ item, ...props }, ref) => {
    if (item.grouped) {
        return <List.Item ref={ref}>
            <List.Content className='nested'>
                <List.Header>
                    {item.name}
                </List.Header>
                {!item.hideDate &&
                    <List.Description >
                        {item.date}
                    </List.Description>
                }
                <List.List>
                    <FlipMove id={`flip-${item.key}`}>
                        {item.items.map(x => <ListElement {...props} key={x.key} item={x} />)}
                    </FlipMove>
                </List.List>
            </List.Content>
        </List.Item>
    }
    return <ListElement ref={ref} {...props} item={item} />;
})
const ListElement = forwardRef(({ editMode, item, handlers }, ref) => {
    const { checked } = item;
    const handleCheck = () => handlers.updateProduct({
        key: item.key,
        change: { checked: !checked }
    });
    const handleRemove = () => handlers.removeProduct({ key: item.key });
    const handleEdit = () => editMode
        ? handlers.editProduct({ key: item.key })
        : handleCheck();

    return <List.Item ref={ref} className='shopping-list-view-item'>
        <List.Content>
            <List.Header onClick={handleEdit}>
                {item.label}
            </List.Header>
        </List.Content>
        <List.Content>
            {editMode && <IconEdit onClick={handleEdit} />}
            {editMode && <IconRemove onClick={handleRemove} />}
            {!editMode && <Checkbox checked={checked} onChange={handleCheck} />}
        </List.Content>
    </List.Item >
})

export function ShoppingListDetails() {
    const [state, handlers] = useShoppingListDetails();
    const { editMode, loading, shoppingListItems } = state;

    if (state.error) return <ErrorMessage error={state.error} />;
    return (<Loader loading={loading}>
        {state.shouldUpdate && <InfoMessage
            message={state.message}
            dismiss={handlers.dismissUpdate} />}
        <Page title={state.shoppingList.name} loading={state.reloading}>
            {editMode && <ProductItemAutoComplete
                getSuggestions={handlers.getSuggestions}
                onSelect={handlers.addProduct}
                placeholder="Hvad skal du handle?" />
            }
            {!shoppingListItems.length && editMode && <p>Skriv i søgefeltet ovenfor for at tilføje noget til indkøbslisten</p>}
            {!shoppingListItems.length && !editMode && <p>Din indkøbsliste er tom, tryk på <Icon name='edit' /> for at tilføje varer til listen</p>}
            <ScrollView>
                <List>
                    <FlipMove id="shopping-list-flip">
                        {shoppingListItems.map((item, i) =>
                            <ListElementGroup key={item.key}
                                editMode={editMode}
                                handlers={handlers}
                                item={item} />)}
                    </FlipMove>
                </List>
            </ScrollView>
        </Page>
        {state.product &&
            <ShoppingItemEdit item={state.product}
                onSave={handlers.updateProduct}
                onCancel={handlers.cancelEditProduct} />}
    </Loader>)
}