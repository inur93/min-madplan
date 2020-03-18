import Layout from "../components/Layout";
import { List, ListItem, WeekplanListItem } from "../components/shared/List";
import { ContainerFixed } from "../components/shared/Container";


function Page() {

    const actions = [
        {name: 'forrige uge'},
        {name: 'Næste uge'}
    ]
    return (<Layout title="Ugeplan" showBackBtn actions={actions}>
        <List>
            <WeekplanListItem title="Test" date={new Date()} />
            <ListItem title="Spaghetti kødsovs" description="mandag" />
            <ListItem title="tirsdag" />
            <ListItem title="onsdag" />
            <ListItem title="torsdag" />
            <ListItem title="fredag" />
            <ListItem title="lørdag" />
            <ListItem title="søndag" />
        </List>
    </Layout>)
}

export default Page;