import { describe, it, expect } from "vitest";
import { RuleStorageService } from "../RuleStorageService";

describe("CustomStorage Service", () => {
  it("should insert an entry to a very complex structure", () => {
    RuleStorageService.setRoot({
      id: "1",
      combinator: "AND",
      conditions: [
        {
          id: "1.1",
          combinator: "AND",
          conditions: [],
        },
        {
          id: "1.2",
          combinator: "AND",
          conditions: [
            {
              id: "1.2.1",
              combinator: "AND",
              conditions: [
                {
                  id: "1.2.1.1",
                  combinator: "AND",
                  conditions: [],
                },
              ],
            },
          ],
        },
        {
          id: "1.3",
          conditions: [],
        },
      ],
    });
    RuleStorageService.callback = () => null;

    RuleStorageService.addOrUpdateEntryToList(
      {
        id: "newId",
        combinator: "AND",
        conditions: [],
      },
      "1.2.1.1"
    );

    expect(RuleStorageService.rulesDataStorage).toEqual({
      id: "1",
      combinator: "AND",
      conditions: [
        {
          id: "1.1",
          combinator: "AND",
          conditions: [],
        },
        {
          id: "1.2",
          combinator: "AND",
          conditions: [
            {
              id: "1.2.1",
              combinator: "AND",
              conditions: [
                {
                  id: "1.2.1.1",
                  combinator: "AND",
                  conditions: [
                    {
                      id: "newId",
                      combinator: "AND",
                      conditions: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "1.3",
          conditions: [],
        },
      ],
    });
  });

  it("should remove an entry to a very complex structure", () => {
    RuleStorageService.setRoot({
      id: "1",
      combinator: "AND",
      conditions: [
        {
          id: "1.1",
          combinator: "AND",
          conditions: [],
        },
        {
          id: "1.2",
          combinator: "AND",
          conditions: [
            {
              id: "1.2.1",
              combinator: "AND",
              conditions: [
                {
                  id: "1.2.1.1",
                  combinator: "AND",
                  conditions: [],
                },
                {
                  id: "1.2.1.2",
                  combinator: "AND",
                  conditions: [],
                },
                {
                  id: "1.2.1.3",
                  combinator: "AND",
                  conditions: [],
                },
              ],
            },
          ],
        },
        {
          id: "1.3",
          conditions: [],
        },
      ],
    });
    RuleStorageService.callback = () => null;

    RuleStorageService.removeEntryFromList("1.2.1.2");

    expect(RuleStorageService.rulesDataStorage).toEqual({
      id: "1",
      combinator: "AND",
      conditions: [
        {
          id: "1.1",
          combinator: "AND",
          conditions: [],
        },
        {
          id: "1.2",
          combinator: "AND",
          conditions: [
            {
              id: "1.2.1",
              combinator: "AND",
              conditions: [
                {
                  id: "1.2.1.1",
                  combinator: "AND",
                  conditions: [],
                },
                {
                  id: "1.2.1.3",
                  combinator: "AND",
                  conditions: [],
                },
              ],
            },
          ],
        },
        {
          id: "1.3",
          conditions: [],
        },
      ],
    });
  });
});
