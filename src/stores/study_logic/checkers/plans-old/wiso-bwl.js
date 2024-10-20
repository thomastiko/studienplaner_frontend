async function checkCBK(study) {
  const update_array = [];

  const bwlChoice = study.subject_states.filter((item) =>
    ["15", "16", "17", "18", "19"].includes(item._id)
  );

  const steop1 = study.subject_states.find((i) => i._id == "1");
  const steop2 = study.subject_states.find((i) => i._id == "2");
  const steop3 = study.subject_states.find((i) => i._id == "3");
  const steop4 = study.subject_states.find((i) => i._id == "4");
  if ([steop1, steop2, steop3, steop4].every((item) => item.status == "done")) {

    study.subject_states.forEach((item) => {
      if (
        item._id >= 5 &&
        item._id <= 13 &&
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
    bwlChoice.forEach((item) => {
      if (item.status == "unavailable") {
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
  const amc1 = study.subject_states.find((i) => i._id == "5");
  const amc2 = study.subject_states.find((i) => i._id == "6");
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
  return update_array;
}
async function checkHauptstudium(study, hsAvailable) {
  const update_array = [];
  const hauptstudium = study.subject_states.slice(13, 34);
  const hauptstudiumFiltered = hauptstudium.filter(
    (item) =>
      !["14", "23", "24", "28", "29", "30", "31", "32", "34"].includes(
        item._id
      )
  );
  const hauptstudiumFiltered2x = hauptstudiumFiltered.filter(
    (item) => !["15", "16", "17", "18", "19"].includes(item._id)
  );
  if (hsAvailable) {
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
    hauptstudiumFiltered2x.forEach((item) => {
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
async function checkLvChoice(study, steopsDone, hsAvailable) {
  const update_array = [];
  const bwlChoice = study.subject_states.filter((item) =>
    ["15", "16", "17", "18", "19"].includes(item._id)
  );
  if (steopsDone && !hsAvailable) {
    const doneItems = bwlChoice.filter(
      (item) => item.status == "done" || item.status == "doing"
    );
    if (doneItems.length >= 3) {
      bwlChoice.forEach((item) => {
        item.status = "can-do";
        update_array.push({
          study_id: study.study_id,
          _id: item._id,
          status: item.status,
          grade: null,
        });
      });
    } else if (doneItems.length >= 2) {
      bwlChoice.forEach((item) => {
        if (
          item.status == "can-do" ||
          (item.status !== "doing" && item.status !== "done")
        ) {
          item.status = "unavailable";
          update_array.push({
            study_id: study.study_id,
            _id: item._id,
            status: item.status,
            grade: null,
          });
        }
      });
    } else {
      bwlChoice.forEach((item) => {
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
    }
  } else if (steopsDone && hsAvailable) {
    bwlChoice.forEach((item) => {
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
  }
  return update_array;
}
async function checkWiko(study, hsAvailable) {
  const update_array = [];
  const wpr1 = study.subject_states.find((i) => i._id == "15");
  const wpr2 = study.subject_states.find((i) => i._id == "14");

  if (wpr1.status == 'done' && hsAvailable && wpr2.status == 'unavailable') {
    wpr2.status = 'can-do'
    update_array.push({
      study_id: study.study_id,
      _id: wpr2._id,
      status: wpr2.status,
      grade: null,
    });
  } else if (wpr1.status !== 'done' || !hsAvailable) {
    wpr2.status = 'unavailable'
    update_array.push({
      study_id: study.study_id,
      _id: wpr2._id,
      status: wpr2.status,
      grade: null,
    });
  }
  return update_array;
}
async function checkSozio(study, hsAvailable) {
  const update_array = [];
  const sozKomp = study.subject_states.find((i) => i._id == "23");
    const intKomp = study.subject_states.find((i) => i._id == "24");
      if (sozKomp.status == 'unavailable' && intKomp.status == 'unavailable' && hsAvailable) {
        console.log("1")
        sozKomp.status = 'can-do';
        intKomp.status = 'can-do';
        update_array.push({
          study_id: study.study_id,
          _id: sozKomp._id,
          status: sozKomp.status,
          grade: null,
        },
        {
          study_id: study.study_id,
          _id: intKomp._id,
          status: intKomp.status,
          grade: null,
        });
      }  else if ((intKomp.status == 'done' || intKomp.status == 'doing') && hsAvailable) {
        console.log("2")
        sozKomp.status = 'unavailable'
        update_array.push({
          study_id: study.study_id,
          _id: sozKomp._id,
          status: sozKomp.status,
          grade: null,
        });
      } else if (intKomp.status == 'can-do' && (sozKomp.status == 'can-do' || sozKomp.status == 'unavailable') && hsAvailable) {
        console.log("3")
        sozKomp.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: sozKomp._id,
          status: sozKomp.status,
          grade: null,
        });
      }
      else if ((sozKomp.status == 'done' || sozKomp.status == 'doing') && hsAvailable) {
        console.log("4")
        intKomp.status = 'unavailable'
        update_array.push({
          study_id: study.study_id,
          _id: intKomp._id,
          status: intKomp.status,
          grade: null,
        });
      } else if (sozKomp.status == 'can-do' && (intKomp.status == 'can-do' || intKomp.status == 'unavailable') && hsAvailable) {
        console.log("5")
        intKomp.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: intKomp._id,
          status: intKomp.status,
          grade: null,
        });
      } else {
        console.log("6")
        sozKomp.status = 'unavailable';
        intKomp.status = 'unavailable';
        update_array.push({
          study_id: study.study_id,
          _id: sozKomp._id,
          status: sozKomp.status,
          grade: null,
        },
        {
          study_id: study.study_id,
          _id: intKomp._id,
          status: intKomp.status,
          grade: null,
        });
      }
  
  return update_array;
}
async function checkGwa(study, hsAvailable) {
  const update_array = [];
  const gwa = study.subject_states.find((i) => i._id == "28");
    const forMeth = study.subject_states.find((i) => i._id == "29");
    console.log(hsAvailable)
    if (hsAvailable) {
      if (gwa.status == 'unavailable' && forMeth.status == 'unavailable') {
        gwa.status = 'can-do';
        forMeth.status = 'can-do';
        update_array.push({
          study_id: study.study_id,
          _id: gwa._id,
          status: gwa.status,
          grade: null,
        },
        {
          study_id: study.study_id,
          _id: forMeth._id,
          status: forMeth.status,
          grade: null,
        });
      }  if ((forMeth.status == 'done' || forMeth.status == 'doing')) {
        gwa.status = 'unavailable'
        update_array.push({
          study_id: study.study_id,
          _id: gwa._id,
          status: gwa.status,
          grade: null,
        });
      } else if (forMeth.status == 'can-do' && (gwa.status == 'can-do' || gwa.status == 'unavailable')) {
        gwa.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: gwa._id,
          status: gwa.status,
          grade: null,
        });
      }
      else if ((gwa.status == 'done' || gwa.status == 'doing')) {
        forMeth.status = 'unavailable'
        update_array.push({
          study_id: study.study_id,
          _id: forMeth._id,
          status: forMeth.status,
          grade: null,
        });
      } else if (gwa.status == 'can-do' && (forMeth.status == 'can-do' || forMeth.status == 'unavailable')) {
        forMeth.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: forMeth._id,
          status: forMeth.status,
          grade: null,
        });
      }
    } else {
      gwa.status = 'unavailable';
      forMeth.status = 'unavailable';
      update_array.push({
        study_id: study.study_id,
        _id: gwa._id,
        status: gwa.status,
        grade: null,
      },
      {
        study_id: study.study_id,
        _id: forMeth._id,
        status: forMeth.status,
        grade: null,
      });
    }
  return update_array;
}
async function checkSbwl(study, hsAvailable) {
  const update_array = [];
  const sbwl1 = study.subject_states.find((i) => i._id == "30");
  const sbwl2 = study.subject_states.find((i) => i._id == "31");
  const wahlpf = study.subject_states.find((i) => i._id == "32");
  const bis1 = study.subject_states.find((i) => i._id == "7");
  const statistik = study.subject_states.find((i) => i._id == "11");
  if (hsAvailable) {
    if (([bis1, statistik].every(item => item.status == 'done'))) {
      if (sbwl1.status == 'unavailable') {
        sbwl1.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: sbwl1._id,
          status: sbwl1.status,
          grade: null,
        });
      } if (sbwl2.status == 'unavailable') {
        sbwl2.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: sbwl2._id,
          status: sbwl2.status,
          grade: null,
        });
      } if (wahlpf.status == 'unavailable') {
        wahlpf.status = 'can-do'
        update_array.push({
          study_id: study.study_id,
          _id: wahlpf._id,
          status: wahlpf.status,
          grade: null,
        });
      }

  } else  {
    sbwl1.status = 'unavailable';
    sbwl2.status = 'unavailable';
    wahlpf.status = 'unavailable';
    update_array.push({
      study_id: study.study_id,
      _id: sbwl1._id,
      status: sbwl1.status,
      grade: null,
    },
    {
      study_id: study.study_id,
      _id: sbwl2._id,
      status: sbwl2.status,
      grade: null,
    },
    {
      study_id: study.study_id,
      _id: wahlpf._id,
      status: wahlpf.status,
      grade: null,
    });
  }
} else {
  sbwl1.status = 'unavailable';
  sbwl2.status = 'unavailable';
  wahlpf.status = 'unavailable';
  update_array.push({
    study_id: study.study_id,
    _id: sbwl1._id,
    status: sbwl1.status,
    grade: null,
  },
  {
    study_id: study.study_id,
    _id: sbwl2._id,
    status: sbwl2.status,
    grade: null,
  },
  {
    study_id: study.study_id,
    _id: wahlpf._id,
    status: wahlpf.status,
    grade: null,
  });
}
return update_array;
}
async function checkBachelor(study, hsAvailable) {
  const update_array = [];
  const bis1 = study.subject_states.find((i) => i._id == "7");
  const statistik = study.subject_states.find((i) => i._id == "11");
  const gwa = study.subject_states.find((i) => i._id == "28");
  const forMeth = study.subject_states.find((i) => i._id == "29");
  const bachelorarbeit = study.subject_states.find((i) => i._id == "34");

  if ((hsAvailable && [bis1, statistik].every(item => item.status == 'done')) && (gwa.status == 'done' || forMeth.status == 'done') && bachelorarbeit.status == 'unavailable') {
    bachelorarbeit.status = 'can-do';
    update_array.push({
      study_id: study.study_id,
      _id: bachelorarbeit._id,
      status: bachelorarbeit.status,
      grade: null,
    });
  } else if (!hsAvailable || !([bis1, statistik].every(item => item.status == 'done')) || (gwa.status !== 'done' && forMeth.status !== 'done')) {
    bachelorarbeit.status = 'unavailable';
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
    let steopsDone = checkSTEOPs(study);
    
    const cbkValues = await checkCBK(study)
    cbkValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const checkAmcValues = await checkAMC(study)
    checkAmcValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    let hsAvailable = await checkHs(study);

    const hauptstudiumValues = await checkHauptstudium(study, hsAvailable)
    hauptstudiumValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    hsAvailable = await checkHs(study);
    const checkLvChoiceValues = await checkLvChoice(study, steopsDone, hsAvailable)
    checkLvChoiceValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    hsAvailable = await checkHs(study);
    const checkWikoValues = await checkWiko(study, hsAvailable)
    checkWikoValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const checkSozioValues = await checkSozio(study, hsAvailable)
    checkSozioValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const checkGwaValues = await checkGwa(study, hsAvailable)
    checkGwaValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const sbwlValues = await checkSbwl(study, hsAvailable)
    sbwlValues.forEach((item) => {
      update_array = updateOrAdd(update_array, item)
    })
    const bacherlorarbeitValue = await checkBachelor(study, hsAvailable)
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
 * Funktion zur Berechnung der gesamten ECTS-Punkte für "done"-Fächer
 * @param {Array} subjects - Die Fächer, die überprüft werden sollen
 * @returns {number} - Die Summe der ECTS-Punkte aller "done"-Fächer
 */
 function totalDoneECTS(study) {
  const cbkSubjects = study.subject_states.slice(4, 19) // CBK-Fächer
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
async function checkSTEOPs(study) {
  const steop1 = study.subject_states.find((item) => item._id === '1')
  const steop2 = study.subject_states.find((item) => item._id === '2')
  const steop3 = study.subject_states.find((item) => item._id === '3')
  const steop4 = study.subject_states.find((item) => item._id === '4')
  return [steop1, steop2, steop3, steop4].every((item) => item.status === 'done')
}
async function checkHs (study) {
  const amc1 = study.subject_states.find((i) => i._id == "5");
  const amc2 = study.subject_states.find((i) => i._id == "6");
  const wpr1 = study.subject_states.find((i) => i._id == "10");

  console.log("amc2 status:", amc2.status);
  console.log("wpr1 status:", wpr1.status);

  if (
    [amc1, amc2, wpr1].every(item => item && item.status === "done") &&
    totalDoneECTS(study) >= 27
  ) {
    console.log("HS check passed");
    return true;
  } else {
    console.log("HS done false");
    return false;
  }
}