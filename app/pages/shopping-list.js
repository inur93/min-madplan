import Layout, { Content, Actions } from '../components/layout/Layout';
import { ButtonAction } from '../components/shared/Button';
import { auth } from './api';
import { useShoppingList } from '../hooks/useShoppingList';
import { ShoppingListOverview } from '../components/shoppingList/ShoppingListOverview';
import { ProductItemAutoComplete } from '../components/shared/Input';
import { ShoppingListCreate } from '../components/shoppingList/ShoppingListCreate';
import { Icon } from 'semantic-ui-react';
import { ShoppingListView } from '../components/shoppingList/ShoppingListView';
import { ShoppingItemEdit } from '../components/shoppingList/ShoppingItemEdit';

function MessageEmptyHistory() {
  return <p>Du har ikke noget indkøbsliste endnu.
    Opret en ved at trykke på <Icon name='add' /> nedenfor.
    Eller opret en madplan og efterfølgende opret en indkøbsliste derfra.</p>
}
const Page = () => {

  const [state, handlers, actions] = useShoppingList();

  const { history, selected, selectedItem,
    title, 
    editSelected, unitOptions, show, isEmpty, loading } = state;
  const { onClick, getSuggestions, setEditSelected, setSelectedItem } = handlers;

  return (
    <Layout loading={loading} showBackBtn={true} title={title}>
      {(show.view && editSelected) && <ProductItemAutoComplete getSuggestions={getSuggestions}
        onSelect={onClick(actions.selectItem)}
        placeholder="Hvad skal du handle?" />}
      <Content>
        {isEmpty && <MessageEmptyHistory  />}
        {show.view && <ShoppingListView editMode={editSelected}
          list={selected}
          onClick={onClick(actions.updateItems)}
          onRemove={onClick(actions.deleteItem)}
          onEdit={onClick(actions.editItem)} />}
        {show.history && <ShoppingListOverview lists={history} onClick={onClick(actions.showView)} />}
        {show.create && <ShoppingListCreate onSave={onClick(actions.createList)} />}
        {selectedItem && <ShoppingItemEdit item={selectedItem}
          unitOptions={unitOptions}
          onSave={onClick(actions.updateItem)}
          onCancel={() => setSelectedItem(null)} />}


      </Content>
      <Actions>
        <ButtonAction view='history' icon='history' onClick={onClick(actions.showHistory)} />
        {show.view && <ButtonAction view='view' toggle toggled={editSelected} icon='edit' onClick={() => setEditSelected(!editSelected)} />}
        <ButtonAction view='create' icon='add' onClick={onClick(actions.showCreate)} />
      </Actions>
    </Layout >
  )
}
/*
 <Button icon='history' onClick={onClick(actions.showHistory)} />
        <Button icon='edit' onClick={() => setEditSelected(!editSelected)} />
        <Button icon='add' onClick={onClick(actions.showCreate)} />
*/
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