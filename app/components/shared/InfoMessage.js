import { Message, Icon } from "semantic-ui-react";


export function InfoMessage({ message, dismiss }) {

    const Content = message.content;
    return <Message info icon onDismiss={dismiss}>
        <Icon name='refresh' loading={!!message.loading} />
        <Message.Content>
            <Message.Header>{message.header}</Message.Header>
            <Content />
        </Message.Content>
    </Message>
}