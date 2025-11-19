import { createContext, useContext, useReducer } from "react";
import { Rule, RulesContextType, RulesDispatchContextType } from "../model";
import { QUERY_BUILDER } from "../constants";

const RulesContext = createContext<RulesContextType>({
  combinator: "AND",
  conditions: [],
});
const RulesDispatchContext = createContext<RulesDispatchContextType>({});

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
function rulesReducer(rules: any, action: any) {
  switch (action.type) {
    case QUERY_BUILDER.DISPATCH_ACTIONS.ADDED: {
      return [
        ...rules,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }

    case QUERY_BUILDER.DISPATCH_ACTIONS.CHANGED: {
      return rules.map((t: any) => {
        if (t.id === action.task.id) {
          return action.task;
        }
        return t;
      });
    }

    case QUERY_BUILDER.DISPATCH_ACTIONS.DELETED: {
      return rules.filter((t: any) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialRules: Rule[] = [];
