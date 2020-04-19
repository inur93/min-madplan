import { Segment } from 'semantic-ui-react';
import { auth, GetPageSettingsApi, GetUsersApi } from '../_api';
import { GroupCreate } from '../components/group/GroupCreate';
import { GroupInvitesWrapped } from '../components/group/GroupInvites';
import MenuItem from '../components/menu/MenuItem';
import { useInvitesCount } from '../hooks/useInvitesCount';

const IndexPage = function (props) {
  const { self, shoppingListImage, planImage, recipesImage } = props;
  const { data: count } = useInvitesCount();
  const firstTime = !self.selectedGroup;
  return (
    <main>
      {firstTime && <Segment>
        {count ? <GroupInvitesWrapped />
          : <GroupCreate firstTime />
        }
      </Segment>}

      {!firstTime && <div className='menu-container'>
        <MenuItem image={shoppingListImage}
          title="Indkøbsliste"
          link="/shopping-list" />
        <MenuItem image={planImage}
          title="Ugeplan"
          link="/plan" />
        <MenuItem image={recipesImage}
          title="Opskrifter"
          link="/recipes" />
      </div>
      }
    </main>
  );
}

IndexPage.getInitialProps = async function (ctx) {
  //make sure user is logged in - will automatically be redirected to login if not
  auth(ctx);

  const [self, frontPage] = await Promise.all([
    GetUsersApi(ctx).self(),
    GetPageSettingsApi(ctx).frontPage()
  ]);

  if (!self) {
    ctx.res.writeHead(302, { Location: '/login' })
    ctx.res.end();
  }

  return {
    self,
    ...frontPage,
  };
}
export default IndexPage;