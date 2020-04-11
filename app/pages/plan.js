import { Icon } from "semantic-ui-react";
import { auth } from "../_api";
import Layout, { Actions, Content } from "../components/layout/Layout";
import { PlanCreate } from "../components/plan/PlanCreate";
import { PlanHistoryList } from "../components/plan/PlanHistoryList";
import { PlanView } from "../components/plan/PlanOverview";
import { Button, ButtonAction } from "../components/shared/Button";
import { usePlan } from "../hooks/usePlan";

const FirstTimeMessage = ({ hasCurrentPlan, loading }) => {
    if (loading) return null;
    if (hasCurrentPlan) {
        return (<p>Tilføj de retter du ønsker at lave den kommende uge.
    Når du er færdig tryk på {<Icon name="cart plus" />} for at oprette en indkøbsliste med alt det du har brug for.
        </p>)
    }
    return (<p>Hej med dig! Opret din første madplan ved at klikke på {<Icon name="calendar plus outline" />}</p>)
}

const NoCurrentPlanMessage = ({ loading }) => {
    if (loading) return null;
    return (<p>
        Du har ikke nogen madplan for den kommende uge, opret en ved at trykke på {<Icon name='calendar plus outline' />}.
    </p>)
}

function Page(props) {
    const [state, onClick, actions] = usePlan(props);

    const { title, currentPlan, planHistory,
        loading, isFirstTime, noCurrentPlan, show } = state;

    const { shopping_list } = currentPlan || {};

    return (<Layout loading={loading} title={title}>
        <Content>
            {isFirstTime && <FirstTimeMessage hasCurrentPlan={!noCurrentPlan} loading={loading} />}
            {(noCurrentPlan && !isFirstTime) && <NoCurrentPlanMessage loading={loading} />}

            {show.create && <PlanCreate loading={loading} onCreate={onClick(actions.createPlan)} />}
            {show.view && currentPlan && <PlanView
                plan={currentPlan}
                onClick={onClick(actions.editPlanDay)}
                onRemove={onClick(actions.removePlanDay)}
                onInfo={onClick(actions.showRecipeInfo)} />}
            {show.history && <PlanHistoryList list={planHistory} onClick={onClick(actions.showPlan)} />}
        </Content>
        <Actions>
            <ButtonAction view='history' disabled={loading} icon='history' onClick={onClick(actions.showHistory)} />
            {(show.view && shopping_list) && <Button disabled={loading} icon='shopping cart' onClick={onClick(actions.openCurrentShoppingList)} />}
            {(show.view && !shopping_list) && <Button disabled={loading} icon='add to cart' onClick={onClick(actions.createShoppingList)} />}
            <ButtonAction view='create' disabled={loading} icon='calendar plus outline' onClick={onClick(actions.showCreate)} />
        </Actions>
    </Layout>)
}

Page.getInitialProps = (ctx) => {
    const { id, view, firstTime } = ctx.query;
    auth(ctx);

    return {
        planId: id,
        view,
        firstTime: !!firstTime
    }
}

export default Page;