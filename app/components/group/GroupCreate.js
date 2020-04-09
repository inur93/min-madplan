import { Content, Actions } from "../../components/layout/Layout";
import { Input } from "../../components/shared/Input";
import { ButtonSuccess } from "../../components/shared/Button";
import { ListItemDelete } from "../../components/shared/List";
import { useGroupCreate } from "../../hooks/useGroupCreate";
import { Button, List } from "semantic-ui-react";

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
            <Input name="name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Giv din gruppe et navn" />

            <Input value={email}
                type="email"
                name='email'
                onChange={e => setEmail(e.target.value)}
                placeholder="Tilføj mail på en du vil dele med"
                labelPosition='right'
                label={<Button onClick={e => onClick(actions.addEmail)({ e })} >Tilføj</Button>} />

            <h3>Inviterede medlemmer</h3>
            {sharedWith.length == 0 && <p>Du har endnu ikke inviteret nogen med i gruppen</p>}
            <List>
                {sharedWith.map((email, i) =>
                    <ListItemDelete key={i} title={email} onDelete={() => onClick(actions.removeEmail)(email)} />)}
            </List>
        </Content>
        <Actions>
            <ButtonSuccess onClick={onClick(actions.create)} />
        </Actions>
    </div>)
}