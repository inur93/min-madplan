import React, { useState } from 'react';
import { Header, Modal } from 'semantic-ui-react';
import { Button } from './Button';
import { Form } from './Form';
import { Input, ActionDropdown } from './Input';

export function EditShoppingItem({ item, unitOptions, onComplete }) {
    const {name} = item;
    const [amount, setAmount] = useState(item.amount);
    const [unit, setUnit] = useState(item.unit);
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
                    defaultValue={item.amount}
                    defaultOptionValue={item.unit}
                    options={unitOptions.map(unit => unit.name)} />
            </Form>
        </Modal.Content>
        <Modal.Actions>
            <Button negative icon="cancel" onClick={handleAction('cancel')} />
            <Button positive icon='checkmark' onClick={handleAction('save')} />
        </Modal.Actions>
    </Modal>);
} 