import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { PlanDate } from "../PlanDate";
import renderer from "react-test-renderer";
import { useRecipeDetails, usePlanDay } from '../../../hooks/plan/usePlanDay';
jest.mock("../../../hooks/plan/usePlanDay");

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

describe("Plan date view on recipe", () => {
    it("no plan date selected", () => {
        usePlanDay.mockReturnValue([{ hide: true }])
        const tree = renderer
            .create(<PlanDate />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    })
    it("loading while empty", () => {
        usePlanDay.mockReturnValue([{ loading: true }])
    })

    it("showing recipe", () => {
        usePlanDay.mockReturnValue([{
            recipe: {
                title: 'En rigtig fin opskrift',
                date: '2020-04-25'
            }
        }])
    })
})
