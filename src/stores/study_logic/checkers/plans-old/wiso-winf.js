async function checkCBK(study, isRunningCheckCBK, data) {
  const update_array = [];
  const bwlChoice = study.subjectStatusEntry.filter((item) =>
    ["14", "15", "16", "17"].includes(item.subject_id)
  );
  const steop1 = study.subjectStatusEntry.find((i) => i.subject_id == "1");
  const steop2 = study.subjectStatusEntry.find((i) => i.subject_id == "2");
  const steop3 = study.subjectStatusEntry.find((i) => i.subject_id == "3");
  const steop4 = study.subjectStatusEntry.find((i) => i.subject_id == "4");
  if ([steop1, steop2, steop3, steop4].every((item) => item.status == "done")) {
    data.isRunningCheckCBK = true;
    study.subjectStatusEntry.forEach((item) => {
      if (
        item.subject_id >= 5 &&
        item.subject_id <= 13 &&
        item.subject_id != 6 &&
        item.status == "unavailable"
      ) {
        update_array.push({
          study_id: study.study_id,
          subject_id: item.subject_id,
          status: "can-do",
          grade: 0,
        });
      }
    });
    bwlChoice.forEach((item) => {
      if (item.status == "unavailable") {
        update_array.push({
          study_id: study.study_id,
          subject_id: item.subject_id,
          status: "can-do",
          grade: 0,
        });
      }
    });
  } else {
    study.subjectStatusEntry.forEach((item) => {
      if (parseInt(item.subject_id, 10) > 4) {
        update_array.push({
          study_id: study.study_id,
          subject_id: item.subject_id,
          status: "unavailable",
          grade: 0,
        });
      }
    });
    data.isRunningCheckCBK = false;
  }
  return update_array;
}
async function checkAMC(study) {
  const update_array = [];
  const amc1 = study.subjectStatusEntry.find((i) => i.subject_id == "5");
  const amc2 = study.subjectStatusEntry.find((i) => i.subject_id == "6");
  if (amc1.status == "done" && amc2.status == "unavailable") {
    amc2.status = "can-do";
    update_array.push({
      study_id: study.study_id,
      subject_id: amc2.subject_id,
      status: amc2.status,
      grade: 0,
    });
  } else if (amc1.status !== "done") {
    amc2.status = "unavailable";
    update_array.push({
      study_id: study.study_id,
      subject_id: amc2.subject_id,
      status: amc2.status,
      grade: 0,
    });
  }

  return update_array;
}
async function checkHauptstudium(study, twoLvCheck, ectsCount, data) {
  const update_array = [];
  const hauptstudium = study.subjectStatusEntry.slice(13, 37);
  const hauptstudiumFiltered = hauptstudium.filter(
    (item) =>
      ![
        "14",
        "15",
        "16",
        "18",
        "21",
        "22",
        "32",
        "33",
        "34",
        "35",
        "37",
      ].includes(item.subject_id)
  );
  const hauptstudiumFiltered2x = hauptstudiumFiltered.filter(
    (item) => !["14", "15", "16", "17"].includes(item.subject_id)
  );
  const amc1 = study.subjectStatusEntry.find((i) => i.subject_id == "5");
  const amc2 = study.subjectStatusEntry.find((i) => i.subject_id == "6");
  const wpr1 = study.subjectStatusEntry.find((i) => i.subject_id == "10");
  if (
    [amc1, amc2, wpr1].every(
      (item) => item.status == "done" && data.ectsCount >= 43
    )
  ) {
    data.twoLvCheck = true;
    hauptstudiumFiltered.forEach((item) => {
      if (item.status == "unavailable") {
        item.status = "can-do";
        update_array.push({
          study_id: study.study_id,
          subject_id: item.subject_id,
          status: item.status,
          grade: 0,
        });
      }
    });
  } else {
    data.twoLvCheck = false;
    hauptstudiumFiltered2x.forEach((item) => {
      item.status = "unavailable";
      update_array.push({
        study_id: study.study_id,
        subject_id: item.subject_id,
        status: item.status,
        grade: 0,
      });
    });
  }
  return update_array;
}
async function checkLvChoice(study, isRunningCheckCBK, twoLvCheck, data) {
  const update_array = [];
  let bwlChoice = study.subjectStatusEntry.filter((item) =>
    ["14", "15", "16", "17"].includes(item.subject_id)
  );
  let lvChoiceHs = study.subjectStatusEntry.filter((item) =>
    ["14", "15", "16", "18"].includes(item.subject_id)
  );
  const doneItems = bwlChoice.filter(
    (item) => item.status == "done" || item.status == "doing"
  );
  const doneItems2 = lvChoiceHs.filter(
    (item) => item.status == "done" || item.status == "doing"
  );
  if (data.isRunningCheckCBK && !data.twoLvCheck) {
    if (doneItems.length >= 3) {
      bwlChoice.forEach((item) => {
        item.status = "can-do";
        update_array.push({
          study_id: study.study_id,
          subject_id: item.subject_id,
          status: item.status,
          grade: 0,
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
            subject_id: item.subject_id,
            status: item.status,
            grade: 0,
          });
        }
      });
    } else {
      bwlChoice.forEach((item) => {
        if (item.status == "unavailable") {
          item.status = "can-do";
          update_array.push({
            study_id: study.study_id,
            subject_id: item.subject_id,
            status: item.status,
            grade: 0,
          });
        }
      });
    }
  } else if (data.isRunningCheckCBK && data.twoLvCheck) {
    if (doneItems2.length >= 3) {
      lvChoiceHs.forEach((item) => {
        if (item.status == "can-do") {
          item.status = "unavailable";
          update_array.push({
            study_id: study.study_id,
            subject_id: item.subject_id,
            status: item.status,
            grade: 0,
          });
        }
      });
    } else {
      lvChoiceHs.forEach((item) => {
        if (item.status == "unavailable") {
          item.status = "can-do";
          update_array.push({
            study_id: study.study_id,
            subject_id: item.subject_id,
            status: item.status,
            grade: 0,
          });
        }
      });
      bwlChoice.forEach((item) => {
        if (item.status == "unavailable") {
          item.status = "can-do";
          update_array.push({
            study_id: study.study_id,
            subject_id: item.subject_id,
            status: item.status,
            grade: 0,
          });
        }
      });
    }
  }
  return update_array;
}

