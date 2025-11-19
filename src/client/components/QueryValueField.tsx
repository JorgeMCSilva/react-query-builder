import { useState } from "react";

export function QueryValueField({
  callback,
  type,
}: {
  callback: any;
  type: any;
}) {
  // this throws an error when compiling???
  // return <>{type === ValueFieldTypes.TEXTBOX}</>;

  const [_value, setValue] = useState("");
  const [currency, setCurrency] = useState("");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setValue(e.target.value);

    if (type === "textbox") {
      callback(e.target.value);
      return;
    }

    callback({ amount: e.target.value, currency: currency });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
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
              <option value="">--Select Currency--</option>
              <option value="eur">EUR</option>
              <option value="usd">USD</option>
            </select>
          </label>
          <label>
            Value
            <input
              className="query-input"
              name="valueText"
              type="text"
              onChange={handleValueChange}
            ></input>
          </label>
        </>
      )}
    </>
  );
}
