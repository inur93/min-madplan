import { Button, Input, Message } from "semantic-ui-react";
import { useLoginForm } from "../../hooks/auth/useLoginForm";
import { Form } from "../shared/Form";

export function LoginForm() {
    const [state, handlers] = useLoginForm();
    return (
        <Form error={!!state.error} onSubmit={handlers.onLogin}>
            <Form.Field>
                <label>Brugernavn</label>
                <Input required name='username' placeholder='Brugernavn' autoComplete='username' />
            </Form.Field>
            <Form.Field>
                <label>Kodeord</label>
                <Input required name='password' type='password' placeholder='Kodeord'  autoComplete='current-password'/>
            </Form.Field>
            <Message error >{state.error}</Message>
            <Button primary loading={state.loading}>Login</Button>
            <a onClick={handlers.onForgotPassword}>Glemt kodeord</a>
        </Form>
    )
}