import { Input, Message } from "semantic-ui-react";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import { Button } from "../shared/Button";
import { Form } from "../shared/Form";


export function ForgotPassword() {
    const [state, handlers] = useForgotPassword();
    return (
        <Form success={state.success} onSubmit={handlers.onSubmit}>
            <p>Indtast den mail adresse du har registreret din bruger med.</p> 
            <p>Hvis mail adressen findes i vores system, vil du få et link hvor du kan nulstille din kode.</p>
            <Form.Field required>
                <label>Email</label>
                <Input name='email' placeholder='Email' />
            </Form.Field>
            <Button loading={state.loading}>Nulstil kodeord</Button>
            <Message success content="Du vil modtage en mail fra os inden længe. Klik på linket i mailen, og du vil kunne vælge en ny adgangskode." />
        </Form>
    )
}