import { formatDateForQuery, getWeek, startOfNextWeek } from '../../functions/dateFunctions';
import { ButtonSuccess } from "../shared/Button";
import { Form } from "../shared/Form";
import { Input } from "../shared/Input";

export function PlanCreate({ onCreate, loading }) {
    const nextWeek = startOfNextWeek();
    const week = getWeek(nextWeek);
    const defaultDateValue = formatDateForQuery(nextWeek);
    return <Form onSubmit={onCreate}>
        <Form.Field required>
            <label>Navn</label>
            <Input name="name"
                defaultValue={`Uge ${week}`}
                placeholder="Giv din ugeplan et navn fx 'uge 12'" />
        </Form.Field>
        <Form.Field required>
            <label>Gældende fra</label>
            <Input name="validFrom"
                type='date'
                defaultValue={defaultDateValue} />
        </Form.Field>
        <ButtonSuccess disabled={loading} />
    </Form>
}