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
      if (parseInt(item._id, 10) > 3) {
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
async function checkLvChoice(study, steopsDone, twoCbkSubjectsDone) {
  const update_array = []
  if (steopsDone) {
    let doneCount = null
    let doneIndices = []

    for (let i = 4; i <= 9; i++) {
      console.log(study.subject_states[i])
      if (study.subject_states[i].status == 'done') {
        doneCount++
        doneIndices.push(i)
      }
    }

    if (doneCount >= 2) {
      twoCbkSubjectsDone = true
      for (let i = 4; i <= 9; i++) {
        if (!doneIndices.includes(i)) {
          study.subject_states[i].status = 'unavailable'
          update_array.push({
            study_id: study.study_id,
            _id: study.subject_states[i]._id,
            status: 'unavailable',
            grade: null
          })
        }
      }
    } else {
      twoCbkSubjectsDone = false
      for (let i = 4; i <= 9; i++) {
        if (study.subject_states[i].status == 'unavailable') {
          study.subject_states[i].status = 'can-do'
          update_array.push({
            study_id: study.study_id,
            _id: study.subject_states[i]._id,
            status: 'can-do',
            grade: null
          })
        }
      }
    }
  }
  return update_array
}
async function checkPrivatrecht(study) {
  const update_array = []
  const excludesIds = ['18', '19']
  const glzr = study.subject_states.find((i) => i._id == '13')
  if (glzr.status == 'done') {
    study.subject_states.forEach((item) => {
      if (
        item._id >= 15 &&
        !excludesIds.includes(item._id) &&
        item._id <= 21 &&
        item.status == 'unavailable'
      ) {
        item.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: item.status,
          grade: null
        })
      }
    })
  } else if (glzr.status !== 'done') {
    study.subject_states.forEach((item) => {
      if (item._id >= 15 && item._id <= 21 && !excludesIds.includes(item._id)) {
        item.status = 'unavailable'
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: item.status,
          grade: null
        })
      }
    })
  }
  return update_array
}
async function checkOeffRecht(study) {
  const update_array = []
  const excludesIds = ['27', '28']
  const glzr = study.subject_states.find((i) => i._id == '12')
  if (glzr.status == 'done') {
    study.subject_states.forEach((item) => {
      if (
        item._id >= 24 &&
        !excludesIds.includes(item._id) &&
        item._id <= 33 &&
        item.status == 'unavailable'
      ) {
        item.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: item.status,
          grade: null
        })
      }
    })
  } else if (glzr.status !== 'done') {
    study.subject_states.forEach((item) => {
      if (item._id >= 24 && item._id <= 33 && !excludesIds.includes(item._id)) {
        item.status = 'unavailable'
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: item.status,
          grade: null
        })
      }
    })
  }
  return update_array
}
async function checkPrRechtSchr(study) {
  const update_array = []
  const zff = study.subject_states.find((i) => i._id == '17')
  const fp = study.subject_states.find((i) => i._id == '18')
  if (zff.status == 'done' && fp.status == 'unavailable') {
    fp.status = 'can-do'
    update_array.push({
      study_id: study.study_id,
      _id: fp._id,
      status: fp.status,
      grade: null
    })
  } else if (zff.status !== 'done') {
    fp.status = 'unavailable'
    update_array.push({
      study_id: study.study_id,
      _id: fp._id,
      status: fp.status,
      grade: null
    })
  }
  return update_array
}
async function checkPrRechtMue(study) {
  const update_array = []
  const fpSchr = study.subject_states.find((i) => i._id == '18')
  const fpMue = study.subject_states.find((i) => i._id == '19')
  if (fpSchr.status == 'done' && fpMue.status == 'unavailable') {
    fpMue.status = 'can-do'
    update_array.push({
      study_id: study.study_id,
      _id: fpMue._id,
      status: fpMue.status,
      grade: null
    })
  } else if (fpSchr.status !== 'done') {
    fpMue.status = 'unavailable'
    update_array.push({
      study_id: study.study_id,
      _id: fpMue._id,
      status: fpMue.status,
      grade: null
    })
  }
  return update_array
}
async function checkOeffRechtSchr(study) {
  const update_array = []
  const verfUndVerw = study.subject_states.find((i) => i._id == '24')
  const verwUndRecht = study.subject_states.find((i) => i._id == '25')
  const öffWire = study.subject_states.find((i) => i._id == '26')
  const fp = study.subject_states.find((i) => i._id == '27')
  if (
    [verfUndVerw, verwUndRecht, öffWire].every((item) => item.status == 'done') &&
    fp.status == 'unavailable'
  ) {
    fp.status = 'can-do'
    update_array.push({
      study_id: study.study_id,
      _id: fp._id,
      status: fp.status,
      grade: null
    })
  } else if ([verfUndVerw, verwUndRecht, öffWire].some((item) => item.status !== 'done')) {
    fp.status = 'unavailable'
    update_array.push({
      study_id: study.study_id,
      _id: fp._id,
      status: fp.status,
      grade: null
    })
  }
  return update_array
}
async function checkOeffRechtMue(study) {
  const update_array = []
  const fpSchr = study.subject_states.find((i) => i._id == '27')
  const fpMue = study.subject_states.find((i) => i._id == '28')
  if (fpSchr.status == 'done' && fpMue.status == 'unavailable') {
    fpMue.status = 'can-do'
    update_array.push({
      study_id: study.study_id,
      _id: fpMue._id,
      status: fpMue.status,
      grade: null
    })
  } else if (fpSchr.status !== 'done') {
    fpMue.status = 'unavailable'
    update_array.push({
      study_id: study.study_id,
      _id: fpMue._id,
      status: fpMue.status,
      grade: null
    })
  }
  return update_array
}
export async function checkSbwl(study, twoCbkSubjectsDone) {
  console.log(twoCbkSubjectsDone)
  const update_array = [];

  const sbwl = study.subject_states.find((i) => i._id == '34'); // Die einzige SBWL in diesem Fall
  const statistik = study.subject_states.find((i) => i._id == '14');
  const sbwlState = study.sbwl_states[0]; // Nur ein sbwl_state in diesem Fall

  // Überprüfe allgemeine Voraussetzungen
  const prerequisitesMet = twoCbkSubjectsDone && statistik.status === 'done';

  // Prüfe, ob das `SBWL`-Objekt und `sbwlState` vorhanden sind
  if (sbwl && sbwlState) {
    if (!prerequisitesMet) {
      // Wenn Voraussetzungen nicht erfüllt sind, Status auf "unavailable" setzen
      sbwl.status = 'unavailable';
    } else if (sbwlState.subjects.every((subject) => subject.status === 'done')) {
      // Wenn alle Subjects in der SBWL "done" sind und Voraussetzungen erfüllt sind, auf "done" setzen
      sbwl.status = 'done';
    } else {
      // Voraussetzungen erfüllt, aber nicht alle Subjects "done" - Status auf "can-do" setzen
      sbwl.status = 'can-do';
    }

    // Aktualisiere den Status des SBWL in der Datenbank
    update_array.push({
      study_id: study.study_id,
      _id: sbwl._id,
      status: sbwl.status,
      grade: null
    });
    console.log(`Status von SBWL ID ${sbwl._id} auf ${sbwl.status} gesetzt.`);
  } else if (sbwl) {
    // Fallback, wenn `sbwlState` leer oder nicht vorhanden ist
    const newStatus = prerequisitesMet ? 'can-do' : 'unavailable';
    if (sbwl.status !== newStatus) {
      sbwl.status = newStatus;
      update_array.push({
        study_id: study.study_id,
        _id: sbwl._id,
        status: sbwl.status,
        grade: null
      });
      console.log(`SBWL ID ${sbwl._id} ist leer, Status auf ${sbwl.status} gesetzt.`);
    }
  }

  return update_array;
}
async function checkGwaUndWahlfach(study) {
  const update_array = []
  const glÖffRecht = study.subject_states.find((i) => i._id == '12')
  const glZviliRecht = study.subject_states.find((i) => i._id == '13')
  const gwa = study.subject_states.find((i) => i._id == '22')
  const wahlfach = study.subject_states.find((i) => i._id == '23')
  if (
    [glÖffRecht, glZviliRecht].every((item) => item.status == 'done') &&
    gwa.status == 'unavailable' &&
    wahlfach.status == 'unavailable'
  ) {
    gwa.status = 'can-do'
    wahlfach.status = 'can-do'
    update_array.push(
      {
        study_id: study.study_id,
        _id: gwa._id,
        status: gwa.status,
        grade: null
      },
      {
        study_id: study.study_id,
        _id: wahlfach._id,
        status: wahlfach.status,
        grade: null
      }
    )
  } else if ([glÖffRecht, glZviliRecht].some((item) => item.status !== 'done')) {
    gwa.status = 'unavailable'
    wahlfach.status = 'unavailable'
    update_array.push(
      {
        study_id: study.study_id,
        _id: gwa._id,
        status: gwa.status,
        grade: null
      },
      {
        study_id: study.study_id,
        _id: wahlfach._id,
        status: wahlfach.status,
        grade: null
      }
    )
  }
  return update_array
}
async function checkBachelor(study, twoLvCheck) {
  const update_array = []
  const cbkFiltered = study.subject_states.filter((item) =>
    ['4', '11', '12', '13', '14'].includes(item._id)
  )
  const gwa = study.subject_states.find((i) => i._id == 22)
  const bachelor = study.subject_states.find((i) => i._id == 35)
  if (
    cbkFiltered.every((item) => item.status == 'done') &&
    twoLvCheck == true &&
    gwa.status == 'done' &&
    bachelor.status == 'unavailable'
  ) {
    bachelor.status = 'can-do'
    update_array.push({
      study_id: study.study_id,
      _id: bachelor._id,
      status: bachelor.status,
      grade: null
    })
  } else if (
    cbkFiltered.some((item) => item.status !== 'done') ||
    gwa.status !== 'done' ||
    twoLvCheck == false
  ) {
    bachelor.status = 'unavailable'
    update_array.push({
      study_id: study.study_id,
      _id: bachelor._id,
      status: bachelor.status,
      grade: null
    })
  }
  return update_array
}

