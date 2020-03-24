import Markdown from 'react-markdown';

export const Instructions = function({ source }) {
    return (
        <Markdown source={source} />
    )
}