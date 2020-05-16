import Layout, { Actions, Content } from '../components/layout/Layout';
import { ButtonAction } from '../components/shared/Button';
import { ShoppingListCreate } from '../components/shoppingList/ShoppingListCreate';
import { ShoppingListDetails } from '../components/shoppingList/ShoppingListDetails';
import { ShoppingListOverview } from '../components/shoppingList/ShoppingListOverview';
import { useShoppingListContextMenu } from '../hooks/shoppingList/useShoppingListContextMenu';
import { useView, views } from '../hooks/shared/useView';
import { auth } from '../functions/authFunctions';
import { useHelp } from '../hooks/shared/useHelp';
import { HelpBox } from '../components/shared/HelpBox';

const Page = () => {

  const [show, edit, goto] = useView('/shopping-list');
  const [menu] = useShoppingListContextMenu();
  const [help, dismiss] = useHelp();
  return (
    <Layout title={'Indkøbslister'} actions={menu}>
      <Content>
        <HelpBox help={help} dismiss={dismiss} />
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
        {show.history &&
          <ButtonAction view={views.create}
            icon='add'
            onClick={goto.create}
          />}
      </Actions>
    </Layout >
  )
}

Page.getInitialProps = async function (ctx) {
  auth(ctx);
  return {}
}
export default Page;