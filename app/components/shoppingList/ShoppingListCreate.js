import { Form } from "../shared/Form";
import { Input } from "semantic-ui-react";
import { getWeek, setWeek, formatDate } from '../../functions/dateFunctions';
import { ButtonSuccess } from "../shared/Button";



export function ShoppingListCreate({ onSave, loading }) {
    const nextWeek = getWeek(new Date()) + 1;
    const defaultName = `Uge ${nextWeek}`;
    const defaultValidFrom = formatDate(setWeek(new Date(), nextWeek - 1));
    return (
        <Form id="create-shopping-list" onSubmit={onSave}>
            <Form.Field required>
                <label>Navn</label>
                <Input name='name' defaultValue={defaultName} placeholder='Indtast et navn' />
            </Form.Field>
            <Form.Field required>
                <label>Gældende fra</label>
                <Input name='validFrom' type='date' defaultValue={defaultValidFrom} />
            </Form.Field>

            <ButtonSuccess disabled={loading} />
        </Form>
    )
}