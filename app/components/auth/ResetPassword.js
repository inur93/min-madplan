import { Message, Input } from "semantic-ui-react";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import { Button } from "../shared/Button";
import { Form } from "../shared/Form";


export function ResetPassword() {
    const [state, handlers] = useResetPassword();
    return (
        <Form success={state.success} onSubmit={handlers.onSubmit}>
            <Form.Field required>
                <label>Kodeord</label>
                <Input type='password' name='password' placeholder='Kodeord' />
            </Form.Field>
            <Form.Field required>
                <label>Bekræft kodeord</label>
                <Input type='password' name='passwordConfirmation' placeholder='Bekræft kodeord' />
            </Form.Field>
            <Button loading={state.loading}>Opdater kodeord</Button>
            <Message success content="Tillykke, dit kodeord er ændret. Du vil blive sendt til login siden så du kan logge ind igen." />
        </Form>
    )
}