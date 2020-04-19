import Layout from '../components/layout/Layout';
import { ProfileEdit } from "../components/profile/ProfileEdit";
import { useSelf } from "../hooks/useSelf";
import { auth } from '../functions/authFunctions';


function Page() {
    const [self] = useSelf();
    return <Layout title='Profil'>
        <ProfileEdit user={self} />
    </Layout>
}

Page.getInitialProps = async function (ctx) {
    auth(ctx);
    return {};
}

export default Page;