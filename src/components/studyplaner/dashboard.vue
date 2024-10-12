<template>
  <div>
    <ul>
      <li>
        <div>Aktuelle LVs: {{allCurrentSubjects.length}} </div>
      </li>
      <li>
        <div>Aktuelle ECTS: {{allCurrentEcts}} </div>
      </li>
      <li>
        <div>Abgeschlossene LVs: {{allCompletedSubjects.length}} </div>
      </li>
      <li>
        <div>Abgeschlossene ECTS: {{allCompletedEcts}} </div>
      </li>
      <li>
        <div>Notendurchschnitt: {{averageGrade}} </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    selectedStudy: {
      type: Object,
      required: true
    }
  },
  computed: {
  // Berechnung der aktuellen Fächer (subject_states, sbwl_states und free electives)
  allCurrentSubjects() {
    const excludedCategories = ['Spezielle Betriebswirtschaftslehre', 'Freies Wahlfach', 'Specializations', 'Free Electives and Internship'];
    
    const currentSubjects = this.selectedStudy.subject_states.filter(
      subject => subject.status === 'doing' && !excludedCategories.includes(subject.category)
    );
    
    const currentSbwlSubjects = this.selectedStudy.sbwl_states.flatMap(sbwl => 
      sbwl.subjects.filter(subject => subject.status === 'doing')
    );
    
    const currentFreeElectives = this.selectedStudy.free_electives.filter(
      elective => elective.status === 'doing' // Alle free_electives ohne Berücksichtigung der Kategorie
    );
    
    return [...currentSubjects, ...currentSbwlSubjects, ...currentFreeElectives];
  },

  // Berechnung der abgeschlossenen Fächer (subject_states, sbwl_states und free electives)
  allCompletedSubjects() {
    const excludedCategories = ['Spezielle Betriebswirtschaftslehre', 'Freies Wahlfach', 'Specializations', 'Free Electives and Internship'];
    
    const completedSubjects = this.selectedStudy.subject_states.filter(
      subject => subject.status === 'done' && !excludedCategories.includes(subject.category)
    );
    
    const completedSbwlSubjects = this.selectedStudy.sbwl_states.flatMap(sbwl => 
      sbwl.subjects.filter(subject => subject.status === 'done')
    );
    
    const completedFreeElectives = this.selectedStudy.free_electives.filter(
      elective => elective.status === 'done' // Alle free_electives ohne Berücksichtigung der Kategorie
    );
    
    return [...completedSubjects, ...completedSbwlSubjects, ...completedFreeElectives];
  },

  // Berechnung der aktuellen ECTS
  allCurrentEcts() {
    return this.allCurrentSubjects.reduce((acc, subject) => acc + (subject.ects || 0), 0);
  },

  // Berechnung der abgeschlossenen ECTS
  allCompletedEcts() {
    return this.allCompletedSubjects.reduce((acc, subject) => acc + (subject.ects || 0), 0);
  },

  // Berechnung des gewichteten Notendurchschnitts
  averageGrade() {
    const gradedSubjects = this.allCompletedSubjects.filter(subject => subject.grade != null);
    
    const totalWeightedGrade = gradedSubjects.reduce((acc, subject) => acc + (subject.grade * subject.ects), 0);
    const totalEcts = gradedSubjects.reduce((acc, subject) => acc + subject.ects, 0);
    
    return totalEcts ? (totalWeightedGrade / totalEcts).toFixed(2) : '-';
  }
}


}
</script>

<style>
</style>
