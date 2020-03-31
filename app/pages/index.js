import MenuContainer from '../components/menu/MenuContainer';
import MenuItem from '../components/menu/MenuItem';
import { GetUsersApi, auth, GetPageSettingsApi } from './api';

const IndexPage = function ({ shoppingListImage, planImage, recipesImage }) {
  return (
    <main>
      <MenuContainer>
        <MenuItem image={shoppingListImage}
          title="Indkøbsliste"
          link="/shopping-list" />
        <MenuItem image={planImage}
          title="Ugeplan"
          link="/plan" />
        <MenuItem image={recipesImage}
          title="Opskrifter"
          link="/recipes" />
      </MenuContainer>
    </main>
  );
}

IndexPage.getInitialProps = async function (ctx) {
  auth(ctx); //make sure user is logged in - will automatically be redirected to login if not

  const [self, frontPage] = await Promise.all([
    GetUsersApi(ctx).self(),
    GetPageSettingsApi(ctx).frontPage()
  ]);

  if (!self.selectedGroup) {
    ctx.res.writeHead(302, { Location: '/groups/create?firstTime=true' })
    ctx.res.end()
  }
  return {
    ...frontPage,
  };
}
export default IndexPage;