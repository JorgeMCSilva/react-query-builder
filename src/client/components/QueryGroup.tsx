import { useState } from "react";
import { Rule, RulesContextType } from "../model";
import { useRulesDispatch } from "./RulesContext";
import { QueryEdit } from "./QueryEdit";

export function QueryGroup({
  index,
  data,
  callback,
}: {
  index: number;
  data: RulesContextType;
  callback: Function;
}) {
  const [aggregator, setAggregator] = useState(data.combinator);
  const [rules, setRules] = useState<any>({
    combinator: "AND",
    conditions: [],
  });

  const dispatch = useRulesDispatch();

  console.log("init query group");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAggregator(e.target.value as any);

    setRules((prev: any) => ({ ...prev, cominator: e.target.value }));
  };

  const handleAddRuleClick = () => {
    setRules((prevRules: any) => {
      const result = {
        combinator: prevRules.combinator,
        conditions: [...prevRules.conditions],
      };
      // ensure new condition queries are at top and grouped for ease of use
      // groups always go at end
      const newRule = {
        id: Math.random().toString(36),
        fieldName: "",
        operator: "",
        value: "",
      } as any;

      result.conditions.unshift(newRule);

      // propagate above
      callback(newRule);

      return result;
    });
  };

  const handleAddGroupClick = () => {
    // setRules((prevRules: any) => {
    //   const result = {
    //     combinator: prevRules.combinator,
    //     conditions: [
    //       ...prevRules.conditions,
    //       {
    //         container: "AND",
    //         id: Math.random().toString(36),
    //         fieldName: "",
    //         operator: "",
    //         value: "",
    //       },
    //     ],
    //   };
    //   return result;
    // });

    callback({
      container: aggregator,
      id: Math.random().toString(36),
      fieldName: "",
      operator: "",
      value: "",
    });
  };

  const fieldCallback = (data: any) => {
    console.log("fieldCallback", data);
    if (data.hasOwnProperty("container")) {
      // this is a group being added
      return;
    }

    // simple field being added to group
    setRules((prevRules: any) => {
      let existingIndex = prevRules.conditions.findIndex((x) => {
        return x.id === data.id;
      });
      let result;

      if (existingIndex > -1) {
        prevRules.conditions[existingIndex] = data;
        result = {
          combinator: prevRules.combinator,
          conditions: [...prevRules.conditions],
        };

        return result;
      }

      result = {
        combinator: prevRules.combinator,
        conditions: [...prevRules.conditions, data],
      };
      return result;
    });
  };

  const groupCallback = (data: any) => {
    console.log("groupCallback", data);
  };

  const ruleElements = rules?.conditions.map((rule) => {
    // containers exist in groups
    if (rule.container) {
      return (
        <QueryGroup
          key={rule.id}
          index={index + 1}
          callback={groupCallback}
          data={{
            combinator: "AND",
            conditions: [],
          }}
        />
      );
    }

    return <QueryEdit rule={rule} key={rule.id} callback={fieldCallback} />;
  });

  return (
    <>
      <pre>{JSON.stringify(rules, null, 2)}</pre>

      <div className={"query-group-container " + `level-${index}`}>
        <div className="query-group-actions">
          <select
            title="Condition Aggregator"
            aria-label="Condition Aggregator"
            name="condition-aggregator"
            className="query-select-combinator"
            defaultValue={aggregator}
            onChange={handleChange}
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
          <button
            onClick={handleAddRuleClick}
            className="button-add"
            aria-label="Add Rule"
          >
            Rule
          </button>
          <button
            onClick={handleAddGroupClick}
            className="button-add"
            aria-label="Add Group"
          >
            Add Group
          </button>
        </div>

        {ruleElements}
      </div>
    </>
  );
}
