import { formatDateForQuery, getWeek, startOfNextWeek } from '../../functions/dateFunctions';
import { ButtonSuccess } from "../shared/Button";
import { Form } from "../shared/Form";
import { Input } from "../shared/Input";
import { usePlanCreate } from '../../hooks/plan/usePlanCreate';

export function PlanCreate() {
    const [state, handlers] = usePlanCreate();
    const nextWeek = startOfNextWeek();
    const week = getWeek(nextWeek);
    const defaultDateValue = formatDateForQuery(nextWeek);
    return <Form onSubmit={handlers.onCreate}>
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
        <ButtonSuccess loading={state.loading} disabled={state.loading} />
    </Form>
}