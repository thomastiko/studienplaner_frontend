import wisoWinf23Checker from "./checkers/plans-23/wiso-winf-23";
import wisoBwl23Checker from "./checkers/plans-23/wiso-bwl-23";

export function getChecker(study_id) {
  switch (study_id) {
    case "wiso-winf-23":
      return wisoWinf23Checker;
    case "wiso-bwl-23":
      return wisoBwl23Checker;
  }
}