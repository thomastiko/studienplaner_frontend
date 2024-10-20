import wisoWinf23Checker from "./checkers/plans-new/wiso-winf-23";
import wisoBwl23Checker from "./checkers/plans-new/wiso-bwl-23";
import wisoIbw23Checker from "./checkers/plans-new/wiso-ibw-23";
import wisoVwl23Checker from "./checkers/plans-new/wiso-vwl-23";
import wisoWupol23Checker from "./checkers/plans-new/wiso-wupol-23";

import wisoWinfChecker from "./checkers/plans-old/wiso-winf";
import wisoBwlChecker from "./checkers/plans-old/wiso-bwl";
import wisoIbwChecker from "./checkers/plans-old/wiso-ibw";
import wisoVwlChecker from "./checkers/plans-old/wiso-vwl";
import wisoSzChecker from "./checkers/plans-old/wiso-sz";

import wire23Checker from "./checkers/plans-new/wire-23";

import wireChecker from "./checkers/plans-old/wire";

import bbeChecker from "./checkers/plans-old/bbe";

export function getChecker(study_id) {
  switch (study_id) {
    case "wiso-winf-23":
      return wisoWinf23Checker;
    case "wiso-bwl-23":
      return wisoBwl23Checker;
    case "wiso-ibw-23":
      return wisoIbw23Checker;
    case "wiso-vwl-23":
      return wisoVwl23Checker;
    case "wiso-wupol-23":
      return wisoWupol23Checker;

    case "wiso-winf":
      return wisoWinfChecker;
    case "wiso-bwl":
      return wisoBwlChecker;
    case "wiso-ibw":
      return wisoIbwChecker;
    case "wiso-vwl":
      return wisoVwlChecker;
    case "wiso-sz":
      return wisoSzChecker;

    case "wire-23":
      return wire23Checker;

    case "wire":
      return wireChecker;

    case "bbe":
      return bbeChecker;
    

  }
}