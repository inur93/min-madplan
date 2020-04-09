import Layout from '../components/layout/Layout';
import { useSelf } from "../hooks/useSelf";
import { ProfileEdit } from "../components/profile/ProfileEdit";


function Page() {
    const [self] = useSelf();
    return <Layout title='Profil'>
        <ProfileEdit user={self} />
    </Layout>
}

export default Page;