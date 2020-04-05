import { Icon } from "semantic-ui-react"


export const IconInfoCircle = (props) => {
    return <Icon.Group {...props}>
        <Icon name='circle outline' />
        <Icon name='info' size='small' />
    </Icon.Group>
}