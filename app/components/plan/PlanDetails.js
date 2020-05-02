import { useState, useEffect } from "react";
import { List } from "semantic-ui-react";
import { formatDay } from '../../functions/dateFunctions';
import { usePlanDetails } from "../../hooks/plan/usePlanDetails";
import { IconEdit, IconInfo, IconRemove } from "../shared/Icon";
import { Loader } from '../shared/Loader';

const ListItem = function ({ date, recipe, onEdit, onRemove, onInfo }) {
    const [isEmpty, setEmpty] = useState(true);
    const handleInfo = () => onInfo({ recipe: recipe._id, date });
    const handleRemove = async () => {
        setEmpty(true);
        await onRemove({ date })
    };
    const handleEdit = () => onEdit({ recipe: recipe && recipe._id, date });
    useEffect(() => {
        setEmpty(!recipe);
    }, [recipe]);
    return (<List.Item>
        <List.Content>
            <List.Header as="a">{formatDay(new Date(date))}</List.Header>
            <List.Header onClick={handleEdit} className={isEmpty ? 'mmp-empty' : ''} >
                {(isEmpty || !recipe) ?
                    "Tilføj en opskrift..."
                    : recipe.title
                }
            </List.Header>
        </List.Content>
        <List.Content>
            <IconEdit onClick={handleEdit} />
            {!isEmpty && <IconInfo onClick={handleInfo} />}
            {!isEmpty && <IconRemove onClick={handleRemove} />}
        </List.Content>
    </List.Item>)
}

export function PlanDetails() {
    const [state, handlers] = usePlanDetails();

    const onEdit = (data) => handlers.editPlanDay({ ...data, id: state.plan._id });
    const onInfo = (data) => handlers.infoPlanDay({ ...data, id: state.plan._id });

    return (<Loader loading={state.loading}>
        <h2>{state.plan && state.plan.name}</h2>
        <List>
            {state.planDays.map(({ date, recipe }) => {
                return <ListItem key={date}
                    onEdit={onEdit}
                    onRemove={handlers.removePlanDay}
                    onInfo={onInfo}
                    recipe={recipe}
                    date={date} />
            })}
        </List>
    </Loader>)
}