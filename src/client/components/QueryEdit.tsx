import { useState } from "react";
import { QueryValueField } from "./QueryValueField";

export function QueryEdit({ rule }: { rule: any }) {
  // todo move this to the context perhaps so it is a global value mimicking coming from an API?
  const config: any = {
    [""]: null,
    amount: {
      operators: {
        EQUAL: {
          value: "textbox",
        },
        NOT_EQUAL: {
          value: "textbox",
        },
        CURRENCY: {
          value: "currency",
        },
      },
    },
  };

  const [fieldName, setFieldName] = useState(rule ? rule.fieldName : "");
  const [options, setOptions] = useState<any>([]);
  const [valueType, setValueType] = useState<any>(null);
  const [operatorConfig, setOperatorConfig] = useState<any>(null);

  const handleFieldNameChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldName(e.target.value);

    if (e.target.value) {
      setOptions(operatorOptions(e.target.value));
      return;
    }

    setOptions([]);
    setOperatorConfig(null);
    setValueType(null);
  };

  const handleOperatiorChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!operatorConfig[e.target.value]) {
      setValueType(null);
      return;
    }

    console.log("handleOperatiorChanged", operatorConfig[e.target.value]);
    setValueType(operatorConfig[e.target.value].value);
  };

  const operatorToReadable = (operator: string) =>
    operator
      .replace(/_/, " ")
      .toLowerCase()
      .replace(/\b\w/g, (ch) => ch.toUpperCase());

  const operatorOptions = (
    propName: string
  ): Array<
    React.DetailedHTMLProps<
      React.OptionHTMLAttributes<HTMLOptionElement>,
      HTMLOptionElement
    >
  > => {
    if (!config[propName]) {
      return [];
    }

    setOperatorConfig({ ...config[propName].operators });

    return Object.keys(config[propName].operators).map((op: string) => (
      <option value={op} key={op}>
        {operatorToReadable(op)}
      </option>
    ));
  };

  const updateValue = (data: any) => {
    console.log("updateValue", data);
  };

  return (
    <>
      <div className="query-group-query">
        <label>
          FieldName
          <select
            title="Field Name"
            name="fieldName"
            className="query-select-field"
            onChange={handleFieldNameChanged}
          >
            <option value="">--Select Field--</option>
            <option value="amount">Amount</option>
            <option value="name">Name</option>
            <option value="transaction_state,">Transaction State</option>
          </select>
        </label>

        {/*  show when fieldname is available */}
        {fieldName && (
          <label>
            Operator
            <select
              title="Operator Type"
              name="operator"
              className="query-select-operator"
              defaultValue={rule.operator}
              onChange={handleOperatiorChanged}
            >
              <option value="">--Select Operator--</option>
              {options}
            </select>
          </label>
        )}

        {/*  show when value is available */}
        {valueType && (
          <QueryValueField callback={updateValue} type={valueType} />
        )}
      </div>
    </>
  );
}
