import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from "axios";

const planner_instance = axios.create({
  baseURL: 'http://192.168.178.29:3000/api/',
  headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
  },
  timeout: 10000,
});


export const useCourseStore = defineStore("course", {
  state: () => {
      return {
        courses: [],
          counter: ref(0)
      }
  },
  actions: {
    async getCourses() {
      const res = await planner_instance.get('/courses');
      this.courses = res.data;
    },
  }
});