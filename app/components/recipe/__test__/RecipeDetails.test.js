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
    useRecipeDetails.mockReturnValue([{
        loading: false,
        recipe: {
            title: 'første test opskrift',
            ingredients: [
                { _id: '1', name: 'kartofler', unit: 'kg', amount: 1 },
                { _id: '2', name: 'sukker', unit: 'g', amount: 2 }
            ],
            instructions: "En beskrivelse af hvordan man koger kartofler."
        }
    }])
    const tree = renderer
        .create(<RecipeDetails />)
        .toJSON();
    expect(tree).toMatchSnapshot();
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