import React from 'react';
import { useRecipeDetails } from "../../hooks/recipe/useRecipeDetails";
import { Loader } from "../shared/Loader";
import { Page } from "../shared/Page";
import { ScrollView } from "../shared/ScrollView";
import { Ingredients } from "./Ingredients";
import { Instructions } from "./Instructions";
import { RecipeInfo } from "./RecipeInfo";


export function RecipeDetails() {
    const [state] = useRecipeDetails();
    
    return <Loader loading={state.loading}>
        <Page>
            <ScrollView>
                <RecipeInfo recipe={state.recipe} />
                <Ingredients recipe={state.recipe} />
                <Instructions recipe={state.recipe} />
            </ScrollView>
        </Page>
    </Loader>
}