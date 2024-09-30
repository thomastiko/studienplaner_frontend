import allData from '@/stores/sbwls.json';

const sbwls = allData;

const studiesMap = {};

// Create a map for faster lookup
sbwls.forEach(specialization => {
  Object.keys(specialization.study).forEach(id => {
    if (!studiesMap[id]) {
      studiesMap[id] = [];
    }
    studiesMap[id].push(specialization);
  });
});

export function getStudy(study_ids) {
  if (!Array.isArray(study_ids)) {
    study_ids = [study_ids];
  }

  return sbwls.filter(obj =>
    study_ids.some(id => Object.keys(obj.study).includes(id))
  );
}