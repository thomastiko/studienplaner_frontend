function showPath(study, subject) {
    const update_array = []
    if (subject._id >= 4 && subject._id <= 14) {
      const steop1 = study.subject_states.find((i) => i._id == '1')
      const steop2 = study.subject_states.find((i) => i._id == '2')
      const steop3 = study.subject_states.find((i) => i._id == '3')
      update_array.push(steop1, steop2, steop3)
    } else if (subject._id >= 15 && subject._id <= 36) {
      update_array.push({ type: 'text', key: 'paths.wiso_bwl_hs' })
  
      if (subject._id == 36) {
        const item = study.subject_states.find((i) => i._id == '4')
        const item2 = study.subject_states.find((i) => i._id == '12')
        const item3 = study.subject_states.find((i) => i._id == '13')
  
        update_array.push(item, item2, item3)
      }
    } else if (subject._id == 37) {
      update_array.push({ type: 'text', key: 'paths.wiso_bwl_fw' })
  
    } else if (subject._id == 38) {
      const steop1 = study.subject_states.find((i) => i._id == '1')
      const steop2 = study.subject_states.find((i) => i._id == '2')
      const steop3 = study.subject_states.find((i) => i._id == '3')
      const item = study.subject_states.find((i) => i._id == '4')
      const item2 = study.subject_states.find((i) => i._id == '12')
      const item3 = study.subject_states.find((i) => i._id == '13')
      const item4 = study.subject_states.find((i) => i._id == '14')
  
      update_array.push({ type: 'text', key: 'paths.wiso_bwl_hs' })
      update_array.push(steop1, steop2, steop3, item, item2, item3, item4)
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
  