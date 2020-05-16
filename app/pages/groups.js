import { GroupDetails } from '../components/group/GroupDetails';
import GroupInvites from '../components/group/GroupInvites';
import { GroupsOverview } from '../components/group/GroupsOverview';
import Layout from '../components/layout/Layout';
import { auth } from '../functions/authFunctions';
import useInviteActions from '../hooks/invites/useInviteActions';
import { useInvites } from '../hooks/invites/useInvites';
import { useView } from '../hooks/shared/useView';

function Page() {
    const [show, edit, goTo] = useView('/groups');
    const [state, revalidate] = useInvites();
    const [, handlers, actions] = useInviteActions(revalidate);
    const { onClick } = handlers;
    return <Layout title='Grupper'>
        <GroupInvites invites={state.invites}
            onAccept={onClick(actions.accept)}
            onDecline={onClick(actions.decline)} />
        {show.history && <GroupsOverview />}
        {show.details && <GroupDetails />}
    </Layout>
}

Page.getInitialProps = async (ctx) => {
    auth(ctx);
    return {};
}

export default Page;