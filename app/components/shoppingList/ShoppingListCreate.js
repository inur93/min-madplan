import { Input } from "semantic-ui-react";
import { formatDate, getWeek, setWeek } from '../../functions/dateFunctions';
import { ButtonSuccess } from "../shared/Button";
import { Form } from "../shared/Form";
import { useShoppingListCreate } from "../../hooks/shoppingList/useShoppingListCreate";



export function ShoppingListCreate() {
    const [state, handlers] = useShoppingListCreate();
    const nextWeek = getWeek(new Date()) + 1;
    const defaultName = `Uge ${nextWeek}`;
    const defaultValidFrom = formatDate(setWeek(new Date(), nextWeek - 1));
    return (
        <Form id="create-shopping-list" onSubmit={handlers.onCreate}>
            <Form.Field required>
                <label>Navn</label>
                <Input name='name' defaultValue={defaultName} placeholder='Indtast et navn' />
            </Form.Field>
            <Form.Field required>
                <label>Gældende fra</label>
                <Input name='validFrom' type='date' defaultValue={defaultValidFrom} />
            </Form.Field>
            <ButtonSuccess loading={state.loading} disabled={state.loading} />
        </Form>
    )
}