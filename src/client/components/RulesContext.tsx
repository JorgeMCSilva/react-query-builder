import { createContext, useContext, useReducer } from "react";
import { Rule, RulesContextType, RulesDispatchContextType } from "../model";
import { QUERY_BUILDER } from "../constants";

const RulesContext = createContext<any>({
  combinator: "AND",
  conditions: [],
});
const RulesDispatchContext = createContext<any>({});

const initialRules: Rule[] = [];

export function RulesProvider({ children }: { children: React.ReactNode }) {
  const [rules, dispatch] = useReducer(rulesReducer, initialRules);

  return (
    <RulesContext.Provider value={rules}>
      <RulesDispatchContext.Provider value={dispatch}>
        {children}
      </RulesDispatchContext.Provider>
    </RulesContext.Provider>
  );
}

export function useRules() {
  return useContext(RulesContext);
}

export function useRulesDispatch() {
  return useContext(RulesDispatchContext);
}

// TODO TYPE
function rulesReducer(prevRules: any, { rule, type, groupToAdd }: any) {
  console.log("REDUCER", rule, type, prevRules);

  switch (type) {
    case QUERY_BUILDER.DISPATCH_ACTIONS.ADDED: {
      return [
        ...prevRules,
        {
          id: Math.random().toString(36),
          text: rule.text,
          done: false,
        },
      ];
    }

    case QUERY_BUILDER.DISPATCH_ACTIONS.CHANGED: {
      console.log("changed");

      break;
    }

    case QUERY_BUILDER.DISPATCH_ACTIONS.DELETED: {
      console.log("deleted");

      break;
    }
    default: {
      throw Error("Unknown action: " + type);
    }
  }
}
