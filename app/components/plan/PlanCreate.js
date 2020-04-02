import { Form } from "../shared/Form";
import { Input } from "../shared/Input";
import { getWeek, startOfNextWeek, addDays, formatDateForQuery } from '../../functions/dateFunctions';
import { Button } from "semantic-ui-react";
import { ButtonSuccess } from "../shared/Button";

export function PlanCreate({ onCreate, loading }) {
    const nextWeek = startOfNextWeek();
    const week = getWeek(nextWeek);
    const defaultDateValue = formatDateForQuery(nextWeek);
    return <Form onSubmit={onCreate}>
        <Input name="name"
            required
            defaultValue={`Uge ${week}`}
            placeholder="Giv din ugeplan et navn fx 'uge 12'" />
        <Input name="validFrom"
            required
            defaultValue={defaultDateValue} />
        <ButtonSuccess disabled={loading} fluid type='submit' name='submit' icon='success' />
    </Form>
}