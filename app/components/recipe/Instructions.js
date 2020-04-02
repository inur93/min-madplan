import Markdown from 'react-markdown';

export const Instructions = function({loading, recipe }) {

    if(loading || !recipe) return null;
    return (
        <Markdown source={recipe.instructions} />
    )
}