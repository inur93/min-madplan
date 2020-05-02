import Markdown from 'react-markdown';

export const Instructions = function ({ loading, recipe, ...props }) {

    if (loading || !recipe) return null;
    return (<div id='instructions'>
        <h2>Sådan gør du</h2>
        <Markdown source={recipe.instructions} />
    </div>
    )
}