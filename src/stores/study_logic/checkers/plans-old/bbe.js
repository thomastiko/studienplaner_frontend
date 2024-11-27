async function checkCBK(study) {
  const update_array = [];
  const steop1 = study.subject_states.find((i) => i._id == "1");
  const steop2 = study.subject_states.find((i) => i._id == "2");
  if (steop1.status == "done" && steop2.status == "done") {
    study.subject_states.forEach((item) => {
      if (
        item._id !== "5" &&
        item._id !== "6" &&
        item._id !== "19" &&
        item._id !== "20" &&
        item._id !== "21" &&
        item.status == "unavailable"
      ) {
        console.log(item._id);
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: "can-do",
          grade: 0,
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
          grade: 0,
        });
      }
    });
  }
  return update_array;
}

async function checkWahlfach(study) {
  const update_array = [];
  
  const steop1 = study.subject_states.find((i) => i._id == "1");
  const steop2 = study.subject_states.find((i) => i._id == "2");
  const wahlfach = study.subject_states.find((i) => i._id == "19");

  const ectsFreeElectiveUser = study.free_electives.reduce((sum, subject) => {
    return sum + (subject.ects || 0);
  }, 0);
  

  const prerequisitesMet = [steop1, steop2].every((item) => item.status === "done");

  if (prerequisitesMet) {
    // Überprüfe, ob die benötigten ECTS für `wahlfach` erreicht sind
    if (ectsFreeElectiveUser >= wahlfach.ects) {
      // Setze `wahlfach` auf "done", wenn die ECTS-Anforderung erfüllt ist
      wahlfach.status = "done";
    } else {
      // Setze `wahlfach` auf "can-do", wenn die Voraussetzungen erfüllt sind, aber die ECTS-Anforderung noch nicht erfüllt ist
      wahlfach.status = "can-do";
    }
  } else {
    // Setze `wahlfach` auf "unavailable", wenn die Voraussetzungen nicht erfüllt sind
    wahlfach.status = "unavailable";
  }

  update_array.push({
    study_id: study.study_id,
    _id: wahlfach._id,
    status: wahlfach.status,
    grade: null,
  });

  
  return update_array;
}


async function checkBusinessAnalytics(study, steopsDone) {
  const update_array = [];
  const quanMeth2 = study.subject_states.find((i) => i._id == "4");
  const busAn1 = study.subject_states.find((i) => i._id == "5");
  const busAn2 = study.subject_states.find((i) => i._id == "6");
  if (
    quanMeth2.status == "done" &&
    (busAn1.status == "unavailable" || busAn2.status == "unavailable") &&
    steopsDone
  ) {
    busAn1.status = "can-do";
    busAn2.status = "can-do";
    update_array.push(
      {
        study_id: study.study_id,
        _id: busAn1._id,
        status: busAn1.status,
        grade: null,
      },
      {
        study_id: study.study_id,
        _id: busAn2._id,
        status: busAn2.status,
        grade: null,
      }
    );
  } else if (quanMeth2.status !== "done") {
    busAn1.status = "unavailable";
    busAn2.status = "unavailable";
    update_array.push(
      {
        study_id: study.study_id,
        _id: busAn1._id,
        status: busAn1.status,
        grade: null,
      },
      {
        study_id: study.study_id,
        _id: busAn2._id,
        status: busAn2.status,
        grade: null,
      }
    );
  }
  return update_array;
}
async function checkSbwl(study, totalDoneECTSValue) {
  const update_array = [];

  // Finde das spezifische SBWL-Objekt
  const sbwl1 = study.subject_states.find((i) => i._id == "20");

  // Berechne die Summe der ECTS in allen Subjects mit Status "done" innerhalb der sbwl_states
  let doneEctsSum = 0;
  study.sbwl_states.forEach((sbwlState) => {
    sbwlState.subjects.forEach((subject) => {
      if (subject.status === "done") {
        doneEctsSum += subject.ects;
      }
    });
  });

  // Überprüfe den Status auf Basis der erfüllten Voraussetzungen
  if (totalDoneECTSValue >= 42) {
    if (doneEctsSum >= 40) {
      sbwl1.status = "done";
    } else {
      sbwl1.status = "can-do";
    }
  } else {
    sbwl1.status = "unavailable";
  }

  // Füge das aktualisierte Objekt zum Update-Array hinzu
  update_array.push({
    study_id: study.study_id,
    _id: sbwl1._id,
    status: sbwl1.status,
    grade: null,
  });

  return update_array;
}
async function checkBachelorarbeit(study) {
  const update_array = [];
  const academicSkills1 = study.subject_states.find(
    (i) => i._id == "17"
  );
  const academicSkills2 = study.subject_states.find(
    (i) => i._id == "18"
  );
  const bachelorArb = study.subject_states.find(
    (i) => i._id == "21"
  );
  if (
    academicSkills1.status == "done" &&
    academicSkills2.status == "done" &&
    bachelorArb.status == "unavailable"
  ) {
    bachelorArb.status = "can-do";
    update_array.push({
      study_id: study.study_id,
      _id: bachelorArb._id,
      status: bachelorArb.status,
      grade: null,
    });
  } else if (
    academicSkills1.status !== "done" ||
    academicSkills2.status !== "done"
  ) {
    bachelorArb.status = "unavailable";
    update_array.push({
      study_id: study.study_id,
      _id: bachelorArb._id,
      status: bachelorArb.status,
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
    const wahlfachValues = await checkWahlfach(study)
    wahlfachValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const checkBusinessAnalyticsValues = await checkBusinessAnalytics(study, steopsDone)
    checkBusinessAnalyticsValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })

    let totalDoneECTSValue = totalDoneECTS(study)

    const sbwlValues = await checkSbwl(study, totalDoneECTSValue)
    sbwlValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const bacherlorarbeitValue = await checkBachelorarbeit(study)
    bacherlorarbeitValue.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })

    return update_array
  },
  checkWahlfach,
  checkSbwl,
  totalDoneECTS

}

/**
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
 * Funktion zur Berechnung der gesamten ECTS-Punkte für "done"-Fächer
 * @param {Array} subjects - Die Fächer, die überprüft werden sollen
 * @returns {number} - Die Summe der ECTS-Punkte aller "done"-Fächer
 */
function totalDoneECTS(study) {
  const cbkSubjects = study.subject_states.slice(2, 16) // Main Program excluding Academic Skills
  console.log(cbkSubjects)
  return cbkSubjects.reduce((sum, item) => {
    if (item.status === 'done') {
      return sum + item.ects
    }
    return sum
  }, 0)
}
/**
   * Funktion die Überprüft ob die STEOPs abgeschlossen sind
   * @param {Array} subjects - Die Fächer, die überprüft werden sollen
   * @returns {boolean} - true wenn alle STEOPs abgeschlossen sind
   */
function checkSTEOPs(study) {
  const steop1 = study.subject_states.find((item) => item._id === '1')
  const steop2 = study.subject_states.find((item) => item._id === '2')
  return [steop1, steop2].every((item) => item.status === 'done')
}
