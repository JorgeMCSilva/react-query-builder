export type Combinator = "AND" | "OR";
export type Operator = "" | "EQUAL" | "NOT_EQUAL" | "CURRENCY";

export enum FieldNameEnum {
  NOTHING = "",
  AMOUNT = "amount",
  NAME = "name",
  TRANSACTION_STATE = "transaction_state",
}

export enum ValueFieldTypes {
  TEXTBOX = "textbox",
}

export enum Status {
  Pending,
  InProgress,
  Completed,
  Failed,
}

export interface RulesContextType {
  combinator: Combinator;
  conditions: Array<any>;
}

export interface RulesDispatchContextType {}

export interface Rule {
  // tracking
  id: string;

  container?: string;
  fieldName: string;
  operator: Operator;
  value: string;
}

export interface RuleGroup {
  id: number;
  container?: string;
  combinator: Combinator;
  rules: Array<Rule>;
}
