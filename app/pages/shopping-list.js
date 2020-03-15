import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import {GetShoppingListApi} from './api/shoppingListsApi';
import { List, ListItem } from '../components/shared/List';
import {ButtonAdd} from '../components/shared/Button';
import { auth } from './api/auth';
import { formatDate } from '../stores/dateStore';


const ShoppinglistListItem = function({item}){
  const format = "d. MMM";
  const validFrom = new Date(item.validFrom);
  const validTo = new Date(item.validTo);
  const description = `${formatDate(validFrom, format)} - ${formatDate(validTo, format)}`;
  const link = `/shopping-list/${item.id}`;
  return <ListItem title={item.name} description={description} link={link}/>;
}

const Page = () => {
    const router = useRouter();
    const handleCreateNew = () => router.push("/shopping-list/create");
    var data = GetShoppingListApi().myShoppingLists();
    const {shoppingLists, isLoading} = data;
    
    if (isLoading) return "loading...";

    const isEmpty = !shoppingLists || shoppingLists.length == 0;
    return (
        <Layout showBackBtn={true} title='Indkøbsliste'>
          {isEmpty && <p>Du har ikke noget indkøbsliste endnu. Opret en ved at trykke på + nedenfor</p>}
            <List>
                {shoppingLists.map(list => <ShoppinglistListItem key={list.id} item={list} />)}
            </List>
            <ButtonAdd onClick={handleCreateNew} />
        </Layout>
    )
}

Page.getInitialProps = async (ctx) => {
    const token = auth(ctx);
    return {}
  }
export default Page;


/*
 <Item.Group link>
    <Item>
      <Item.Image size='tiny' src='/images/avatar/large/stevie.jpg' />

      <Item.Content>
        <Item.Header>Stevie Feliciano</Item.Header>
        <Item.Description>{paragraph}</Item.Description>
      </Item.Content>
    </Item>
*/