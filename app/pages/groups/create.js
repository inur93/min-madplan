import Layout from "../../components/layout/Layout";
import { auth } from "../api/auth";
import { GroupCreate } from "../../components/group/GroupCreate";


function Page({ firstTime }) {

    return (
        <Layout title="Opret gruppe">
            <GroupCreate />
        </Layout>
    )
}

Page.getInitialProps = async function (ctx) {
    auth(ctx);
    const { firstTime } = ctx.query;
    return {
        firstTime: firstTime == 'true'
    }
}
export default Page;