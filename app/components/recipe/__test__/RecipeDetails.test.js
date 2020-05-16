import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { RecipeDetails } from "../RecipeDetails";
import renderer from "react-test-renderer";
import { useRecipeDetails } from '../../../hooks/recipe/useRecipeDetails';
jest.mock("../../../hooks/recipe/useRecipeDetails");

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
})

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
})

it("render headers, ingredients and instructions", () => {
    const title = 'første test opskrift';
    const ingredients = [
        { _id: '1', name: 'kartofler', unit: 'kg', amount: 1 },
        { _id: '2', name: 'sukker', unit: 'g', amount: 2 }
    ]
    useRecipeDetails.mockReturnValue([{
        loading: false,
        recipe: {
            title,
            ingredients,
            instructions: "En beskrivelse af hvordan man koger kartofler."
        }
    }])
    const tree = renderer
        .create(<RecipeDetails />)
        .toJSON();
    expect(tree).toMatchSnapshot();

    //do additional tests that verify the content
    render(<RecipeDetails />, container);

    const header = container.querySelector("#stats h2").textContent;
    expect(header).toBe(title);

    const ingredientElements = container.querySelectorAll("#ingredients .list .header");

    expect(ingredientElements[0].textContent).toBe("1 kg kartofler");
    expect(ingredientElements[1].textContent).toBe("2 g sukker");

})


it("render loading while waiting for recipe", () => {
    useRecipeDetails.mockReturnValue([{
        loading: true
    }])

    const tree = renderer
        .create(<RecipeDetails />)
        .toJSON();
    expect(tree).toMatchSnapshot();
})