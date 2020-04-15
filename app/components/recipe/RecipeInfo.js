import { Icon } from "semantic-ui-react";



export function RecipeInfo({ recipe }) {

    return (<div id='stats'>
        <h2>{recipe.title}</h2>
        <p>
            Denne side skal bl.a. indeholde hvor lang tid opskriften tager og evt andre nyttige information.
    I mellemtiden brug <Icon name='numbered list' /> og <Icon name='clipboard list' /> for at se fremgangsmåde og ingredienser.
</p></div>)
}