import Layout, { Actions, Content } from '../components/layout/Layout';
import { ButtonAction } from '../components/shared/Button';
import { ShoppingListCreate } from '../components/shoppingList/ShoppingListCreate';
import { ShoppingListDetails } from '../components/shoppingList/ShoppingListDetails';
import { ShoppingListOverview } from '../components/shoppingList/ShoppingListOverview';
import { useShoppingListContextMenu } from '../hooks/shoppingList/useShoppingListContextMenu';
import { useView, views } from '../hooks/useView';
import { auth } from '../functions/authFunctions';

const Page = () => {

  const [show, edit, goto] = useView('/shopping-list');
  const [menu] = useShoppingListContextMenu();

  return (
    <Layout title={'Indkøbslister'} actions={menu}>
      <Content>
        {show.details && <ShoppingListDetails />}
        {show.history && <ShoppingListOverview />}
        {show.create && <ShoppingListCreate />}
      </Content>
      <Actions>
        <ButtonAction view={views.history}
          icon='history'
          onClick={goto.history}
        />
        {show.details && <ButtonAction view={views.details}
          toggle
          toggled={edit}
          icon='edit'
          onClick={goto.edit}
        />}
        <ButtonAction view={views.create}
          icon='add'
          onClick={goto.create}
        />
      </Actions>
    </Layout >
  )
}

Page.getInitialProps = async function (ctx) {
  auth(ctx);
}
export default Page;