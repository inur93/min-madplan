import { Segment } from 'semantic-ui-react';
import { GroupCreate } from '../components/group/GroupCreate';
import { GroupInvitesWrapped } from '../components/group/GroupInvites';
import MenuItem from '../components/menu/MenuItem';
import { useInvitesCount } from '../hooks/useInvitesCount';
import { useSelf } from '../hooks/useSelf';
import { GetPageSettingsApi } from '../_api';
import { auth } from '../functions/authFunctions';

const IndexPage = function (props) {
  const { shoppingListImage, planImage, recipesImage } = props;
  const { data: count } = useInvitesCount();
  const [self] = useSelf();
  const firstTime = (self && !self.selectedGroup);

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
  auth(ctx);
  const frontPage = await GetPageSettingsApi().get('frontPage');

  return {
    ...frontPage,
  };
}
export default IndexPage;