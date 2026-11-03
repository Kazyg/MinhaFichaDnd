import { createDnd2014Ruleset } from "./dnd2014/index";
import { createDnd2024Ruleset } from "./dnd2024/index";
import { RulesetData, RulesetVersion } from "./types";

import { getRulesetVersion } from "./regras";
export { getRulesetVersion } from "./regras";

export const getRulesetData = (version?: RulesetVersion | null): RulesetData => {
  switch (getRulesetVersion(version)) {
    case "DND_2024":
      return createDnd2024Ruleset();
    case "DND_2014":
      return createDnd2014Ruleset();
  }
};
