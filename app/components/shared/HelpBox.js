import { Message, Icon } from "semantic-ui-react";


export function HelpBox({ help, dismiss }) {
    if (!help) return null;
    const Content = help.text;
    return <Message warning icon onDismiss={dismiss}>
        <Icon name='help' />
        <Message.Content>
            <Message.Header>{help.header}</Message.Header>
            <Content />
        </Message.Content>
    </Message>
}