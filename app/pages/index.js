import MenuContainer from '../components/menu/MenuContainer';
import MenuItem from '../components/menu/MenuItem';
import { HeroItemsApi } from './api/heroItemsApi';
import { auth } from './api/auth';
import Router from 'next/router';

const IndexPage = function ({ heroItems }) {
  return (
    <main className="center">
      <MenuContainer>
        {heroItems.map(item => <MenuItem key={item.id}
          image={item.image}
          title={item.title}
          link={item.link} />)}
      </MenuContainer>
      <style jsx>{`
        main {
          width: 90%;
          max-width: 900px;
          margin: 300px auto;
          text-align: center;
        }
        .quote {
          font-family: cursive;
          color: #e243de;
          font-size: 24px;
          padding-bottom: 10px;
        }
        .author {
          font-family: sans-serif;
          color: #559834;
          font-size: 20px;
        }
      `}</style>
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