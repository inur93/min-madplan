import { Icon } from "semantic-ui-react";
import { Ingredients } from "./Ingredients";
import { Instructions } from "./Instructions";
import { Loader } from "../shared/Loader";
import { useRecipeDetails } from "../../hooks/recipe/useRecipeDetails";
import { RecipeInfo } from "./RecipeInfo";


export function RecipeDetails({ loading, recipe }) {
    const [state] = useRecipeDetails();
    const Text = ({ tag }) => <p id={tag}>
        Denne side skal bl.a. indeholde hvor lang tid opskriften tager og evt andre nyttige information.
        I mellemtiden brug <Icon name='numbered list' /> og <Icon name='clipboard list' /> for at se fremgangsmåde og ingredienser.
    </p>;

    return <Loader loading={state.loading}>
        <RecipeInfo recipe={state.recipe} />
        <Ingredients recipe={state.recipe} />
        <Instructions recipe={state.recipe} />
    </Loader>
}