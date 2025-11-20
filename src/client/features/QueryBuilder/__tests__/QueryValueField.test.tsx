import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryValueField } from "../QueryValueField";

describe("Counter Component", () => {
  const callback = vi.fn();

  it("When setting the value the callback should be triggered", async () => {
    render(
      <QueryValueField callback={callback} type={"textbox"} errors={{}} />
    );

    const valueInput = screen.getByLabelText("Value") as HTMLInputElement;

    fireEvent.change(valueInput, { target: { value: "23" } });

    expect(valueInput.value).toBe("23");
    expect(callback).toHaveBeenCalledWith("23");
  });

  it("Test Currency type works and is calledBack", async () => {
    render(
      <QueryValueField callback={callback} type={"currency"} errors={{}} />
    );

    fireEvent.change(screen.getByLabelText("Currency"), {
      target: { value: "eur" },
    });

    let options = screen.getAllByTestId("cur-opt") as HTMLOptionElement[];
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeTruthy();
    expect(options[2].selected).toBeFalsy();

    const valueInput = screen.getByLabelText("Value") as HTMLInputElement;

    fireEvent.change(valueInput, { target: { value: "23" } });

    expect(valueInput.value).toBe("23");
    expect(callback).toHaveBeenCalledWith({ amount: "23", currency: "eur" });
  });
});
