import {
  Currency,
  Rule,
  RuleErrors,
  RulePayload,
  SubRulePayload,
} from "../model";

/**
 * Hacky class to mock a storage so we don't go into callback / re-render hell
 */
export class RuleStorageService {
  static rulesDataStorage: Rule;
  static callback: Function;
  static hasErrors: boolean;

  static setRoot(data: Rule) {
    RuleStorageService.rulesDataStorage = data;
  }

  static setCallback(callback: Function) {
    RuleStorageService.callback = callback;
  }

  static addOrUpdateEntryToList = (
    newEntry: Rule,
    idToAppendDataTo: string
  ) => {
    RuleStorageService._addEntryToList(
      newEntry,
      idToAppendDataTo,
      RuleStorageService.rulesDataStorage
    );

    RuleStorageService.callback();
  };

  /**
   * recursive search and insertion of a condtion inside the condition object
   * @param newEntry new data to be added to the tree
   * @param idToAppendDataTo id it needs to be inserted at
   * @param currentDataTree current data it is iterating
   * @returns true | false depending if it has inserted or not
   */
  static _addEntryToList = (
    newEntry: Rule,
    idToAppendDataTo: string,
    currentDataTree: Rule
  ): boolean => {
    if (currentDataTree.id === idToAppendDataTo) {
      currentDataTree.conditions = currentDataTree.conditions || [];
      // update rather than insert
      const foundIndex = currentDataTree.conditions.findIndex(
        (x) => x.id === newEntry.id
      );
      if (foundIndex > -1) {
        currentDataTree.conditions[foundIndex] = { ...newEntry };

        return true;
      }

      currentDataTree.conditions.push(newEntry);
      return true; // acted upon
    }

    if (currentDataTree.conditions && currentDataTree.conditions.length > 0) {
      for (const subCondition of currentDataTree.conditions) {
        const inserted = RuleStorageService._addEntryToList(
          newEntry,
          idToAppendDataTo,
          subCondition
        );
        if (inserted) return true;
      }
    }

    return false; // not found
  };

  static removeEntryFromList = (idToRemove: string) => {
    RuleStorageService._removeEntryFromList(
      idToRemove,
      RuleStorageService.rulesDataStorage
    );

    RuleStorageService.callback();
  };

  static _removeEntryFromList = (
    idToRemove: string,
    currentDataTree: Rule
  ): boolean => {
    if (!currentDataTree.conditions) return false;

    const index = currentDataTree.conditions.findIndex(
      (child) => child.id === idToRemove
    );

    if (index !== -1) {
      currentDataTree.conditions.splice(index, 1);
      return true;
    }

    for (const subCondition of currentDataTree.conditions) {
      const removed = RuleStorageService._removeEntryFromList(
        idToRemove,
        subCondition
      );
      if (removed) return true;
    }

    return false; // node not found
  };

  static validate(): Rule {
    RuleStorageService.hasErrors = false;

    RuleStorageService._validate(RuleStorageService.rulesDataStorage);

    return RuleStorageService.rulesDataStorage;
  }

  static _validate(currentDataTree: Rule): boolean {
    // not a group => validate fields
    if (!currentDataTree.combinator) {
      let hasErrors = false;
      const errors: RuleErrors = {};
      // this if can be moved out to not cause REPEAT
      if (currentDataTree.fieldName?.trim().length === 0) {
        errors.fieldName = "Field Name is required";
        hasErrors = true;
      }

      // validate one field at a time. If previous field is in error status so will the others
      if (!hasErrors && currentDataTree.operator?.trim().length === 0) {
        errors.operator = "Operator is required";
        hasErrors = true;
      }

      if (!hasErrors) {
        // currency layout to validate
        RuleStorageService._validateValue(currentDataTree, errors);
      }

      if (hasErrors) {
        currentDataTree.errors = errors;
        RuleStorageService.hasErrors = true;

        return true;
      }

      return false;
    }

    for (const subCondition of currentDataTree.conditions) {
      const hasErrors = RuleStorageService._validate(subCondition);
      if (hasErrors) return true;
    }

    return false;
  }

  static _validateValue = (currentDataTree: Rule, errors: RuleErrors): void => {
    const valueErrors = [];

    if (currentDataTree.value?.hasOwnProperty("currency")) {
      // using null as it was programatically set rather than default undefined since prop now exists

      // bad design choice. This should be a better object based on the props instead
      (currentDataTree.value as Currency).currency.trim().length === 0
        ? valueErrors.push("Currency is required")
        : valueErrors.push("");

      (currentDataTree.value as Currency).amount.trim().length === 0
        ? valueErrors.push("Amount is required")
        : valueErrors.push("");
    }

    if (
      typeof currentDataTree.value === "string" &&
      currentDataTree.value.trim().length === 0
    ) {
      valueErrors.push("Value is required");
    }

    if (valueErrors.length > 0) {
      errors.value = valueErrors;
    }
  };

  static getPayload = (): RulePayload => {
    const result: RulePayload = {
      conditions: RuleStorageService.rulesDataStorage.conditions.map((x) =>
        RuleStorageService._mapConditionsToSubConditionsPayload(x)
      ),
      combinator: RuleStorageService.rulesDataStorage.combinator,
    };

    return result;
  };

  static _mapConditionsToSubConditionsPayload = (
    currentDataTree: Rule
  ): SubRulePayload => {
    if (currentDataTree.combinator) {
      const result: SubRulePayload = {
        combinator: currentDataTree.combinator,
        subConditions: [],
      };

      for (const subCondition of currentDataTree.conditions) {
        const condToAdd =
          RuleStorageService._mapConditionsToSubConditionsPayload(subCondition);

        result.subConditions?.push(condToAdd);
      }
      return result;
    }

    // leaf node - return simple obj
    return {
      fieldName: currentDataTree.fieldName,
      operator: currentDataTree.operator,
      value: currentDataTree.value,
    };
  };

  // for tail recursion handling not existing in JS - leaving it here for example
  // static trampoline_function =
  //   (func: Function) =>
  //   (...rest_arguments) => {
  //     let result = func(...rest_arguments);
  //     while (typeof result === "function") {
  //       result = result();
  //     }
  //     return result;
  //   };
}
