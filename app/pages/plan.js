import Layout, { Content, Actions } from "../components/layout/Layout";
import { List, ListItem, WeekplanListItem } from "../components/shared/List";
import { GetPlanApi } from "./api/planApi";
import { useEffect, useState } from "react";
import Loading from "../components/shared/Loading";
import { addDays, endOfWeek, getWeek, formatDateForQuery } from '../stores/dateStore';
import { useRouter } from "next/router";
import { ButtonCreateShoppingList, ButtonOpenShoppingList, ButtonCreatePlan } from '../components/shared/Button';
function getPlanLength(amount, type) {
    switch (type) {
        case 'days':
            return amount;
        case 'weeks':
            return amount * 7;
        case 'months':
            return amount * 28;
    }
}
const actions = {
    createShoppingList: 'create-shopping-list',
    openCurrentShoppingList: 'open-current-shoppinglist',
    editListItem: 'edit-list-item',
    createPlan: 'create-plan'
}
function RenderListItems({ _id, plan, validFrom, length, durationType }, onClick) {

    let days = new Array(getPlanLength(length, durationType)).fill(null);
    let baseDate = new Date(validFrom);
    const handleClick = (date) => () => onClick(_id, date);
    return (<List>
        {days.map((val, i) => {
            const date = addDays(baseDate, i);
            const queryDate = formatDateForQuery(date);
            const entry = plan.find(p => p.date === queryDate);
            return <WeekplanListItem key={date}
                onClick={handleClick(queryDate)}
                recipe={entry && entry.recipe}
                date={date} />
        })}
    </List>)
}

function Page() {
    const api = GetPlanApi();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [currentPlan, setCurrentPlan] = useState(null);
    const loadPlan = async () => {
        const id = router.query.id;
        let plan;
        if (id) {
            plan = await api.findOne(id);
        } else {
            const list = await api.findCurrent();
            plan = list && list[0];
        }
        setLoading(false);
        if (plan) {
            setCurrentPlan(plan);
        }
    }
    useEffect(() => {
        loadPlan();
    }, []);

    const onClick = (type) => async (id, date) => {
        let shoppingListId = null;
        switch (type) {
            case actions.createShoppingList:
                const shoppingList = await api.createShoppingList(currentPlan._id);
                shoppingListId = shoppingList._id;
            case actions.openCurrentShoppingList:
                router.push(`/shopping-list/${shoppingList || currentPlan.shopping_list}`);
                break;
            case actions.editListItem:
                const planId = id;
                router.push(`/recipes?plan=${planId}&date=${date}`);
                break;
            case actions.createPlan:
                const nextMonday = formatDateForQuery(addDays(endOfWeek(new Date()), 1));
                const title = `Uge ${getWeek(new Date(nextMonday))}`;
                const newPlan = await api.create({
                    validFrom: nextMonday,
                    title,
                    length: 7,
                    durationType: 'days'
                });
                router.push(`/plan?id=${newPlan._id}`);
                loadPlan();
                break;
            default:
                console.error('unknown click command: ', type);
                break;
        }
    }

    const noCurrentPlan = !loading && !currentPlan;
    const showPlan = !loading && currentPlan;
    const { shopping_list } = currentPlan || {};

    return (<Layout title={currentPlan ? currentPlan.title : 'Ugeplan'}>
        <Content>
            {loading && <Loading />}
            {noCurrentPlan && <p>
                Du har ikke nogen madplan for den kommende uge, opret en her.
                </p>}
            {showPlan && RenderListItems(currentPlan, onClick(actions.editListItem))}
        </Content>
        <Actions>
            {shopping_list ?
                <ButtonOpenShoppingList onClick={onClick(actions.openCurrentShoppingList)} /> :
                <ButtonCreateShoppingList onClick={onClick(actions.createShoppingList)} />}
            <ButtonCreatePlan onClick={onClick(actions.createPlan)} />
        </Actions>
    </Layout>)
}

export default Page;