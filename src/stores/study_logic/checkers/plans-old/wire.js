async function checkCBK(study) {
    const update_array = [];
    const steop1 = study.subject_states.find(
      (i) => i._id == "1"
    );
    const steop2 = study.subject_states.find(
      (i) => i._id == "2"
    );
    const steop3 = study.subject_states.find(
      (i) => i._id == "3"
    );
    const steop4 = study.subject_states.find(
      (i) => i._id == "4"
    );
    if (
      [steop1, steop2, steop3, steop4].every((item) => item.status == "done")
    ) {
      study.subject_states.forEach((item) => {
        if (
          item._id >= 5 &&
          item._id <= 16 &&
          item._id != 6 &&
          item.status == "unavailable"
        ) {
          update_array.push({
            study_id: study.study_id,
            _id: item._id,
            status: "can-do",
            grade: null,
          });
        }
      });
    } else {
      study.subject_states.forEach((item) => {
        if (parseInt(item._id, 10) > 4) {
          update_array.push({
            study_id: study.study_id,
            _id: item._id,
            status: "unavailable",
            grade: null,
          });
        }
      });
    }
    return update_array;
  }
async function checkAMC(study) {
  const update_array = [];
    const amc1 = study.subject_states.find(
      (i) => i._id == "5"
    );
    const amc2 = study.subject_states.find(
      (i) => i._id == "6"
    );
    if (amc1.status == "done" && amc2.status == "unavailable") {
      amc2.status = "can-do";
      update_array.push({
        study_id: study.study_id,
        _id: amc2._id,
        status: amc2.status,
        grade: null,
      });
    } else if (amc1.status !== "done") {
      amc2.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        _id: amc2._id,
        status: amc2.status,
        grade: null,
      });
    }
    return update_array
  }
 async function checkLvChoice(study, steopsDone) {

    const update_array = [];
    if (steopsDone) {
      let doneCount = null;
      let doneIndices = [];

      for (let i = 6; i <= 11; i++) {
        if (study.subject_states[i].status == "done") {
          doneCount++;
          doneIndices.push(i);
        }
      }

      if (doneCount >= 2) {
        for (let i = 6; i <= 11; i++) {
          if (!doneIndices.includes(i)) {
            study.subject_states[i].status = "unavailable";
            update_array.push({
              study_id: study.study_id,
              _id: study.subject_states[i]._id,
              status: "unavailable",
              grade: null,
            });
          }
        }
      } else {
        for (let i = 6; i <= 11; i++) {
          if (study.subject_states[i].status == "unavailable") {
            study.subject_states[i].status = "can-do";
            update_array.push({
              study_id: study.study_id,
              _id: study.subject_states[i]._id,
              status: "can-do",
              grade: null,
            });
          }
        }
      }
    }
    return update_array;
  }
async function checkHauptstudium(study) {
  const update_array = [];
    const excludesIds = ["20", "21", "25", "26", "37", "38"];
    const excludeSbwl = ["37"];
      const glzr = study.subject_states.find(
        (i) => i._id == "14"
      );
      if (glzr.status == "done") {
        study.subject_states.forEach((item) => {
          if (
            item._id >= 17 &&
            !excludesIds.includes(item._id) &&
            item.status == "unavailable"
          ) {
            item.status = "can-do";
            update_array.push({
              study_id: study.study_id,
              _id: item._id,
              status: item.status,
              grade: null,
            });
          }
        });
      } else if (glzr.status !== "done") {
        study.subject_states.forEach((item) => {
          if (item._id >= 17 && !excludeSbwl.includes(item._id)) {
            item.status = "unavailable";
            update_array.push({
              study_id: study.study_id,
              _id: item._id,
              status: item.status,
              grade: null,
            });
          }
        });
      }
      return update_array;
  }
