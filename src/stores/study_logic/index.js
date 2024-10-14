import wisoWinf23Checker from "./checkers/wiso-winf-23";

export function getChecker(study_id) {
  switch (study_id) {
    case "wiso-winf-23":
      return wisoWinf23Checker;
  }
}