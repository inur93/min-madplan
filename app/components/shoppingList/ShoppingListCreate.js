import { Form} from "../shared/Form";
import { FormField } from "semantic-ui-react";
import { ButtonSave } from "../shared/Button";
import { getWeek, setWeek, formatDate } from '../../functions/dateFunctions';



export function ShoppingListCreate({ onSave, }) {
    const nextWeek = getWeek(new Date()) + 1;
    const defaultTitle = `Uge ${nextWeek}`;
    const defaultValidFrom = formatDate(setWeek(new Date(), nextWeek - 1));
    return (
        <Form id="create-shopping-list" onSubmit={onSave}>
            <FormField label="Titel" name="name" defaultValue={defaultTitle} required />
            <FormField label="Gældende fra" type="date" name="validFrom" defaultValue={defaultValidFrom} required />
            <ButtonSave type="submit" />
        </Form>
    )
}