async function checkSozio(study, twoLvCheck) {
  const update_array = [];
  const sozKomp = study.subjectStatusEntry.find((i) => i.subject_id == "21");
  const intKomp = study.subjectStatusEntry.find((i) => i.subject_id == "22");
  if (twoLvCheck) {
    {
      if (sozKomp.status == "unavailable" && intKomp.status == "unavailable") {
        sozKomp.status = "can-do";
        intKomp.status = "can-do";
        update_array.push(
          {
            study_id: study.study_id,
            subject_id: sozKomp.subject_id,
            status: sozKomp.status,
            grade: 0,
          },
          {
            study_id: study.study_id,
            subject_id: intKomp.subject_id,
            status: intKomp.status,
            grade: 0,
          }
        );
      }
      if (intKomp.status == "done" || intKomp.status == "doing") {
        sozKomp.status = "unavailable";
        update_array.push({
          study_id: study.study_id,
          subject_id: sozKomp.subject_id,
          status: sozKomp.status,
          grade: 0,
        });
      } else if (
        intKomp.status == "can-do" &&
        (sozKomp.status == "can-do" || sozKomp.status == "unavailable")
      ) {
        sozKomp.status = "can-do";
        update_array.push({
          study_id: study.study_id,
          subject_id: sozKomp.subject_id,
          status: sozKomp.status,
          grade: 0,
        });
      } else if (sozKomp.status == "done" || sozKomp.status == "doing") {
        intKomp.status = "unavailable";
        update_array.push({
          study_id: study.study_id,
          subject_id: intKomp.subject_id,
          status: intKomp.status,
          grade: 0,
        });
      } else if (
        sozKomp.status == "can-do" &&
        (intKomp.status == "can-do" || intKomp.status == "unavailable")
      ) {
        intKomp.status = "can-do";
        update_array.push({
          study_id: study.study_id,
          subject_id: intKomp.subject_id,
          status: intKomp.status,
          grade: 0,
        });
      }
    }
  } else {
    sozKomp.status = "unavailable";
    intKomp.status = "unavailable";
    update_array.push(
      {
        study_id: study.study_id,
        subject_id: sozKomp.subject_id,
        status: sozKomp.status,
        grade: 0,
      },
      {
        study_id: study.study_id,
        subject_id: intKomp.subject_id,
        status: intKomp.status,
        grade: 0,
      }
    );
  }
  return update_array;
}
async function checkGwa(study, twoLvCheck) {
  const update_array = [];
  const gwa = study.subjectStatusEntry.find((i) => i.subject_id == "32");
  const forMeth = study.subjectStatusEntry.find((i) => i.subject_id == "33");
  if (twoLvCheck) {
    {
      if (gwa.status == "unavailable" && forMeth.status == "unavailable") {
        gwa.status = "can-do";
        forMeth.status = "can-do";
        update_array.push(
          {
            study_id: study.study_id,
            subject_id: gwa.subject_id,
            status: gwa.status,
            grade: 0,
          },
          {
            study_id: study.study_id,
            subject_id: forMeth.subject_id,
            status: forMeth.status,
            grade: 0,
          }
        );
      }
      if (forMeth.status == "done" || forMeth.status == "doing") {
        gwa.status = "unavailable";
        update_array.push({
          study_id: study.study_id,
          subject_id: gwa.subject_id,
          status: gwa.status,
          grade: 0,
        });
      } else if (
        forMeth.status == "can-do" &&
        (gwa.status == "can-do" || gwa.status == "unavailable")
      ) {
        gwa.status = "can-do";
        update_array.push({
          study_id: study.study_id,
          subject_id: gwa.subject_id,
          status: gwa.status,
          grade: 0,
        });
      } else if (gwa.status == "done" || gwa.status == "doing") {
        forMeth.status = "unavailable";
        update_array.push({
          study_id: study.study_id,
          subject_id: forMeth.subject_id,
          status: forMeth.status,
          grade: 0,
        });
      } else if (
        gwa.status == "can-do" &&
        (forMeth.status == "can-do" || forMeth.status == "unavailable")
      ) {
        forMeth.status = "can-do";
        update_array.push({
          study_id: study.study_id,
          subject_id: forMeth.subject_id,
          status: forMeth.status,
          grade: 0,
        });
      }
    }
  } else {
    gwa.status = "unavailable";
    forMeth.status = "unavailable";
    update_array.push(
      {
        study_id: study.study_id,
        subject_id: gwa.subject_id,
        status: gwa.status,
        grade: 0,
      },
      {
        study_id: study.study_id,
        subject_id: forMeth.subject_id,
        status: forMeth.status,
        grade: 0,
      }
    );
  }
  return update_array;
}
async function checkSbwl(study, twoLvCheck) {
  const update_array = [];
  const sbwl1 = study.subjectStatusEntry.find((i) => i.subject_id == "34");
  const sbwl2 = study.subjectStatusEntry.find((i) => i.subject_id == "35");
  const amc1 = study.subjectStatusEntry.find((i) => i.subject_id == "5");
  const amc2 = study.subjectStatusEntry.find((i) => i.subject_id == "6");
  const bis1 = study.subjectStatusEntry.find((i) => i.subject_id == "7");
  const statistik = study.subjectStatusEntry.find((i) => i.subject_id == "11");
  const wpr1 = study.subjectStatusEntry.find((i) => i.subject_id == "10");
  if (twoLvCheck) {
    if (
      [amc1, amc2, bis1, statistik, wpr1].every((item) => item.status == "done")
    ) {
      if (sbwl1.status == "unavailable" && sbwl2.status == "unavailable") {
        sbwl1.status = "can-do";
        sbwl2.status = "can-do";
        update_array.push(
          {
            study_id: study.study_id,
            subject_id: sbwl1.subject_id,
            status: sbwl1.status,
            grade: 0,
          },
          {
            study_id: study.study_id,
            subject_id: sbwl2.subject_id,
            status: sbwl2.status,
            grade: 0,
          }
        );
      }
    } else if (
      ![amc1, amc2, bis1, statistik, wpr1].every(
        (item) => item.status == "done"
      )
    ) {
      sbwl1.status = "unavailable";
      sbwl2.status = "unavailable";
      update_array.push(
        {
          study_id: study.study_id,
          subject_id: sbwl1.subject_id,
          status: sbwl1.status,
          grade: 0,
        },
        {
          study_id: study.study_id,
          subject_id: sbwl2.subject_id,
          status: sbwl2.status,
          grade: 0,
        }
      );
    }
  } else if (
    ![amc1, amc2, bis1, statistik, wpr1].every((item) => item.status == "done")
  ) {
    sbwl1.status = "unavailable";
    sbwl2.status = "unavailable";
    update_array.push(
      {
        study_id: study.study_id,
        subject_id: sbwl1.subject_id,
        status: sbwl1.status,
        grade: 0,
      },
      {
        study_id: study.study_id,
        subject_id: sbwl2.subject_id,
        status: sbwl2.status,
        grade: 0,
      }
    );
  }
  return update_array;
}
async function checkBachelorarbeit(study) {
  const update_array = [];
  const amc1 = study.subjectStatusEntry.find((i) => i.subject_id == "5");
  const amc2 = study.subjectStatusEntry.find((i) => i.subject_id == "6");
  const bis1 = study.subjectStatusEntry.find((i) => i.subject_id == "7");
  const statistik = study.subjectStatusEntry.find((i) => i.subject_id == "11");
  const gwa = study.subjectStatusEntry.find((i) => i.subject_id == "32");
  const forMeth = study.subjectStatusEntry.find((i) => i.subject_id == "33");
  const bachelorarbeit = study.subjectStatusEntry.find(
    (i) => i.subject_id == "37"
  );
  const wpr1 = study.subjectStatusEntry.find((i) => i.subject_id == "10");

  if (
    [amc1, amc2, bis1, statistik, wpr1].every(
      (item) => item.status == "done"
    ) &&
    (gwa.status == "done" || forMeth.status == "done") &&
    bachelorarbeit.status == "unavailable"
  ) {
    bachelorarbeit.status = "can-do";
    update_array.push({
      study_id: study.study_id,
      subject_id: bachelorarbeit.subject_id,
      status: bachelorarbeit.status,
      grade: 0,
    });
  } else if (
    ![amc1, amc2, bis1, statistik, wpr1].every(
      (item) => item.status == "done"
    ) ||
    (gwa.status !== "done" && forMeth.status !== "done")
  ) {
    bachelorarbeit.status = "unavailable";
    update_array.push({
      study_id: study.study_id,
      subject_id: bachelorarbeit.subject_id,
      status: bachelorarbeit.status,
      grade: 0,
    });
  }
  return update_array;
}
export default {
  /** @TIKO @TODO Documentation
   * Checks the study plan for the WISO IBW Bachelor
   * @param {*} study The study object
   * @param {*} data
   * @param {*} isRunningCheckCBK
   * @param {*} twoLvCheck
   * @param {*} ectsCount
   * @returns {Array} update_array An array of subject updates that have to be pushed to the backend
   */
  async executeAll(study, data, isRunningCheckCBK, twoLvCheck, ectsCount) {
    const update_array = [
      /**
       * {
       *   study_id: string,
       *   subject_id: number,
       *   status: string,
       *   grade: number
       * }
       * */
    ];

    const cbkValues = await checkCBK(study, isRunningCheckCBK, data);
    const amcValues = await checkAMC(study);
    const hauptstudiumValues = await checkHauptstudium(
      study,
      twoLvCheck,
      ectsCount,
      data
    );
    const lvChoiceValues = await checkLvChoice(
      study,
      isRunningCheckCBK,
      twoLvCheck,
      data
    );
    const sozioValues = await checkSozio(study, twoLvCheck);
    const gwaValues = await checkGwa(study, twoLvCheck);
    const sbwlValues = await checkSbwl(study, twoLvCheck);
    const bachelorarbeitValues = await checkBachelorarbeit(study, twoLvCheck);

    update_array.push({ cbkValues });
    update_array.push({ amcValues });
    update_array.push({ hauptstudiumValues });
    update_array.push({ lvChoiceValues });
    update_array.push({ sozioValues });
    update_array.push({ gwaValues });
    update_array.push({ sbwlValues });
    update_array.push({ bachelorarbeitValues });

    return update_array;
  },
};
