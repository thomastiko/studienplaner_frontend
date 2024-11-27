async function checkCBK(study) {
  const update_array = []
  const steop1 = study.subject_states.find((i) => i._id == '1')
  const steop2 = study.subject_states.find((i) => i._id == '2')
  const steop3 = study.subject_states.find((i) => i._id == '3')
  if ([steop1, steop2, steop3].every((item) => item.status == 'done')) {
    study.subject_states.forEach((item) => {
      if (item._id >= 4 && item._id <= 14 && item.status == 'unavailable') {
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: 'can-do',
          grade: null
        })
      }
    })
  } else {
    study.subject_states.forEach((item) => {
      if (parseInt(item._id, 10) > 3 && item._id !== 37) {
        item.status = 'unavailable'
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: 'unavailable',
          grade: null
        })
      }
    })
  }
  return update_array
}
async function checkWahlfach(study) {
  const update_array = []

  const steop1 = study.subject_states.find((i) => i._id == '1')
  const steop2 = study.subject_states.find((i) => i._id == '2')
  const steop3 = study.subject_states.find((i) => i._id == '3')
  const wahlfach = study.subject_states.find((i) => i._id == '37')

  const ectsFreeElectiveUser = study.free_electives.reduce((sum, subject) => {
    return sum + (subject.ects || 0)
  }, 0)

  console.log('Total ECTS for all free electives:', ectsFreeElectiveUser)

  // Prüfe, ob mindestens einer der STEOP-Kurse abgeschlossen ist
  const prerequisitesMet = [steop1, steop2, steop3].some((item) => item.status === 'done')

  if (prerequisitesMet) {
    console.log(ectsFreeElectiveUser)
    // Überprüfe, ob die benötigten ECTS für `wahlfach` erreicht sind
    if (ectsFreeElectiveUser >= wahlfach.ects) {
      // Setze `wahlfach` auf "done", wenn die ECTS-Anforderung erfüllt ist
      wahlfach.status = 'done'
    } else {
      // Setze `wahlfach` auf "can-do", wenn die Voraussetzungen erfüllt sind, aber die ECTS-Anforderung noch nicht erfüllt ist
      wahlfach.status = 'can-do'
    }
  } else {
    // Setze `wahlfach` auf "unavailable", wenn die Voraussetzungen nicht erfüllt sind
    wahlfach.status = 'unavailable'
  }

  update_array.push({
    study_id: study.study_id,
    _id: wahlfach._id,
    status: wahlfach.status,
    grade: null
  })

  console.log(`Status von Wahlfach ID ${wahlfach._id} auf ${wahlfach.status} gesetzt.`)

  return update_array
}
async function checkHauptstudium(study, totalDoneECTSValue) {
  const update_array = []
  const hauptstudium = study.subject_states.slice(14, 39)
  const hauptstudiumFiltered = hauptstudium.filter(
    (item) =>
      !['27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'].includes(item._id)
  )
  if (totalDoneECTSValue >= 20) {
    hauptstudiumFiltered.forEach((item) => {
      if (item.status == 'unavailable') {
        item.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: item.status,
          grade: null
        })
      }
    })
  } else {
    hauptstudiumFiltered.forEach((item) => {
      item.status = 'unavailable'
      update_array.push({
        study_id: study.study_id,
        _id: item._id,
        status: item.status,
        grade: null
      })
    })
  }
  return update_array
}
async function checkSpezangebot(study, totalDoneECTSValue) {
  const update_array = []
  const spezialisierungsangebot = study.subject_states.slice(26, 36)
  const doneItems = spezialisierungsangebot.filter(
    (item) => item.status == 'done' || item.status == 'doing'
  )
  if (totalDoneECTSValue >= 20) {
    if (doneItems.length >= 3) {
      spezialisierungsangebot.forEach((item) => {
        if (item.status == 'can-do') {
          item.status = 'unavailable'
          update_array.push({
            study_id: study.study_id,
            _id: item._id,
            status: item.status,
            grade: null
          })
        }
      })
    } else {
      spezialisierungsangebot.forEach((item) => {
        if (item.status == 'unavailable') {
          item.status = 'can-do'
          update_array.push({
            study_id: study.study_id,
            _id: item._id,
            status: item.status,
            grade: null
          })
        }
      })
    }
  } else {
    spezialisierungsangebot.forEach((item) => {
      item.status = 'unavailable'
      update_array.push({
        study_id: study.study_id,
        _id: item._id,
        status: item.status,
        grade: null
      })
    })
  }

  return update_array
}
export async function checkSbwl(study, totalDoneECTSValue, steopsDone) {
  const update_array = [];

  const sbwl1 = study.subject_states.find((i) => i._id == '36'); // Einziges SBWL
  const amc1 = study.subject_states.find((i) => i._id == '4');
  const mathe = study.subject_states.find((i) => i._id == '12');
  const statistik = study.subject_states.find((i) => i._id == '13');

  // Überprüfen, ob die allgemeinen Voraussetzungen erfüllt sind
  const prerequisitesMet =
    totalDoneECTSValue >= 20 && [amc1, mathe, statistik].every((item) => item.status === 'done');

  // Überprüfen, ob das einzige SBWL vorhanden ist und den Status prüfen
  const sbwlState = study.sbwl_states[0]; // Erster und einziger Eintrag in sbwl_states
  if (sbwl1 && sbwlState) {
    if (sbwlState.sbwl_name === 'Courses Abroad') {
      // Spezielle Logik für "Courses Abroad"
      const totalEcts = sbwlState.subjects.reduce((sum, subject) => sum + (subject.ects || 0), 0);
      const allSubjectsDone = sbwlState.subjects.every((subject) => subject.status === 'done');

      if (!prerequisitesMet || !steopsDone) {
        sbwl1.status = 'unavailable';
      } else if (allSubjectsDone && totalEcts >= 20) {
        sbwl1.status = 'done';
      } else {
        sbwl1.status = 'can-do';
      }
    } else {
      // Normale Logik für ein Standard-SBWL
      if (!prerequisitesMet || !steopsDone) {
        sbwl1.status = 'unavailable';
      } else if (sbwlState.subjects.every((subject) => subject.status === 'done')) {
        sbwl1.status = 'done';
      } else {
        sbwl1.status = 'can-do';
      }
    }

    update_array.push({
      study_id: study.study_id,
      _id: sbwl1._id,
      status: sbwl1.status,
      grade: null,
    });
    console.log(`Status von SBWL ID ${sbwl1._id} auf ${sbwl1.status} gesetzt.`);
  } else {
    // Wenn sbwl1 oder sbwlState entfernt oder leer ist
    const newStatus = prerequisitesMet ? 'can-do' : 'unavailable';
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

  return update_array;
}
async function checkBachelorarbeit(study, totalDoneECTSValue) {
  const update_array = []
  const bachelorarbeit = study.subject_states.find((i) => i._id == '38')
  const gwa = study.subject_states.find((i) => i._id == '14')
  const amc1 = study.subject_states.find((i) => i._id == '4')
  const mathe = study.subject_states.find((i) => i._id == '12')
  const statistik = study.subject_states.find((i) => i._id == '13')
  if (totalDoneECTSValue >= 20) {
    if ([amc1, gwa, mathe, statistik].every((item) => item.status == 'done')) {
      if (bachelorarbeit.status == 'unavailable') {
        bachelorarbeit.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: bachelorarbeit._id,
          status: bachelorarbeit.status,
          grade: null
        })
      }
    } else if (![amc1, gwa, mathe, statistik].every((item) => item.status == 'done')) {
      bachelorarbeit.status = 'unavailable'
      update_array.push({
        study_id: study.study_id,
        _id: bachelorarbeit._id,
        status: bachelorarbeit.status,
        grade: null
      })
    }
  } else {
    bachelorarbeit.status = 'unavailable'
    update_array.push({
      study_id: study.study_id,
      _id: bachelorarbeit._id,
      status: bachelorarbeit.status,
      grade: null
    })
  }
  return update_array
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

    const hauptstudiumValues = await checkHauptstudium(study, totalDoneECTSValue)
    hauptstudiumValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const checkSpezangebotValues = await checkSpezangebot(study, totalDoneECTSValue)
    checkSpezangebotValues.forEach((item) => {
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