async function checkPrRechtSchr(study) {
  const update_array = [];
    const zff = study.subject_states.find(
      (i) => i._id == "17"
    );
    const fp = study.subject_states.find(
      (i) => i._id == "20"
    );
    if (zff.status == "done" && fp.status == "unavailable") {
      fp.status = "can-do";
      update_array.push({
        study_id: study.study_id,
        _id: fp._id,
        status: fp.status,
        grade: null,
      });
    } else if (zff.status !== "done") {
      fp.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        _id: fp._id,
        status: fp.status,
        grade: null,
      });
    }
    return update_array;
  }
 async function checkPrRechtMue(study) {
  const update_array = [];
    const fpSchr = study.subject_states.find(
      (i) => i._id == "20"
    );
    const fpMue = study.subject_states.find(
      (i) => i._id == "21"
    );
    if (fpSchr.status == "done" && fpMue.status == "unavailable") {
      fpMue.status = "can-do";
      update_array.push({
        study_id: study.study_id,
        _id: fpMue._id,
        status: fpMue.status,
        grade: null,
      });
    } else if (fpSchr.status !== "done") {
      fpMue.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        _id: fpMue._id,
        status: fpMue.status,
        grade: null,
      });
    }
    return update_array;
  }
 async function checkOeffRechtSchr(study) {
  const update_array = [];
    const verfUndVerw = study.subject_states.find(
      (i) => i._id == "22"
    );
    const verwUndRecht = study.subject_states.find(
      (i) => i._id == "23"
    );
    const öffWire = study.subject_states.find(
      (i) => i._id == "24"
    );
    const fp = study.subject_states.find(
      (i) => i._id == "25"
    );
    if (
      [verfUndVerw, verwUndRecht, öffWire].every(
        (item) => item.status == "done"
      ) &&
      fp.status == "unavailable"
      
    ) {
      fp.status = "can-do";
      update_array.push({
        study_id: study.study_id,
        _id: fp._id,
        status: fp.status,
        grade: null,
      });
    } else if (
      [verfUndVerw, verwUndRecht, öffWire].some(
        (item) => item.status !== "done"
      )
    ) {
      fp.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        _id: fp._id,
        status: fp.status,
        grade: null,
      });
    }
    return update_array;
  }
 async function checkOeffRechtMue(study) {
  const update_array = [];
    const fpSchr = study.subject_states.find(
      (i) => i._id == "25"
    );
    const fpMue = study.subject_states.find(
      (i) => i._id == "26"
    );
    if (fpSchr.status == "done" && fpMue.status == "unavailable") {
      fpMue.status = "can-do";
      update_array.push({
        study_id: study.study_id,
        _id: fpMue._id,
        status: fpMue.status,
        grade: null,
      });
    } else if (fpSchr.status !== "done") {
      fpMue.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        _id: fpMue._id,
        status: fpMue.status,
        grade: null,
      });
    }
    return update_array;
  }
  async function checkSbwl(study, twoCbkSubjectsDone) {
    const update_array = [];
    const amc1 = study.subject_states.find(
      (i) => i._id == "5"
    );
    const amc2 = study.subject_states.find(
      (i) => i._id == "6"
    );
    const statistik = study.subject_states.find(
      (i) => i._id == "15"
    );
    const glzr = study.subject_states.find(
      (i) => i._id == "14"
    );
    const sbwl = study.subject_states.find(
      (i) => i._id == "37"
    );
    if (
      [amc1, amc2, glzr, statistik].every((item) => item.status == "done") &&
      twoCbkSubjectsDone == true && 
      sbwl.status == "unavailable"
    ) {
      sbwl.status = "can-do";
      update_array.push({
        study_id: study.study_id,
        _id: sbwl._id,
        status: sbwl.status,
        grade: null,
      });
      
    } else if (
      [amc1, amc2, glzr, statistik].some((item) => item.status !== "done") || twoCbkSubjectsDone == false 
    ) {
      sbwl.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        _id: sbwl._id,
        status: sbwl.status,
        grade: null,
      });
    } 
    return update_array;
  }
 async function checkBachelor(study, twoCbkSubjectsDone) {
  const update_array = [];
    const cbkFiltered = study.subject_states.filter((item) =>
      ["5", "6", "13", "14", "15", "16"].includes(item._id)
    ); 
    const gwa = study.subject_states.find(
      (i) => i._id == "36"
    );
    const bachelor = study.subject_states.find(
      (i) => i._id == "38"
    );
    if (
      cbkFiltered.every((item) => item.status == "done") &&
      twoCbkSubjectsDone &&
      gwa.status == "done" &&
      bachelor.status == "unavailable"
    ) {
      bachelor.status = "can-do";
      update_array.push({
        study_id: study.study_id,
        _id: bachelor._id,
        status: bachelor.status,
        grade: null,
      });
    } else if (
      cbkFiltered.some((item) => item.status !== "done") ||
      gwa.status !== "done" ||
      !twoCbkSubjectsDone
    ) {
      bachelor.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        _id: bachelor._id,
        status: bachelor.status,
        grade: null,
      });
    }
    return update_array;
  }
  export default {
    async executeAll(study) {
      let update_array = []

      let steopsDone = checkSTEOPs(study)

      const cbkValues = await checkCBK(study)
      cbkValues.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
      const checkAmcValues = await checkAMC(study)
      checkAmcValues.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
  
      const checkLvChoiceValue = await checkLvChoice(study, steopsDone)
      checkLvChoiceValue.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
      const checkHauptstudiumValues = await checkHauptstudium(study)
      checkHauptstudiumValues.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
      const checkPrRechtSchrValues = await checkPrRechtSchr(study)
      checkPrRechtSchrValues.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
      const checkPrRechtMueValues = await checkPrRechtMue(study)
      checkPrRechtMueValues.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
      const checkOeffRechtSchrValues = await checkOeffRechtSchr(study)
      checkOeffRechtSchrValues.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
      const checkOeffRechtMueValues = await checkOeffRechtMue(study)
      checkOeffRechtMueValues.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
      let twoCbkSubjectsDone = checkHs(study);
      //let totalDoneECTSValue = totalDoneECTS(study)

      const sbwlValues = await checkSbwl(study, twoCbkSubjectsDone)
      sbwlValues.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
      const bacherlorarbeitValue = await checkBachelor(study, twoCbkSubjectsDone)
      bacherlorarbeitValue.forEach((item) => {
        update_array = updateOrAdd(update_array, item)
      })
  
      return update_array
    }
  }/**
   * Funktion, die ein Subject in update_array aktualisiert oder hinzufügt.
   * Wenn das Subject bereits existiert, wird es überschrieben.
   * @param {Array} array - Das bestehende update_array
   * @param {Object} newItem - Das neue Item, das hinzugefügt oder ersetzt werden soll
   * @returns {Array} - Das aktualisierte update_array
   */
  function updateOrAdd(array, newItem) {
    const index = array.findIndex((item) => item._id === newItem._id)
    if (index > -1) {
      // Überschreiben des bereits vorhandenen Eintrags
      array[index] = newItem
    } else {
      // Neues Item hinzufügen
      array.push(newItem)
    }
    return array
  }
  /**
   * Funktion die Überprüft ob die STEOPs abgeschlossen sind
   * @param {Array} subjects - Die Fächer, die überprüft werden sollen
   * @returns {boolean} - true wenn alle STEOPs abgeschlossen sind
   */
  function checkSTEOPs(study) {
    const steop1 = study.subject_states.find((item) => item._id === '1')
    const steop2 = study.subject_states.find((item) => item._id === '2')
    const steop3 = study.subject_states.find((item) => item._id === '3')
    const steop4 = study.subject_states.find((item) => item._id === '4')
    return [steop1, steop2, steop3, steop4].every((item) => item.status === 'done')
  }

  /**
   * Funktion die überprüft ob mind. 2 BW Fächer abgeschlossen sind
   * @param {*} subjects - Die Fächer, die überprüft werden sollen 
   * @returns {boolean} - true wenn mind. 2 BW Fächer abgeschlossen sind
   */
  function checkHs(study) {
    let doneCount = null;
      let doneIndices = [];

      for (let i = 6; i <= 11; i++) {
        if (study.subject_states[i].status == "done") {
          doneCount++;
          doneIndices.push(i);
        }
      }

      if (doneCount >= 2) {
        return true;
      } else {
        return false;
      }
  }