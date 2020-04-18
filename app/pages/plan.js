import { Icon } from "semantic-ui-react";
import { auth } from "../_api";
import Layout, { Actions, Content } from "../components/layout/Layout";
import { PlanCreate } from "../components/plan/PlanCreate";
import { PlanHistory } from "../components/plan/PlanHistory";
import { PlanView, PlanDetails } from "../components/plan/PlanDetails";
import { Button, ButtonAction } from "../components/shared/Button";
import { useView, views } from "../hooks/useView";
import { usePlanDetails } from "../hooks/plan/usePlanDetails";
import useSWR, { mutate } from "swr";

const FirstTimeMessage = ({ hasCurrentPlan, loading }) => {
    if (loading) return null;
    if (hasCurrentPlan) {
        return (<p>Tilføj de retter du ønsker at lave den kommende uge.
    Når du er færdig tryk på {<Icon name="cart plus" />} for at oprette en indkøbsliste med alt det du har brug for.
        </p>)
    }
    return (<p>Hej med dig! Opret din første madplan ved at klikke på {<Icon name="calendar plus outline" />}</p>)
}

function Page() {
    const [show, edit, goTo] = useView('/plan');
    const [state, handlers] = usePlanDetails();
    const {data: test} = useSWR('test/data', () => {
        console.log('fetching test data...');
        return 'test data';
    })
    return (<Layout title={'Ugeplan'} >
        <Content>
            {show.create && <PlanCreate />}
            {show.details && <PlanDetails />}
            {show.history && <PlanHistory />}

            <p onClick={() => {
                mutate('test/data', 'mutated', false);
            }}>{test}</p>
        </Content>
        <Actions>
            <ButtonAction view={views.history} icon='history' onClick={goTo.history} />
            {(show.details && state.shoppingList) && <Button icon='shopping cart' onClick={handlers.openShoppingList} />}
            {(show.details && !state.shoppingList) && <Button icon='add to cart' onClick={handlers.createShoppingList} />}
            <ButtonAction view={views.create} icon='calendar plus outline' onClick={goTo.create} />
        </Actions>
    </Layout>)
}

export default Page;