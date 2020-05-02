import GroupInvites from '../components/group/GroupInvites';
import Layout from '../components/layout/Layout';
import useInviteActions from '../hooks/useInviteActions';
import { useInvites } from '../hooks/useInvites';
import { auth } from '../functions/authFunctions';
import { Loader } from '../components/shared/Loader';

function Page() {
    const [state, revalidate] = useInvites();
    const [, handlers, actions] = useInviteActions(revalidate);
    const { onClick } = handlers;
    return <Layout title='Gruppe invitationer'>
        <Loader loading={state.loading}>
            <GroupInvites invites={state.invites}
                onAccept={onClick(actions.accept)}
                onDecline={onClick(actions.decline)} />
        </Loader>
    </Layout>
}

Page.getInitialProps = async (ctx) => {
    auth(ctx);
    return {};
}

export default Page;