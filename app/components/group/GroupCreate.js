import { Content, Actions } from "../../components/layout/Layout";
import { Input } from "../../components/shared/Input";
import { ButtonSuccess } from "../../components/shared/Button";

import { useGroupCreate } from "../../hooks/groups/useGroupCreate";
import { Button, List, Form } from "semantic-ui-react";
import { IconRemove } from "../shared/Icon";


const ListItem = ({ email, onDelete }) => {
    return (<List.Item>
        <List.Content>
            <List.Header>{email}</List.Header>
        </List.Content>
        <List.Content>
            <IconRemove onClick={onDelete} />
        </List.Content>
    </List.Item>)
}
export function GroupCreate(firstTime) {
    const [state, handlers, actions] = useGroupCreate(firstTime);
    const { name, email, sharedWith } = state;
    const { setName, setEmail, onClick } = handlers;

    return (<div>
        <Content>
            <p>
                {firstTime ? "For at komme i gang, opret en gruppe, hvor du kan invitere dine venner, familie eller kolleger. Så kan I alle se madplanen for ugen og klare indkøb"
                    : "Opret en gruppe så du kan dele din madplan og indkøbsliste med din lækkerbisken."
                }
            </p>
            <Form>
                <Form.Field required>
                    <label>Navn</label>
                    <Input name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Giv din gruppe et navn" />
                </Form.Field>
                <Form.Field>
                    <label>Tilføj medlemmer</label>
                    <Input value={email}
                        type="email"
                        name='email'
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Tilføj medlemmers email her"
                        labelPosition='right'
                        label={<Button primary onClick={e => onClick(actions.addEmail)({ e })} >Tilføj</Button>} />
                </Form.Field>
                <h3>Inviterede medlemmer</h3>
                {sharedWith.length == 0 && <p>Du har endnu ikke inviteret nogen med i gruppen</p>}
                <List>
                    {sharedWith.map((email, i) =>
                        <ListItem key={i} email={email} onDelete={() => onClick(actions.removeEmail)(email)} />)}
                </List>
                <ButtonSuccess onClick={onClick(actions.create)} />
            </Form>
        </Content>
    </div>)
}