import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryGroup } from "../QueryGroup";
import { Rule } from "../../../model";

describe("Counter Component", () => {
  it("Trigger change to the combinator", async () => {
    const ruleData: Rule = { id: "1", combinator: "AND", conditions: [] };

    render(<QueryGroup data={ruleData} />);

    let options = screen.getAllByTestId("cond-opt") as HTMLOptionElement[];
    expect(options[0].selected).toBeTruthy();
    expect(options[1].selected).toBeFalsy();

    fireEvent.change(screen.getByLabelText("Condition Aggregator"), {
      target: { value: "OR" },
    });

    options = screen.getAllByTestId("cond-opt") as HTMLOptionElement[];
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeTruthy();
  });

  it("Trigger view screen with multiple rules nested", async () => {
    const ruleData: Rule = { id: "1", combinator: "AND", conditions: [] };

    render(<QueryGroup data={ruleData} />);

    fireEvent.click(screen.getByLabelText("Add Rule"));

    // this is not found. I am missing the reason why.
    const fieldNames = screen.getAllByLabelText("FieldName");

    expect(fieldNames.length).toEqual(3);

    const groups = screen.getAllByLabelText("FieldName");
    expect(groups.length).toEqual(3);
  });
});
