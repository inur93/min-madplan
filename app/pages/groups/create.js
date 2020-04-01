import Layout, { Content, Actions } from "../../components/layout/Layout";
import { Input } from "../../components/shared/Input";
import { Form } from "../../components/shared/Form";
import { useState } from "react";
import { ButtonSave, ButtonSuccess } from "../../components/shared/Button";
import { List, ListItem, ListItemDelete } from "../../components/shared/List";
import { GetGroupsApi } from "../api/groupsApi";
import { auth } from "../api/auth";
import { useRouter } from "next/router";
import { useSelf } from "../../hooks/useSelf";
import { GetUsersApi } from "../api/usersApi";
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