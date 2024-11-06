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
      if (parseInt(item._id, 10) > 3 && item._id !== "27") {
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
  const wahlfach = study.subject_states.find((i) => i._id == "27");

  const ectsFreeElectiveUser = study.free_electives.reduce((sum, subject) => {
    return sum + (subject.ects || 0);
  }, 0);
  

  // Prüfe, ob mindestens einer der STEOP-Kurse abgeschlossen ist
  const prerequisitesMet = [steop1, steop2, steop3].some((item) => item.status === "done");

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
async function checkHauptstudium(study, totalDoneECTSValue) {
  const update_array = [];
  const hauptstudium = study.subject_states.slice(14, 29);
  const hauptstudiumFiltered = hauptstudium.filter(
    (item) => !["18", "24", "25", "26", "27", "28"].includes(item._id)
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
export async function checkSbwl(study, totalDoneECTSValue) {
  const update_array = [];

  const sbwl1 = study.subject_states.find((i) => i._id == "24");
  const sbwl2 = study.subject_states.find((i) => i._id == "25");
  const sbwl3 = study.subject_states.find((i) => i._id == "26");
  const amc1 = study.subject_states.find((i) => i._id == "4");
  const mathe = study.subject_states.find((i) => i._id == "12");
  const statistik = study.subject_states.find((i) => i._id == "13");

  // Prüfe allgemeine Voraussetzungen
  const prerequisitesMet = totalDoneECTSValue >= 20 && [amc1, mathe, statistik].every((item) => item.status === "done");

  // Verarbeite die ersten beiden SBWLs wie gewohnt
  [sbwl1, sbwl2].forEach((sbwl, index) => {
    const sbwlState = study.sbwl_states[index];

    if (sbwl && sbwlState) {
      if (!prerequisitesMet) {
        sbwl.status = "unavailable"; // Wenn Voraussetzungen nicht erfüllt sind
      } else if (sbwlState.subjects.every((subject) => subject.status === "done")) {
        sbwl.status = "done"; // Wenn alle Subjects "done" und Voraussetzungen erfüllt sind
      } else {
        sbwl.status = "can-do"; // Wenn Voraussetzungen erfüllt sind, aber nicht alle Subjects "done"
      }

      update_array.push({
        study_id: study.study_id,
        _id: sbwl._id,
        status: sbwl.status,
        grade: null,
      });
      console.log(`Status von SBWL ID ${sbwl._id} auf ${sbwl.status} gesetzt.`);
      
    } else {
      // Wenn `sbwl` oder `sbwlState` nicht definiert ist
      const newStatus = prerequisitesMet ? "can-do" : "unavailable";
      
      if (sbwl && sbwl.status !== newStatus) {
        sbwl.status = newStatus;
        update_array.push({
          study_id: study.study_id,
          _id: sbwl._id,
          status: sbwl.status,
          grade: null,
        });
        console.log(`SBWL ID ${sbwl._id} ist leer, Status auf ${sbwl.status} gesetzt.`);
      }
    }
  });

  // Behandle das dritte SBWL, inklusive Sonderfall für Courses Abroad
  const thirdSbwlState = study.sbwl_states[2]; // Index 2 entspricht dem dritten SBWL
  if (sbwl3 && thirdSbwlState) {
    if (thirdSbwlState.sbwl_name === "Courses Abroad") {
      // Spezielle Logik für Courses Abroad
      const totalEcts = thirdSbwlState.subjects.reduce((sum, subject) => sum + (subject.ects || 0), 0);
      const allSubjectsDone = thirdSbwlState.subjects.every((subject) => subject.status === "done");

      if (!prerequisitesMet) {
        sbwl3.status = "unavailable";
      } else if (allSubjectsDone && totalEcts >= 20) {
        sbwl3.status = "done";
      } else {
        sbwl3.status = "can-do";
      }
    } else {
      // Behandle das dritte SBWL wie die anderen SBWLs, falls es kein Courses Abroad ist
      if (!prerequisitesMet) {
        sbwl3.status = "unavailable";
      } else if (thirdSbwlState.subjects.every((subject) => subject.status === "done")) {
        sbwl3.status = "done";
      } else {
        sbwl3.status = "can-do";
      }
    }

    update_array.push({
      study_id: study.study_id,
      _id: sbwl3._id,
      status: sbwl3.status,
      grade: null,
    });
    console.log(`Status von SBWL ID ${sbwl3._id} auf ${sbwl3.status} gesetzt.`);
  } else {
    // Wenn das dritte SBWL oder sein Statusobjekt entfernt oder leer ist
    const newStatus = prerequisitesMet ? "can-do" : "unavailable";

    if (sbwl3 && sbwl3.status !== newStatus) {
      sbwl3.status = newStatus;
      update_array.push({
        study_id: study.study_id,
        _id: sbwl3._id,
        status: sbwl3.status,
        grade: null,
      });
      console.log(`SBWL ID ${sbwl3._id} ist leer, Status auf ${sbwl3.status} gesetzt.`);
    }
  }

  return update_array;
}

async function checkBachelorarbeit(study, totalDoneECTSValue) {
  const update_array = [];
  const bachelorarbeit = study.subject_states.find(
    (i) => i._id == "28"
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
    const sbwlValues = await checkSbwl(study, totalDoneECTSValue)
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
  totalDoneECTS
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