import Layout, { Content, Actions } from '../components/layout/Layout';
import { List } from '../components/shared/List';
import { ButtonAdd, Button } from '../components/shared/Button';
import { auth } from './api';
import { useShoppingList } from '../hooks/useShoppingList';
import { ShoppingListOverview } from '../components/shoppingList/ShoppingListOverview';
import { ProductItemAutoComplete } from '../components/shared/Input';
import { ShoppingListCreate } from '../components/shoppingList/ShoppingListCreate';
import { Icon } from 'semantic-ui-react';
import { ShoppingListView } from '../components/shoppingList/ShoppingListView';

function MessageEmptyHistory() {
  return <p>Du har ikke noget indkøbsliste endnu.
    Opret en ved at trykke på <Icon name='add' /> nedenfor.
    Eller opret en madplan og efterfølgende opret en indkøbsliste derfra.</p>
}
const Page = () => {

  const [state, handlers, actions] = useShoppingList();

  const { history, selected, selectedItem, unitOptions, show, isEmpty } = state;
  const { onClick, getSuggestions } = handlers;

  console.log('show', show);

  return (
    <Layout showBackBtn={true} title='Indkøbsliste'>
      {(show.view && selected) && <ProductItemAutoComplete getSuggestions={getSuggestions}
        onSelect={onClick(actions.selectItem)}
        placeholder="Hvad skal du handle?" />}
      <Content>
        {isEmpty && <MessageEmptyHistory />}

        {show.view && <ShoppingListView list={selected} />}
        {show.history && <ShoppingListOverview lists={history} onClick={onClick(actions.showView)} />}
        {show.create && <ShoppingListCreate onSave={onClick(actions.createList)} />}
        {selectedItem && <ShoppingItemEdit item={selectedItem}
          unitOptions={unitOptions}
          onComplete={onClick(actions.updateItem)} />}


      </Content>
      <Actions>
        <Button icon='history' onClick={onClick(actions.showHistory)} />
        <Button icon='add' onClick={onClick(actions.showCreate)} />
      </Actions>
    </Layout >
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