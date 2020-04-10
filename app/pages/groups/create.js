import { auth } from "../../api";
import { GroupCreate } from "../../components/group/GroupCreate";
import Layout from "../../components/layout/Layout";


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