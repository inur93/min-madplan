import React, { useState } from 'react';
import { Header, Modal, Button } from 'semantic-ui-react';
import { Form } from '../shared/Form';
import { ActionDropdown } from '../shared/Input';
import { useUnitOptions } from '../../hooks/useUnitOptions';

export function ShoppingItemEdit({ item, onSave, onCancel }) {
    const { name } = item;
    const [amount, setAmount] = useState(item.amount);
    const [unit, setUnit] = useState(item.unit);
    const [unitOptions] = useUnitOptions();
    const handleSave = () => {
        onSave({
            item: {
                ...item,
                amount: amount,
                unit
            }
        });
    }
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
            <Button negative icon="cancel" onClick={onCancel} />
            <Button positive icon='checkmark' onClick={handleSave} />
        </Modal.Actions>
    </Modal>);
} 