import { Button as ButtonSUI, ButtonGroup as ButtonGroupSUI } from 'semantic-ui-react';
import { useRouter } from 'next/router';

export const Button = function ({ type, primary, secondary, children, ...otherProps }) {
    const btnType = type || 'submit';

    return <ButtonSUI {...otherProps} type={btnType} primary={!secondary} secondary={secondary}>
        {children}
    </ButtonSUI>
}

export const ButtonBack = function ({ children, type, ...otherProps }) {
    const router = useRouter();
    const handleClick = () => router.back();
    return <Button {...otherProps} type='button' basic onClick={handleClick} icon='bars' />
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

export const ButtonSave = function({children, ...otherProps}){
    return <ButtonAction {...otherProps} icon="save" />;
}