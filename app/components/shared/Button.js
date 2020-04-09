import { Button as ButtonSUI, ButtonGroup as ButtonGroupSUI } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import './button.scss';
import { useState, useEffect } from 'react';

export const Button = function ({ type, primary, secondary, children, ...otherProps }) {
    const btnType = type || 'submit';

    return <ButtonSUI {...otherProps} type={btnType} primary={!secondary} secondary={secondary}>
        {children}
    </ButtonSUI>
}

export const ButtonClose = function ({ onClick }) {
    return <Button onClick={onClick} className="mmp-btn-close" basic circular icon='close' />
}

export const ButtonMenu = function ({ children, type, ...otherProps }) {
    return <Button {...otherProps} floated="left" type='button' basic icon='bars' />
}

export const ButtonSuccess = function ({ onClick, ...otherProps }) {
    return <Button {...otherProps} positive fluid
        type='submit'
        name='submit'
        icon='checkmark'
        onClick={onClick} />
}

export const ButtonAction = function ({ view, toggle, toggled, ...props }) {
    const router = useRouter();
    const [active, setActive] = useState(false);
    useEffect(() => {
        const isActive = (v, toggled) => {
            if (toggle) {
                if (view) {
                    return toggled && v === view;
                }
                return toggled;
            } else {
                return v === view;
            }
        }
        setActive(isActive(router.query.view, toggled));
    }, [router.query.view, toggled]);

    return <Button className={`button-action ${active ? 'active' : ''}`} {...props} />
}