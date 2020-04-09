import { Icon } from "semantic-ui-react"

export const IconInfoCircle = (props) => {
    return <Icon.Group {...props}>
        <Icon name='circle outline' />
        <Icon name='info' size='small' />
    </Icon.Group>
}

export const IconRemove = (props) => {
    return <Icon {...props} name='remove' color='red' />
}

export const IconInfo = (props) => {
    return <Icon {...props} name='info circle' color='blue' />
}

export const IconCheck = (props) => {
    return <Icon {...props} name='check circle outline' color='green' />
}

export const IconEdit = (props) => {
    return <Icon {...props} name='edit' />
}