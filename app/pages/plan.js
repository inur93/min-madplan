import Layout, { Actions, Content } from "../components/layout/Layout";
import { PlanCreate } from "../components/plan/PlanCreate";
import { PlanDetails } from "../components/plan/PlanDetails";
import { PlanHistory } from "../components/plan/PlanHistory";
import { Button, ButtonAction } from "../components/shared/Button";
import { usePlanContextMenu } from "../hooks/plan/usePlanContextMenu";
import { usePlanDetails } from "../hooks/plan/usePlanDetails";
import { usePlanHelp } from "../hooks/plan/usePlanHelp";
import { useView, views } from "../hooks/useView";
import { HelpBox } from "../components/shared/HelpBox";
import { auth } from "../functions/authFunctions";

function Page() {
    const [show, edit, goTo] = useView('/plan');
    const [state, handlers] = usePlanDetails();
    const [menu] = usePlanContextMenu();
    const [help, dismiss] = usePlanHelp();
    return (<Layout title={'Ugeplan'} actions={menu}>
        <HelpBox help={help} dismiss={dismiss} />
        <Content>
            {show.create && <PlanCreate />}
            {show.details && <PlanDetails />}
            {show.history && <PlanHistory />}
        </Content>
        <Actions>
            <ButtonAction view={views.history} icon='history' onClick={goTo.history} />
            {(show.details && state.shoppingList) && <Button icon='shopping cart' onClick={handlers.openShoppingList} />}
            {(show.details && !state.shoppingList) && <Button icon='add to cart' onClick={handlers.createShoppingList} />}
            <ButtonAction view={views.create} icon='calendar plus outline' onClick={goTo.create} />
        </Actions>
    </Layout>)
}

Page.getInitialProps = async function (ctx) {
    auth(ctx);
    return {};
}

export default Page;