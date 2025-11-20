import { MouseEventHandler, useState } from "react";
import { Rule } from "../../model";
import { RuleStorageService } from "../../services/RuleStorageService";
import { QueryEdit } from "./QueryEdit";

export function QueryGroup({ data }: { data: Rule }) {
  const [combinator, setCombinator] = useState(data.combinator);
  const [rules, setRules] = useState<Rule>(data);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCombinator(e.target.value as string);

    setRules((prev: Rule) => ({ ...prev, combinator: e.target.value }));
  };

  const handleAddRuleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const newRule = {
      id: Math.random().toString(36),
      fieldName: "",
      operator: "",
      value: "",
      conditions: [],
    } as Rule;

    // propagate to storage
    RuleStorageService.addOrUpdateEntryToList(newRule, rules.id);
  };

  const handleAddGroupClick = () => {
    // propagate to storage
    RuleStorageService.addOrUpdateEntryToList(
      {
        combinator: "AND",
        id: Math.random().toString(36),
        fieldName: "",
        operator: "",
        value: "",
        conditions: [],
      },
      rules.id
    );
  };

  const fieldCallback = (data: Rule) => {
    if (data.hasOwnProperty("combinator")) {
      // this is a group being added
      return;
    }

    RuleStorageService.addOrUpdateEntryToList(data, rules.id);
  };

  // const ruleElements2 = useMemo(() => {
  //   return rules?.conditions.map((rule: Rule) => {
  //     // containers exist in groups
  //     if (rule.combinator) {
  //       return <QueryGroup key={rule.id} data={rule} />;
  //     }

  //     return <QueryEdit rule={rule} key={rule.id} callback={fieldCallback} />;
  //   });
  // }, rules);

  // const RuleElements1 = memo(({ rule }: { rule: Rule }) => {
  //   if (rule.combinator) {
  //     <QueryGroup key={rule.id} data={rule} />;
  //   }

  //   return <QueryEdit rule={rule} key={rule.id} callback={fieldCallback} />;
  // });

  const ruleElements = rules.conditions?.map((rule: Rule) => {
    // containers exist in groups
    if (rule.combinator) {
      return <QueryGroup key={rule.id} data={rule} />;
    }

    return <QueryEdit rule={rule} key={rule.id} callback={fieldCallback} />;
  });

  return (
    <>
      {/* <pre>{JSON.stringify(rules, null, 2)}</pre> */}

      <div className="query-group-container">
        <div className="query-group-actions">
          <select
            title="Condition Aggregator"
            aria-label="Condition Aggregator"
            name="condition-aggregator"
            className="query-select-combinator"
            defaultValue={combinator}
            onChange={handleChange}
          >
            <option data-testid="cond-opt" value="AND">AND</option>
            <option data-testid="cond-opt" value="OR">OR</option>
          </select>
          <button
            onClick={(e) => handleAddRuleClick(e)}
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
        {/* {ruleElements2} */}
        {/* {rules?.conditions.map((rule: Rule) => {
          return <RuleElements1 rule={rule} />;
        })} */}
      </div>
    </>
  );
}
