import Layout, { Actions, Content } from '../components/layout/Layout';
import { List } from '../components/shared/List';
import { SearchInput } from '../components/shared/Input';
import { formatDay } from "../functions/dateFunctions";
import { Message, Icon, List as ListSUI } from 'semantic-ui-react';
import { useRecipes } from '../hooks/useRecipes';
import { auth } from './api';

function PlanDate({ plan, date }) {
    const selected = plan.find(x => x.date === date);
    return <Message info
        header={formatDay(new Date(date))}
        content={selected ? selected.recipe.title : 'Vælg en opskrift...'} />
}


function RecipeListItem({ id, title, onClick }) {
    return (<ListSUI.Item onClick={() => onClick(id)}>
            <ListSUI.Content>
                <ListSUI.Header>{title}</ListSUI.Header>
                <Icon name='list ol' />
                <Icon name='check circle outline' />
            </ListSUI.Content>
        </ListSUI.Item>)
}

const Page = (props) => {

    const [state, handlers, actions] = useRecipes(props);


    const { query, date, plan, recipes, selected, visibility } = state;
    const { setQuery, onClick } = handlers;

    return (
        <Layout title="Opskrifter">
            <Content>
                {visibility.showPlanDay && <PlanDate plan={plan.plan} date={date} />}
                {visibility.view && <Instructions source={selected.instructions} />}
                {visibility.search &&
                    <List selection verticalAlign='middle'>
                        {recipes.map(recipe => <RecipeListItem key={recipe._id}
                            id={recipe._id}
                            title={recipe.title}
                            onClick={onClick(actions.select)} />)}
                    </List>}
            </Content>
            <Actions>
                <SearchInput value={query} onChange={setQuery} placeholder="Søg efter opskrift..." />
            </Actions>
        </Layout>
    )
}
Page.getInitialProps = async (ctx) => {
    const { id, view, plan, date, firstTime, query } = ctx.query;
    auth(ctx);

    return {
        id,
        view,
        firstTime: !!firstTime,
        plan,
        date,
        query
    }
}
export default Page;