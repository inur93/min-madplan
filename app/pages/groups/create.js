import { GroupCreate } from "../../components/group/GroupCreate";
import Layout from "../../components/layout/Layout";
import { auth } from "../../functions/authFunctions";


function Page() {

    return (
        <Layout title="Opret gruppe">
            <GroupCreate />
        </Layout>
    )
}

Page.getInitialProps = async function (ctx) {
    auth(ctx);
}

export default Page;