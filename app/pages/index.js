import MenuContainer from '../components/menu/MenuContainer';
import MenuItem from '../components/menu/MenuItem';
import { HeroItemsApi } from './api/heroItemsApi';
import { auth } from './api/auth';
import Router from 'next/router';

const IndexPage = function ({ heroItems }) {
  return (
    <main>
      <MenuContainer>
        {heroItems.map(item => <MenuItem key={item.id}
          image={item.image}
          title={item.title}
          link={item.link} />)}
      </MenuContainer>
    </main>
  );
}

IndexPage.getInitialProps = async function (ctx) {
  const token = auth(ctx);
  const items = await HeroItemsApi().heroItems();
  return {
    token,
    heroItems: items
  };
}
export default IndexPage;