import wisoWinf23Checker from "./checkers/plans-new/wiso-winf-23";
import wisoWinf23Paths from "./paths/wiso-winf-23";
import wisoBwl23Checker from "./checkers/plans-new/wiso-bwl-23";
import wisoBwl23Paths from "./paths/wiso-bwl-23";
import wisoIbw23Checker from "./checkers/plans-new/wiso-ibw-23";
import wisoIbw23Paths from "./paths/wiso-ibw-23";
import wisoVwl23Checker from "./checkers/plans-new/wiso-vwl-23";
import wisoVwl23Paths from "./paths/wiso-vwl-23";
import wisoWupol23Checker from "./checkers/plans-new/wiso-wupol-23";
import wisoWupol23Paths from "./paths/wiso-wupol-23";

import wire23Checker from "./checkers/plans-new/wire-23";
import wire23Paths from "./paths/wire-23";

import bbeChecker from "./checkers/plans-old/bbe";
import bbePaths from "./paths/bbe";

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
    case "wire-23":
      return wire23Checker;
    case "bbe":
      return bbeChecker;
    

  }
}

export function getPath(study_id) {
  switch (study_id) {
    case "bbe":
      return bbePaths;
    case "wire-23":
      return wire23Paths;
    case "wiso-bwl-23":
      return wisoBwl23Paths;
    case "wiso-ibw-23":
      return wisoIbw23Paths;
    case "wiso-vwl-23":
      return wisoVwl23Paths;
    case "wiso-winf-23":
      return wisoWinf23Paths;
    case "wiso-wupol-23":
      return wisoWupol23Paths;
  }
}