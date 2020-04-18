import { List, Icon } from "semantic-ui-react";
import { addDays, formatDateForQuery, formatDay, getPlanLength } from '../../functions/dateFunctions';
import { IconEdit, IconInfo, IconRemove } from "../shared/Icon";
import { usePlanDetails } from "../../hooks/plan/usePlanDetails";
import { Loader } from '../shared/Loader';
import { useState } from "react";

const ListItem = function ({ date, recipe, onEdit, onRemove, onInfo }) {
    const isEmpty = !recipe;
    const handleInfo = () => onInfo({ recipe: recipe._id, date });
    const handleRemove = async () => await onRemove({ date });
    const handleEdit = () => onEdit({ recipe: recipe && recipe._id, date });

    return (<List.Item>
        <List.Content>
            <List.Header as="a">{formatDay(new Date(date))}</List.Header>
            <List.Header onClick={handleEdit} className={isEmpty ? 'mmp-empty' : ''} >
                {isEmpty ?
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