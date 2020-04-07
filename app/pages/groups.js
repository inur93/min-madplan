import Layout from '../components/layout/Layout';
import { useInvites } from '../hooks/useInvites';
import GroupInvites from '../components/group/GroupInvites';
import useInviteActions from '../hooks/useInviteActions';

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

export default Page;