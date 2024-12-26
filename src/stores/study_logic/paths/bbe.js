function showPath(study, subject) {
    const update_array = [];
    const steop1 = study.subject_states.find((i) => i._id == "1");
    const steop2 = study.subject_states.find((i) => i._id == "2");
    if (subject._id > 4 && subject._id <= 22) {
        update_array.push(steop1, steop2);
        if (subject._id == 5 || subject._id == 6) {
            const quanMeth2 = study.subject_states.find((i) => i._id == "4");
            update_array.push(quanMeth2);
        } else if (subject._id == 20) {
            update_array.push({ type: 'text', key: 'paths.bbe_specialisations' });
        } else if (subject._id == 21) {
            const academicSkills1 = study.subject_states.find(
                (i) => i._id == "17"
              );
              const academicSkills2 = study.subject_states.find(
                (i) => i._id == "18"
              );
                update_array.push(academicSkills1, academicSkills2);
        }
    }

    return update_array;

}
  export default {
    executePath(study, subject) {
        let update_array = [];
      update_array = showPath(study, subject);
      return update_array;
    },
  };
  