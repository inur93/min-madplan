import Layout from '../components/layout/Layout';
import { ProfileEdit } from "../components/profile/ProfileEdit";
import { useSelf } from "../hooks/useSelf";


function Page() {
    const [self] = useSelf();
    return <Layout title='Profil'>
        <ProfileEdit user={self} />
    </Layout>
}

export default Page;