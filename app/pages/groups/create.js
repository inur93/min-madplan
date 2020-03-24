import Layout, { Content, Actions } from "../../components/layout/Layout";
import { Input } from "../../components/shared/Input";
import { Form } from "../../components/shared/Form";
import { useState } from "react";
import { ButtonSave, ButtonSuccess } from "../../components/shared/Button";
import { List, ListItem, ListItemDelete } from "../../components/shared/List";
import { GetGroupsApi } from "../api/groupsApi";


function Page({ }) {
    const [name, setName] = useState("");
    const [sharedWith, setSharedWith] = useState([]);
    const [userValue, setUserValue] = useState("");
    const api = GetGroupsApi();
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
        await api.create({
            name,
            groupInvites: sharedWith.map(email => ({ email }))
        });

    }
    return (
        <Layout title="Opret gruppe">
            <form onSubmit={addUser}>
                <Content>
                    <p>
                        Opret en gruppe så du kan dele din madplan og indkøbsliste med din lækkerbisken.
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

export default Page;