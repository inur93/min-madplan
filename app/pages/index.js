import MenuContainer from '../components/menu/MenuContainer';
import MenuItem from '../components/menu/MenuItem';
import { GetUsersApi, auth, GetPageSettingsApi } from './api';
import { GroupCreate } from '../components/group/GroupCreate';
import { Content } from '../components/layout/Layout';
import { Segment } from 'semantic-ui-react';
import { useInvitesCount } from '../hooks/useInvitesCount';
import { GroupInvitesWrapped } from '../components/group/GroupInvites';

const IndexPage = function ({ self, shoppingListImage, planImage, recipesImage }) {

  const {data: count} = useInvitesCount();
  const firstTime = !self.selectedGroup;
  return (
    <main>
      {firstTime && <Segment>
        {count ? <GroupInvitesWrapped />
          : <GroupCreate firstTime />
        }
      </Segment>}

      {!firstTime && <MenuContainer>
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
      }
    </main>
  );
}

IndexPage.getInitialProps = async function (ctx) {
  auth(ctx); //make sure user is logged in - will automatically be redirected to login if not

  const [self, frontPage] = await Promise.all([
    GetUsersApi(ctx).self(),
    GetPageSettingsApi(ctx).frontPage()
  ]);

  return {
    self,
    ...frontPage,
  };
}
export default IndexPage;