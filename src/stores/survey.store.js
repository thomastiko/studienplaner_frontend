import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from "axios";

const planner_instance = axios.create({
  baseURL: 'https://taigowiz.org/api', // Change this to your API Backend URL
  headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
  },
  timeout: 10000,
});

export const useSurveyStore = defineStore('survey', {
    state: () => ({
      userStudies: ref([]), // wiso-vwl, wiso-bwl, wire,...
      userResult: [
        /**
         * { id: 'number', question: 'String', weight: 'Number'},
         */
      ],
      surveyData: [],
      userSpezialization: ref([]),
      counter: ref(0),
    }),
    actions: {
      addAnswer(answer) {
        this.userResult.push(answer);
      },
      addStudies(studies) {
        this.userStudies.value = studies;
      },
      addSpezialization(spezialization) {
        this.userSpezialization.value = spezialization;
      },
      async submitSurvey() {
        try {
          const answersArray = [...this.userResult]; 
          const studiesArray = [...this.userStudies.value];
          const spezializationArray = [...this.userSpezialization.value];    
          const response = await planner_instance.post('/surveys', {
            studies: studiesArray,
            spezialization: spezializationArray,
            answers: answersArray,
          });
          //console.log('Survey submitted:', response.data);
        } catch (error) {
          console.error('Error submitting survey:', error);
          throw error;
        }
      },
      async fetchSurveyData() {
        try {
          const response = await planner_instance.get('/surveys');
          this.surveyData = response.data;
          console.log('Survey data fetched:', this.surveyData);
        } catch (error) {
          console.error('Error fetching survey data:', error);
          throw error; // Re-throw the error to be caught by the caller
        }
      },
    },
    });