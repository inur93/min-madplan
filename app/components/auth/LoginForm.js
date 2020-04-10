import { Button, Input, Message } from "semantic-ui-react";
import { useLoginForm } from "../../hooks/useLoginForm";
import { Form } from "../shared/Form";

export function LoginForm() {
    const [state, handlers] = useLoginForm();
    return (
        <Form error={state.error} onSubmit={handlers.onLogin}>
            <Form.Field>
                <label>Brugernavn</label>
                <Input required name='username' placeholder='Brugernavn' />
            </Form.Field>
            <Form.Field>
                <label>Kodeord</label>
                <Input required name='password' type='password' placeholder='Kodeord' />
            </Form.Field>
            <Message error message="Brugernavn eller kodeord er forkert" />
            <Button primary loading={state.loading}>Login</Button>
            <a onClick={handlers.onForgotPassword}>Glemt kodeord</a>
        </Form>
    )
}