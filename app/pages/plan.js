import Layout from "../components/Layout";
import { List, ListItem, WeekplanListItem } from "../components/shared/List";


function Page() {

    return (<Layout title="Ugeplan" showBackBtn>
        <List>
            <WeekplanListItem />
            <ListItem title="Spaghetti kødsovs" description="mandag"/>
            <ListItem  title="tirsdag"/>
            <ListItem title="onsdag"/>
            <ListItem title="torsdag"/>
            <ListItem title="fredag"/>
            <ListItem title="lørdag"/>
            <ListItem title="søndag"/>
        </List>
    </Layout>)
}

export default Page;