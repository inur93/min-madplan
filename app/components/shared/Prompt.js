import { Modal, Input } from "semantic-ui-react";
import { Form, GetFormDataById } from "./Form";


export function Prompt({ header, message, inputs, handlers }) {
    const [formId] = useState(`${new Date().getTime()}`);
    const onCancel = () => {

    }
    const onAccept = () => {
        if (inputs && inputs.length) {
            const data = GetFormDataById(formId);
        }
    }
    return (<Modal centered={false} open>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
            <p>{message}</p>
            {inputs && inputs.length && <Form id={formId}>
                {inputs.map(input => {
                    if (input.type === 'dropdown') {
                        return <Form.Field>
                            <label>Valgt gruppe</label>
                            <Form.Select name='selectedGroup'
                                defaultValue={user.selectedGroup}
                                onChange={handlers.changeGroup}
                                options={state.groups.map(group => ({ key: group._id, text: group.name, value: group._id }))}
                                fluid
                                placeholder='Vælg en gruppe...' />
                        </Form.Field>
                    }
                    return <Form.Field key={input.name}>
                        {input.label && <label>{input.label}</label>}
                        <Input type={input.type || 'text'} name={input.name} defaultValue={input.defaultValue || ''} />
                    </Form.Field>
                })}
            </Form>}
        </Modal.Content>
        <Modal.Actions>
            <Button negative icon="cancel" onClick={onCancel} />
            <Button positive icon='checkmark' onClick={onAccept} />
        </Modal.Actions>
    </Modal>);
}