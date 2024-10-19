async function checkCBK(study) {
  const update_array = []
  const steop1 = study.subject_states.find((i) => i._id == '1')
  const steop2 = study.subject_states.find((i) => i._id == '2')
  const steop3 = study.subject_states.find((i) => i._id == '3')
  if ([steop1, steop2, steop3].every((item) => item.status == 'done')) {
    //data.isRunningCheckCBK = true;
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
      if (parseInt(item._id, 10) > 3 && item._id !== "25") {
        item.status = 'unavailable'
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: 'unavailable',
          grade: null
        })
        //data.isRunningCheckCBK = false;
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
  const wahlfach = study.subject_states.find((i) => i._id == '25')

  if (
    [steop1, steop2, steop3].some((item) => item.status == 'done') &&
    wahlfach.status == 'unavailable'
  ) {
    wahlfach.status = 'can-do'
    update_array.push({
      study_id: study.study_id,
      _id: wahlfach._id,
      status: wahlfach.status,
      grade: null
    })
  } else if ([steop1, steop2, steop3].every((item) => item.status == 'can-do')) {
    wahlfach.status = 'unavailable'
    update_array.push({
      study_id: study.study_id,
      _id: wahlfach._id,
      status: wahlfach.status,
      grade: null
    })
  }
  return update_array
}

async function checkHauptstudium(study, totalDoneECTSValue) {
  const update_array = []
  const hauptstudium = study.subject_states.slice(14, 27) // Hauptstudium
  const hauptstudiumFiltered = hauptstudium.filter(
    (item) => !['21', '22', '23', '25', '26'].includes(item._id)
  )

  if (totalDoneECTSValue >= 20) {
    hauptstudiumFiltered.forEach((item) => {
      if (item.status === 'unavailable') {
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

  console.log('Total ECTS im CBK:', totalDoneECTSValue)
  return update_array
}

async function checkSbwl(study, totalDoneECTSValue) {
  const update_array = []
  const sbwl1 = study.subject_states.find((i) => i._id == '21')
  const sbwl2 = study.subject_states.find((i) => i._id == '22')
  const sbwl3 = study.subject_states.find((i) => i._id == '23')
  const amc1 = study.subject_states.find((i) => i._id == '4')
  const mathe = study.subject_states.find((i) => i._id == '12')
  const statistik = study.subject_states.find((i) => i._id == '13')
  if (totalDoneECTSValue >= 20) {
    if ([amc1, mathe, statistik].every((item) => item.status == 'done')) {
      if (sbwl1.status == 'unavailable') {
        console.log('SBWL1 ist unavailable')
        sbwl1.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: sbwl1._id,
          status: sbwl1.status,
          grade: null
        })
      }
      if (sbwl2.status == 'unavailable') {
        console.log('SBWL2 ist unavailable')
        sbwl2.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: sbwl2._id,
          status: sbwl2.status,
          grade: null
        })
      }
      if (sbwl3.status == 'unavailable') {
        console.log('SBWL3 ist unavailable')
        sbwl3.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: sbwl3._id,
          status: sbwl3.status,
          grade: null
        })
      }
    } else if (![amc1, mathe, statistik].every((item) => item.status == 'done')) {
      sbwl1.status = 'unavailable'
      sbwl2.status = 'unavailable'
      sbwl3.status = 'unavailable'
      update_array.push(
        {
          study_id: study.study_id,
          _id: sbwl1._id,
          status: sbwl1.status,
          grade: null
        },
        {
          study_id: study.study_id,
          _id: sbwl2._id,
          status: sbwl2.status,
          grade: null
        },
        {
          study_id: study.study_id,
          _id: sbwl3._id,
          status: sbwl3.status,
          grade: null
        }
      )
    }
  } else {
    sbwl1.status = 'unavailable'
    sbwl2.status = 'unavailable'
    sbwl3.status = 'unavailable'
    update_array.push(
      {
        study_id: study.study_id,
        _id: sbwl1._id,
        status: sbwl1.status,
        grade: null
      },
      {
        study_id: study.study_id,
        _id: sbwl2._id,
        status: sbwl2.status,
        grade: null
      },
      {
        study_id: study.study_id,
        _id: sbwl3._id,
        status: sbwl3.status,
        grade: null
      }
    )
  }
  return update_array
}

async function checkBachelorarbeit(study, totalDoneECTSValue) {
  const update_array = []
  const bachelorarbeit = study.subject_states.find((i) => i._id == '26')
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
    } else {
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
    const sbwlValues = await checkSbwl(study, totalDoneECTSValue)
    sbwlValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const bacherlorarbeitValue = await checkBachelorarbeit(study, totalDoneECTSValue)
    bacherlorarbeitValue.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })

    return update_array
  }
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
