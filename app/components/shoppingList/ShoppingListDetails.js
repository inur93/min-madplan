import { Checkbox, List, Icon } from "semantic-ui-react";
import { sortByCheckedThenName } from "../../functions/arrayFunctions";
import { useShoppingListDetails } from "../../hooks/shoppingList/useShoppingListDetails";
import { IconEdit, IconRemove } from "../shared/Icon";
import { ShoppingItemEdit } from "./ShoppingItemEdit";
import { ProductItemAutoComplete } from "../shared/Input";
import './shopping-list-view.scss';
import { Loader } from "../shared/Loader";
import FlipMove from 'react-flip-move';
import { forwardRef } from "react";

const ListElement = forwardRef(({ editMode, item, onCheck, onEdit, onRemove }, ref) => {
    const { name, unit, amount, checked } = item;

    const handleCheck = () => onCheck({ item: { ...item, checked: !checked } });
    const handleRemove = () => onRemove({ id: item._id });
    const handleEdit = () => editMode
        ? onEdit({ id: item._id })
        : handleCheck();

    let fullname = amount
        ? `${amount} ${unit || ''} ${name}`
        : name;

    return <List.Item ref={ref} className='shopping-list-view-item'>
        <List.Content>
            <List.Header onClick={handleEdit}>
                {fullname}
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
    const { editMode, loading, products } = state;

    return (<Loader loading={loading}>
        <div>
            {editMode && <ProductItemAutoComplete
                getSuggestions={handlers.getSuggestions}
                onSelect={handlers.addProduct}
                placeholder="Hvad skal du handle?" />
            }
            {!products.length && editMode && <p>Skriv i søgefeltet ovenfor for at tilføje noget til indkøbslisten</p>}
            {!products.length && !editMode && <p>Din indkøbsliste er tom, tryk på <Icon name='edit' /> for at tilføje varer til listen</p>}
            <List>
                <FlipMove>
                    {products
                        .sort(sortByCheckedThenName)
                        .map((item, i) => <ListElement key={item._id || item.name}
                            editMode={editMode}
                            onCheck={handlers.updateProduct}
                            onEdit={handlers.editProduct}
                            onRemove={handlers.removeProduct}
                            item={item} />)}
                </FlipMove>
            </List>
        </div>
        {state.product &&
            <ShoppingItemEdit item={state.product}
                onSave={handlers.updateProduct}
                onCancel={handlers.cancelEditProduct} />}
    </Loader>)
}