function showPath(study, subject) {
  const update_array = []
  if (subject._id > 3 && subject._id < 35) {
    const steop1 = study.subject_states.find((i) => i._id == '1')
    const steop2 = study.subject_states.find((i) => i._id == '2')
    const steop3 = study.subject_states.find((i) => i._id == '3')
    update_array.push(steop1, steop2, steop3)

    if (subject._id >= 15 && subject._id <= 21) {
      const glzr = study.subject_states.find((i) => i._id == '13')
      update_array.push(glzr)
      if (subject._id == 18) {
        const zff = study.subject_states.find((i) => i._id == '17')
        update_array.push(zff)
      }
      else if (subject._id == 19) {
        const fps = study.subject_states.find((i) => i._id == '18')
        update_array.push(fps)
      }
    }
    
    else if (subject._id == 22 || subject._id == 23) {
      const goer = study.subject_states.find((i) => i._id == '12')
      const glzr = study.subject_states.find((i) => i._id == '13')

        update_array.push(goer, glzr)
      
    } 
    
    else if (subject._id >= 24 && subject._id <= 33) {
        const goer = study.subject_states.find((i) => i._id == '12')

        update_array.push(goer)
        if (subject._id == 27) {
            const item1 = study.subject_states.find((i) => i._id == '24')
            const item2 = study.subject_states.find((i) => i._id == '25')
            const item3 = study.subject_states.find((i) => i._id == '26')

            update_array.push(item1, item2, item3)
        } else if (subject._id == 28) {
            const item1 = study.subject_states.find((i) => i._id == '27')

            update_array.push(item1)
        }
    }

    else if (subject._id == 34) {
        update_array.push({ type: 'text', key: 'paths.wire_specialisations' });
    }
  } else {
    update_array.push({ type: 'text', key: 'paths.wire_ba' });
  }

  return update_array
}
export default {
  executePath(study, subject) {
    let update_array = []
    update_array = showPath(study, subject)
    return update_array
  }
}
