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

export type ValueType = string | Currency;
export interface Rule {
  // tracking
  id: string;

  combinator?: string;
  conditions?: Rule[];

  fieldName?: string;
  operator?: Operator;
  value?: ValueType;
  errors?: RuleErrors;
}

export interface Currency {
  amount: string;
  currency: string;
}

export interface RuleErrors {
  fieldName?: string;
  operator?: string;
  value?: string[];
}

export interface RuleGroup {
  id: number;
  combinator: Combinator;
  rules: Array<Rule>;
}

export interface RulePayload {
  combinator?: string;
  conditions: SubRulePayload[];
}

export interface SubRulePayload
  extends Omit<Rule, "id" | "conditions" | "errors"> {
  subConditions?: SubRulePayload[];
}
