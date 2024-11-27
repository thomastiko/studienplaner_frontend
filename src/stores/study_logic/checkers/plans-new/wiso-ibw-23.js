async function checkCBK(study) {
  const update_array = [];
  const steop1 = study.subject_states.find((i) => i._id == "1");
  const steop2 = study.subject_states.find((i) => i._id == "2");
  const steop3 = study.subject_states.find((i) => i._id == "3");
  if ([steop1, steop2, steop3].every((item) => item.status == "done")) {

    study.subject_states.forEach((item) => {
      if (
        item._id >= 4 &&
        item._id <= 14 &&
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
      if (parseInt(item._id, 10) > 3 && item._id !== "30") {
        item.status = "unavailable";
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
async function checkWahlfach(study) {
  const update_array = [];
  
  const steop1 = study.subject_states.find((i) => i._id == "1");
  const steop2 = study.subject_states.find((i) => i._id == "2");
  const steop3 = study.subject_states.find((i) => i._id == "3");
  const wahlfach = study.subject_states.find((i) => i._id == "30");

  const ectsFreeElectiveUser = study.free_electives.reduce((sum, subject) => {
    return sum + (subject.ects || 0);
  }, 0);
  
  console.log("Total ECTS for all free electives:", ectsFreeElectiveUser);

  // Prüfe, ob mindestens einer der STEOP-Kurse abgeschlossen ist
  const prerequisitesMet = [steop1, steop2, steop3].some((item) => item.status === "done");

  if (prerequisitesMet) {
    console.log(ectsFreeElectiveUser)
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

  console.log(`Status von Wahlfach ID ${wahlfach._id} auf ${wahlfach.status} gesetzt.`);
  
  return update_array;
}
async function checkHauptstudium(study, totalDoneECTSValue) {
  const update_array = [];
  const hauptstudium = study.subject_states.slice(14, 29);
  const hauptstudiumFiltered = hauptstudium.filter(
    (item) => !["18", "24", "28", "29", "30", "31"].includes(item._id)
  );
  if (totalDoneECTSValue >= 20) {
    hauptstudiumFiltered.forEach((item) => {
      if (item.status == "unavailable") {
        item.status = "can-do";
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: item.status,
          grade: null,
        });
      }
    });
  } else {
    hauptstudiumFiltered.forEach((item) => {
      item.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        _id: item._id,
        status: item.status,
        grade: null,
      });
    });
  }
  return update_array;
}
async function checkAMC(study, totalDoneECTSValue) {
  const update_array = [];
  const amc1 = study.subject_states.find((i) => i._id == "4");
  const amc2 = study.subject_states.find((i) => i._id == "18");
  if (
    amc1.status == "done" &&
    totalDoneECTSValue >= 20 &&
    amc2.status == "unavailable"
  ) {
    console.log("jetzt")
    amc2.status = "can-do";
    update_array.push({
      study_id: study.study_id,
      _id: amc2._id,
      status: amc2.status,
      grade: null,
    });
  } else if (amc1.status !== "done" || totalDoneECTSValue < 20) {
    amc2.status = "unavailable";
    update_array.push({
      study_id: study.study_id,
      _id: amc2._id,
      status: amc2.status,
      grade: null,
    });
  }
  return update_array;
}
export async function checkSbwl(study, totalDoneECTSValue, steopsDone) {
  const update_array = [];

  const sbwl1 = study.subject_states.find((i) => i._id == "28");
  const sbwl2 = study.subject_states.find((i) => i._id == "29"); // Das zweite SBWL verhält sich wie "Courses Abroad"
  const amc1 = study.subject_states.find((i) => i._id == "4");
  const mathe = study.subject_states.find((i) => i._id == "12");
  const statistik = study.subject_states.find((i) => i._id == "13");

  // Allgemeine Voraussetzungen prüfen
  const prerequisitesMet = totalDoneECTSValue >= 20 && [amc1, mathe, statistik].every((item) => item.status === "done");

  // Behandle das erste SBWL wie gewohnt
  const sbwlState1 = study.sbwl_states[0];
  if (sbwl1 && sbwlState1) {
    if (!prerequisitesMet || !steopsDone) {
      sbwl1.status = "unavailable"; // Voraussetzungen nicht erfüllt
    } else if (sbwlState1.subjects.every((subject) => subject.status === "done")) {
      sbwl1.status = "done"; // Alle Subjects sind "done"
    } else {
      sbwl1.status = "can-do"; // Voraussetzungen erfüllt, aber noch nicht alles "done"
    }

    update_array.push({
      study_id: study.study_id,
      _id: sbwl1._id,
      status: sbwl1.status,
      grade: null,
    });
    console.log(`Status von SBWL ID ${sbwl1._id} auf ${sbwl1.status} gesetzt.`);
  } else {
    // Wenn sbwl1 entfernt wurde oder leer ist
    const newStatus = prerequisitesMet ? "can-do" : "unavailable";
    if (sbwl1 && sbwl1.status !== newStatus) {
      sbwl1.status = newStatus;
      update_array.push({
        study_id: study.study_id,
        _id: sbwl1._id,
        status: sbwl1.status,
        grade: null,
      });
      console.log(`SBWL ID ${sbwl1._id} ist leer, Status auf ${sbwl1.status} gesetzt.`);
    }
  }

  // Behandle das zweite SBWL mit speziellen Bedingungen wie für "Courses Abroad"
  const sbwlState2 = study.sbwl_states[1];
  if (sbwl2 && sbwlState2) {
    const totalEcts = sbwlState2.subjects.reduce((sum, subject) => sum + (subject.ects || 0), 0);
    const allSubjectsDone = sbwlState2.subjects.every((subject) => subject.status === "done");

    if (!prerequisitesMet || !steopsDone) {
      sbwl2.status = "unavailable"; // Voraussetzungen nicht erfüllt
    } else if (allSubjectsDone && totalEcts >= 20) {
      sbwl2.status = "done"; // Alle Subjects sind "done" und ECTS >= 20
    } else {
      sbwl2.status = "can-do"; // Voraussetzungen erfüllt, aber entweder ECTS < 20 oder nicht alle Subjects "done"
    }

    update_array.push({
      study_id: study.study_id,
      _id: sbwl2._id,
      status: sbwl2.status,
      grade: null,
    });
    console.log(`Status von SBWL ID ${sbwl2._id} auf ${sbwl2.status} gesetzt.`);
  } else {
    // Wenn sbwl2 entfernt wurde oder leer ist
    const newStatus = prerequisitesMet ? "can-do" : "unavailable";
    if (sbwl2 && sbwl2.status !== newStatus) {
      sbwl2.status = newStatus;
      update_array.push({
        study_id: study.study_id,
        _id: sbwl2._id,
        status: sbwl2.status,
        grade: null,
      });
      console.log(`SBWL ID ${sbwl2._id} ist leer, Status auf ${sbwl2.status} gesetzt.`);
    }
  }

  return update_array;
}
async function checkWiko(study, totalDoneECTSValue) {
  const update_array = [];
  const wiko1 = study.subject_states.find((i) => i._id == "23");
  const wiko2 = study.subject_states.find((i) => i._id == "24");
  if (
    wiko1.status == "done" &&
    totalDoneECTSValue > 20 &&
    wiko2.status == "unavailable"
  ) {
    wiko2.status = "can-do";
    update_array.push({
      study_id: study.study_id,
      _id: wiko2._id,
      status: wiko2.status,
      grade: null,
    });
  } else if (wiko1.status !== "done" || totalDoneECTSValue < 20) {
    wiko2.status = "unavailable";
    update_array.push({
      study_id: study.study_id,
      _id: wiko2._id,
      status: wiko2.status,
      grade: null,
    });
  }
  return update_array;
}
async function checkBachelorarbeit(study, totalDoneECTSValue) {
  const update_array = [];
  const bachelorarbeit = study.subject_states.find(
    (i) => i._id == "31"
  );
  const gwa = study.subject_states.find((i) => i._id == "14");
  const amc1 = study.subject_states.find((i) => i._id == "4");
  const mathe = study.subject_states.find((i) => i._id == "12");
  const statistik = study.subject_states.find((i) => i._id == "13");
  if (totalDoneECTSValue >= 20) {
    if ([amc1, gwa, mathe, statistik].every((item) => item.status == "done")) {
      if (bachelorarbeit.status == "unavailable") {
        bachelorarbeit.status = "can-do";
        update_array.push({
          study_id: study.study_id,
          _id: bachelorarbeit._id,
          status: bachelorarbeit.status,
          grade: null,
        });
      }
    } else if (
      ![amc1, gwa, mathe, statistik].every((item) => item.status == "done")
    ) {
      bachelorarbeit.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        _id: bachelorarbeit._id,
        status: bachelorarbeit.status,
        grade: null,
      });
    }
  } else {
    bachelorarbeit.status = "unavailable";
    update_array.push({
      study_id: study.study_id,
      _id: bachelorarbeit._id,
      status: bachelorarbeit.status,
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

    let totalDoneECTSValue = totalDoneECTS(study)
    const checkAmcValues = await checkAMC(study, totalDoneECTSValue)
    checkAmcValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })

    const hauptstudiumValues = await checkHauptstudium(study, totalDoneECTSValue)
    hauptstudiumValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const checkWikoValues = await checkWiko(study, totalDoneECTSValue)
    checkWikoValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const sbwlValues = await checkSbwl(study, totalDoneECTSValue, steopsDone)
    sbwlValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const bacherlorarbeitValue = await checkBachelorarbeit(study, totalDoneECTSValue)
    bacherlorarbeitValue.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })

    return update_array
  },
  checkWahlfach,
  checkSbwl,
  totalDoneECTS,
  checkSTEOPs,
} /**
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
  const cbkSubjects = study.subject_states.slice(3, 14) // CBK-Fächer
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
  const steop3 = study.subject_states.find((item) => item._id === '3')
  return [steop1, steop2, steop3].every((item) => item.status === 'done')
}

