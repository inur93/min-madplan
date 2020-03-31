import { Form } from "../shared/Form";
import { Input } from "../shared/Input";
import { getWeek, startOfNextWeek, addDays, formatDateForQuery } from '../../functions/dateFunctions';

export function PlanCreate({ onCreate }) {
    const nextWeek = startOfNextWeek();
    const week = getWeek(nextWeek);
    const defaultDateValue = formatDateForQuery(nextWeek);
    return <Form>
        <Input name="name"
            required
            defaultValue={`Uge ${week}`}
            placeholder="Giv din ugeplan et navn fx 'uge 12'" />
        <Input name="validFrom"
            required
            defaultValue={defaultDateValue} />
    </Form>
}