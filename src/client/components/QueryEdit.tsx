import { useState } from "react";
import { QueryValueField } from "./QueryValueField";

export function QueryEdit({ rule, callback }: any) {
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
  const [operator, setOperator] = useState<any>(rule ? rule.operator : "");
  const [ruleState, setRuleState] = useState<any>(rule);
  const [options, setOptions] = useState<any>([]);
  const [valueType, setValueType] = useState<any>(null);
  const [operatorConfig, setOperatorConfig] = useState<any>(null);

  const handleFieldNameChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldName(e.target.value);
    setRuleState(() => ({
      id: ruleState.id,
      fieldName: e.target.value,
      operator: null,
      value: null,
    }));

    if (e.target.value) {
      setOptions(operatorOptions(e.target.value));
      return;
    }

    setOptions([]);
    setOperatorConfig(null);
    setValueType(null);
    setRuleState(() => ({
      id: ruleState.id,
      fieldName: fieldName,
      operator: null,
      value: null,
    }));
  };

  const handleOperatiorChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!operatorConfig[e.target.value]) {
      setValueType(null);
      return;
    }

    setValueType(operatorConfig[e.target.value].value);
    setOperator(e.target.value);
    setRuleState(() => ({
      id: ruleState.id,
      fieldName: fieldName,
      operator: e.target.value,
      value: null,
    }));
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
    // setRuleState(() => {
      const result = {
        id: ruleState.id,
        fieldName: fieldName,
        operator: operator,
        value: data,
      };

      callback(result);

    //   return result;
    // });
  };

  return (
    <>
      <pre style={{ backgroundColor: "black" }}>
        QueryEdit: {JSON.stringify(ruleState, null, 2)}
      </pre>

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