export default {
  async executeAll(study) {
    let update_array = []

    let steopsDone = checkSTEOPs(study)
    let twoCbkSubjectsDone = checkHs(study)

    const cbkValues = await checkCBK(study)
    cbkValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })

    const checkLvChoiceValue = await checkLvChoice(study, steopsDone, twoCbkSubjectsDone)
    checkLvChoiceValue.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const checkPrivatrechtValues = await checkPrivatrecht(study)
    checkPrivatrechtValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const checkOeffRechtValues = await checkOeffRecht(study)
    checkOeffRechtValues.forEach((item) => {
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
    const checkGwaUndWahlfachValues = await checkGwaUndWahlfach(study)
    checkGwaUndWahlfachValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    let totalDoneECTSValue = totalDoneECTS(study)

    const sbwlValues = await checkSbwl(study, twoCbkSubjectsDone)
    sbwlValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const bacherlorarbeitValue = await checkBachelor(study, totalDoneECTSValue)
    bacherlorarbeitValue.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })

    return update_array
  },
  checkSbwl,
  totalDoneECTS,
  checkHs
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
  }, null)
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
/**
 * Funktion die überprüft ob mind. 2 BW Fächer abgeschlossen sind
 * @param {*} subjects - Die Fächer, die überprüft werden sollen
 * @returns {boolean} - true wenn mind. 2 BW Fächer abgeschlossen sind
 */
function checkHs(study) {
  let doneCount = null
  let doneIndices = []

  for (let i = 6; i <= 11; i++) {
    if (study.subject_states[i].status == 'done') {
      doneCount++
      doneIndices.push(i)
    }
  }

  if (doneCount >= 2) {
    return true
  } else {
    return false
  }
}
