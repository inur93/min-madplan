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


function Page({ firstTime }) {
    const [name, setName] = useState("");
    const [sharedWith, setSharedWith] = useState([]);
    const [userValue, setUserValue] = useState("");
    const router = useRouter();
    const api = GetGroupsApi();
    const usersApi = GetUsersApi();
    const [self, revalidate] = useSelf();

    const addUser = (e) => {
        e.preventDefault();
        if (!userValue) return;
        setSharedWith([...sharedWith, userValue]);
        setUserValue("");
    }
    const removeUser = (user) => () => {
        const updated = [...sharedWith];
        updated.splice(updated.indexOf(user), 1);
        setSharedWith(updated);
    }

    const create = async () => {
        const group = await api.create({
            name,
            groupInvites: sharedWith.map(email => ({ email }))
        });
        if (firstTime) {
            await usersApi.update(self._id, {
                selectedGroup: group._id
            });
            router.push(`/plan?firstTime=true`);
        } else {
            router.push('/');
        }

    }
    return (
        <Layout title="Opret gruppe">
            <form onSubmit={addUser}>
                <Content>

                    <p>
                        {firstTime ? "For at komme i gang, opret en gruppe, hvor du kan invitere dine venner, familie eller kolleger. Så kan I alle se madplanen for ugen og klare indkøb"
                            : "Opret en gruppe så du kan dele din madplan og indkøbsliste med din lækkerbisken."
                        }
                    </p>
                    <Input name="name"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Giv din gruppe et navn" />

                    <Input value={userValue}
                        type="email"
                        onChange={e => setUserValue(e.target.value)}
                        placeholder="Tilføj mail på en du vil dele med"
                        action="Tilføj" />

                    <h3>Inviterede medlemmer</h3>
                    {sharedWith.length == 0 && <p>Du har endnu ikke inviteret nogen med i gruppen</p>}
                    <List>
                        {sharedWith.map((user, i) =>
                            <ListItemDelete key={i} title={user} onDelete={removeUser(user)} />)}
                    </List>
                </Content>
            </form>
            <Actions>
                <ButtonSuccess onClick={create} />
            </Actions>
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