import React, { useState } from 'react';
import { Header, Modal } from 'semantic-ui-react';
import { Button } from './Button';
import { Form } from './Form';
import { Input, ActionDropdown } from './Input';

export function EditShoppingItem({ item, unitOptions, onComplete }) {
    const {amount: defaultAmount, unit: defaultUnit, name} = item;
    const [amount, setAmount] = useState(defaultAmount);
    const [unit, setUnit] = useState(defaultUnit);
    const handleAction = type => () => onComplete(type, { amount, unit });
    const handleChange = ({ input, action }) => {
        setAmount(input);
        setUnit(action);
    }

    return (<Modal centered={false} open>
        <Modal.Header>{name}</Modal.Header>
        <Modal.Content image>
            <Form>
                <ActionDropdown name="amount"
                    onChange={handleChange}
                    defaultValue={defaultAmount}
                    defaultOptionValue={defaultUnit}
                    options={unitOptions.map(unit => unit.name)} />
            </Form>
        </Modal.Content>
        <Modal.Actions>
            <Button negative icon="cancel" onClick={handleAction('cancel')} />
            <Button positive icon='checkmark' onClick={handleAction('save')} />
        </Modal.Actions>
    </Modal>);
} 