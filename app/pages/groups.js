import GroupInvites from '../components/group/GroupInvites';
import Layout from '../components/layout/Layout';
import useInviteActions from '../hooks/useInviteActions';
import { useInvites } from '../hooks/useInvites';
import { auth } from '../functions/authFunctions';

function Page() {
    const [invites, revalidate] = useInvites();
    const [state, handlers, actions] = useInviteActions(revalidate);
    const { onClick } = handlers;
    return <Layout title='Gruppe invitationer'>
        <GroupInvites invites={invites}
            onAccept={onClick(actions.accept)}
            onDecline={onClick(actions.decline)} />
    </Layout>
}

Page.getInitialProps = async (ctx) => {
    auth(ctx);
    return {};
}

export default Page;