import Layout, { Content, Actions } from "../components/layout/Layout";
import { useEffect } from "react";
import { Icon } from "semantic-ui-react";
import { usePlan } from "../hooks/usePlan";
import { Button } from "../components/shared/Button";
import { PlanView } from "../components/plan/PlanOverview";
import { PlanHistoryList } from "../components/plan/PlanHistoryList";
import { useRouter } from "next/router";
import { PlanCreate } from "../components/plan/PlanCreate";
import { auth } from "./api";

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
        loading, isFirstTime, noCurrentPlan, visibility } = state;

    const { shopping_list } = currentPlan || {};

    return (<Layout title={title}>
        <Content>
            {isFirstTime && <FirstTimeMessage hasCurrentPlan={!noCurrentPlan} loading={loading} />}
            {(noCurrentPlan && !isFirstTime) && <NoCurrentPlanMessage loading={loading} />}

            {visibility.create && <PlanCreate loading={loading} onCreate={onClick(actions.createPlan)} />}
            {visibility.view && currentPlan && <PlanView
                plan={currentPlan}
                onClick={onClick(actions.editPlanDay)}
                onRemove={onClick(actions.removePlanDay)}
                onInfo={onClick(actions.showRecipeInfo)} />}
            {visibility.history && <PlanHistoryList list={planHistory} onClick={onClick(actions.showPlan)} />}
        </Content>
        <Actions>
            <Button disabled={loading} icon='history' onClick={onClick(actions.showHistory)} />
            {shopping_list ?
                <Button disabled={loading} icon='shopping cart' onClick={onClick(actions.openCurrentShoppingList)} /> :
                <Button disabled={loading} icon='add to cart' onClick={onClick(actions.createShoppingList)} />}
            <Button disabled={loading} icon='calendar plus outline' onClick={onClick(actions.showCreate)} />
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