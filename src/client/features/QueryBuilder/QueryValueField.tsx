import { useState } from "react";
import { RuleErrors } from "../../model";

export function QueryValueField({
  callback,
  type,
  errors,
}: {
  callback: Function;
  type: any;
  errors?: RuleErrors;
}) {
  // this throws an error when compiling???
  // return <>{type === ValueFieldTypes.TEXTBOX}</>;

  const [currency, setCurrency] = useState("");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "textbox") {
      callback(e.target.value);
      return;
    }

    callback({ amount: e.target.value, currency: currency });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  return (
    <>
      {type === "textbox" && (
        <label>
          Value
          <input
            className="query-input"
            name="valueText"
            type="text"
            onChange={handleValueChange}
          ></input>
          {Array.isArray(errors) &&
            errors.length > 0 &&
            errors[0].length > 0 && <span className="error">{errors[0]}</span>}
        </label>
      )}

      {type === "currency" && (
        <>
          <label>
            Currency
            <select
              name="valueCurrency"
              title="Currency"
              onChange={handleCurrencyChange}
            >
              <option data-testid="cur-opt" value="">
                --Select Currency--
              </option>
              <option data-testid="cur-opt" value="eur">
                EUR
              </option>
              <option data-testid="cur-opt" value="usd">
                USD
              </option>
            </select>
            {Array.isArray(errors) && errors.length > 0 && (
              <span className="error">{errors[0]}</span>
            )}
          </label>
          <label>
            Value
            <input
              className="query-input"
              name="valueText"
              type="text"
              onChange={handleValueChange}
            ></input>
            {Array.isArray(errors) && errors.length > 0 && (
              <span className="error">{errors[1]}</span>
            )}
          </label>
        </>
      )}
    </>
  );
}
