import { useState } from "react";
import { Rule, RulesContextType } from "../model";
import { useRulesDispatch } from "./RulesContext";
import { QueryEdit } from "./QueryEdit";

export function QueryGroup({
  index,
  data,
}: {
  index: number;
  data: RulesContextType;
}) {
  const [aggregator, setAggregator] = useState(data.combinator);
  const [rules, setRules] = useState<Array<Rule>>([]);

  const dispatch = useRulesDispatch();

  // console.log("QueryGroup", index, data);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Aggregator changed to:", e.target.value);
  };

  const handleAddRuleClick = () => {
    // console.log("Add Rule clicked");
    // append rule to the data at this level
    // dispatch to provider so it can be updated
    // const dispatchObject: RulesDispatchContextType = {};
    // dispatch(dispatchObject);
    setRules((prevRules) => {
      const result = [...prevRules];
      // ensure new condition queries are at top and grouped for ease of use
      // groups always go at end
      result.unshift({
        id: Math.random().toString(36),
        fieldName: "",
        operator: "",
        value: "",
      });

      return result;
    });
  };

  const handleAddGroupClick = () => {
    // console.log("Add Group clicked");

    setRules((prevRules) => {
      return [
        ...prevRules,
        {
          container: "AND",
          id: Math.random().toString(36),
          fieldName: "",
          operator: "",
          value: "",
        },
      ];
    });
  };

  const ruleElements = rules.map((rule) => {
    // containers exist in groups
    if (rule.container) {
      return (
        <QueryGroup
          key={rule.id}
          index={index + 1}
          data={{
            combinator: "AND",
            conditions: [],
          }}
        />
      );
    }

    return <QueryEdit rule={rule} key={rule.id} />;
  });

  return (
    <>
      <div className={"query-group-container " + `level-${index}`}>
        <div className="query-group-actions">
          <div className="select">
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
            <span className="focus"></span>
          </div>
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
