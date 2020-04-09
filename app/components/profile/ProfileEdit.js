import { Form } from "../shared/Form";
import { Input, Message, Image, Segment } from "semantic-ui-react";
import { ButtonSuccess } from "../shared/Button";
import { useProfile } from "../../hooks/useProfile";
import { InputFile } from "../shared/Input";
import { absUrl } from "../../functions/imageFunctions";
import './profile-edit.scss';

export function ProfileEdit({ user }) {

    const [state, handlers] = useProfile(user);

    if (!user) return null;
    return <Form success={state.saved} onSubmit={handlers.onSave}>
        <Segment>
            <Image src={state.image || absUrl(state.fallbackImage.url)} size='small' circular centered />
            <div className='image-actions'>
                <InputFile label='Vælg billede' onChange={handlers.onImageChange} />
                {state.image && <a onClick={handlers.removeImage}>fjern billede</a>}
            </div>
        </Segment>
        <Form.Field>
            <label>Fornavn</label>
            <Input name='firstname' defaultValue={user.firstname || ''} />
        </Form.Field>
        <Form.Field>
            <label>Efternavn</label>
            <Input name='lastname' defaultValue={user.lastname || ''} />
        </Form.Field>
        <Form.Field>
            <label>Valgt gruppe</label>
            <Form.Select name='selectedGroup'
                defaultValue={user.selectedGroup}
                onChange={handlers.changeGroup}
                options={state.groups.map(group => ({ key: group._id, text: group.name, value: group._id }))}
                fluid
                placeholder='Vælg en gruppe...' />
        </Form.Field>
        <ButtonSuccess />

        <Message success
            header='Dine ændringer er gemt' />
    </Form >
}