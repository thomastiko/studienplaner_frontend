/*
import bbeChecker from "./checkers/bbe";
import wireChecker from "./checkers/wire";
import wisoBwlChecker from "./checkers/wiso-bwl";
import wisoIbwChecker from "./checkers/wiso-ibw";
import wisoSzChecker from "./checkers/wiso-sz";
import wisoVwlChecker from "./checkers/wiso-vwl";
import wisoWinfChecker from "./checkers/wiso-winf";
import wire23Checker from "./checkers/wire-23";
import wisoBwl23Checker from "./checkers/wiso-bwl-23";
import wisoIbw23Checker from "./checkers/wiso-ibw-23";
import wisoVwl23Checker from "./checkers/wiso-vwl-23";
import wisoWinf23Checker from "./checkers/wiso-winf-23";
import wisoWupol23Checker from "./checkers/wiso-wupol-23";


import wirePath from "./paths/wire";
import wire23Path from "./paths/wire-23";
import bbePath from "./paths/bbe";
import wisoBwlPath from "./paths/wiso-bwl";
import wisoIbwPath from "./paths/wiso-ibw";
import wisoVwlPath from "./paths/wiso-vwl";
import wisoSzPath from "./paths/wiso-sz";
import wisoWinfPath from "./paths/wiso-winf";
import wisoBwl23Path from "./paths/wiso-bwl-23";
import wisoIbw23Path from "./paths/wiso-ibw-23";
import wisoWinf23Path from "./paths/wiso-winf-23";
import wisoVwl23Path from "./paths/wiso-vwl-23";
import wisoWupol23Path from "./paths/wiso-wupol-23";


export function getChecker(study_id) {
  switch (study_id) {
    case "bbe":
      return bbeChecker;
    case "wire":
      return wireChecker;
    case "wiso-bwl":
      return wisoBwlChecker;
    case "wiso-ibw":
      return wisoIbwChecker;
    case "wiso-sz":
      return wisoSzChecker;
    case "wiso-vwl":
      return wisoVwlChecker;
    case "wiso-winf":
      return wisoWinfChecker;
    case "wire-23":
      return wire23Checker;
    case "wiso-bwl-23":
      return wisoBwl23Checker;
    case "wiso-ibw-23":
      return wisoIbw23Checker;
    case "wiso-vwl-23":
      return wisoVwl23Checker;
    case "wiso-winf-23":
      return wisoWinf23Checker;
    case "wiso-wupol-23":
      return wisoWupol23Checker;
  }
}

export function getStudyPath(study_id) {
  switch (study_id) {
    case "wire":
      return wirePath;
    case "wiso-bwl":
      return wisoBwlPath;
    case "wiso-ibw":
      return wisoIbwPath;
    case "wiso-vwl":
      return wisoVwlPath;
    case "wiso-sz":
      return wisoSzPath;
    case "wiso-winf":
      return wisoWinfPath;
    case "bbe":
      return bbePath;
    case "wire-23":
      return wire23Path;
    case "wiso-bwl-23":
      return wisoBwl23Path;
    case "wiso-ibw-23":
      return wisoIbw23Path;
    case "wiso-winf-23":
      return wisoWinf23Path;
    case "wiso-vwl-23":
      return wisoVwl23Path;
    case "wiso-wupol-23":
      return wisoWupol23Path;
  }
}
*/
export const STUDY_ID = {
    BBE: "bbe",
    WIRE: "wire",
    WISO_BWL: "wiso-bwl",
    WISO_IBW: "wiso-ibw",
    WISO_SZ: "wiso-sz",
    WISO_VWL: "wiso-vwl",
    WISO_WINF: "wiso-winf",
    WIRE_23: "wire-23",
    WISO_BWL_23: "wiso-bwl-23",
    WISO_IBW_23: "wiso-ibw-23",
    WISO_VWL_23: "wiso-vwl-23",
    WISO_WINF_23: "wiso-winf-23",
    WISO_WUPOL_23: "wiso-wupol-23"
  };
  
  const studyPlans = {
    [STUDY_ID.BBE]: () => import("./plans/bbe.json"),
    [STUDY_ID.WIRE]: () => import("./plans/wire.json"),
    [STUDY_ID.WISO_BWL]: () => import("./plans/wiso-bwl.json"),
    [STUDY_ID.WISO_IBW]: () => import("./plans/wiso-ibw.json"),
    [STUDY_ID.WISO_SZ]: () => import("./plans/wiso-sz.json"),
    [STUDY_ID.WISO_VWL]: () => import("./plans/wiso-vwl.json"),
    [STUDY_ID.WISO_WINF]: () => import("./plans/wiso-winf.json"),
    [STUDY_ID.WIRE_23]: () => import("./plans/wire-23.json"),
    [STUDY_ID.WISO_BWL_23]: () => import("./plans/wiso-bwl-23.json"),
    [STUDY_ID.WISO_IBW_23]: () => import("./plans/wiso-ibw-23.json"),
    [STUDY_ID.WISO_VWL_23]: () => import("./plans/wiso-vwl-23.json"),
    [STUDY_ID.WISO_WINF_23]: () => import("./plans/wiso-winf-23.json"),
    [STUDY_ID.WISO_WUPOL_23]: () => import("./plans/wiso-wupol-23.json"),
  };
  
  export async function getStudyObject(study_id) {
    if (studyPlans[study_id]) {
      try {
        const module = await studyPlans[study_id]();
        return module.default; // Da es sich um einen ES-Module-Import handelt
      } catch (error) {
        throw new Error(`Fehler beim Laden des Studiengangs: ${study_id}`);
      }
    } else {
      throw new Error(`Unbekannter Studiengang: ${study_id}`);
    }
  }
  