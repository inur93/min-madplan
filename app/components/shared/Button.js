import { Button as ButtonSUI, ButtonGroup as ButtonGroupSUI } from 'semantic-ui-react';
import { useRouter } from 'next/router';

export const Button = function ({ type, primary, secondary, children, ...otherProps }) {
    const btnType = type || 'submit';

    return <ButtonSUI {...otherProps} type={btnType} primary={!secondary} secondary={secondary}>
        {children}
    </ButtonSUI>
}

export const ButtonClose = function ({ onClick }) {
    return <Button onClick={onClick} className="mmp-btn-close" basic circular icon='close' />
}
export const ButtonBack = function ({ children, type, ...otherProps }) {
    const router = useRouter();
    const handleClick = () => router.back();
    return <Button {...otherProps} floated="left" type='button' basic onClick={handleClick} icon='bars' />
}

export const ButtonMenu = function ({ children, type, ...otherProps }) {
    return <Button {...otherProps} floated="left" type='button' basic icon='bars' />
}

const ButtonAction = function ({ children, type, ...otherProps }) {
    return <div >
        <Button {...otherProps} size='huge' type={type || 'button'} circular floated="right" className="button-action" />
        <style jsx>{`
            div > :global(.button-action) {
                position: absolute;
                right: 2rem;
                bottom: 2rem;
            }
        `}</style>
    </div>
}
export const ButtonAdd = function ({ children, ...otherProps }) {
    return <ButtonAction {...otherProps} icon="add" />;
}

export const ButtonSave = function ({ children, ...otherProps }) {
    return <ButtonAction {...otherProps} icon="save" />;
}

export const ButtonSuccess = function ({ onClick }) {
    return <Button positive icon='checkmark' onClick={onClick} />
}
