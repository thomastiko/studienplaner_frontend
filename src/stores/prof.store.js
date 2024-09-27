import { defineStore } from "pinia";
import axios from "axios";

import { HOST } from "./config";

const profcheck_instance = axios.create({
  baseURL: `${HOST}/api/profcheck/v2`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

profcheck_instance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (access_token) {
      config.headers["Authorization"] = "Bearer " + access_token;
    }

    if (refresh_token) {
      config.headers["x-refresh"] = refresh_token;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const useProfStore = defineStore("prof", {
  state: () => {
    return {
      professors: [],
      ratings: [],
      selected: null,
    };
  },
  actions: {
    /**
     * Fetches all professors from the backend.
     * @returns {Promise<Prof[]>}
     */
    async fetchProfessors() {
      try {
        const response = await profcheck_instance.get("/prof");

        if (response.status === 200) {
          this.professors = response.data;
          return response;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async setSelected(profId) {
      let prof = false;

      // first check if the prof is cached
      for (const p of this.professors) {
        if (p._id === profId) {
          prof = p;
        }
      }

      if (prof) {
        this.selected = prof;
      } else {
        this.selected = await this.findProf(profId);
      }

      return this.selected;
    },
    async findProf(profId) {
      let prof = false;

      // first check if the prof is cached
      for (const p of this.professors) {
        if (p._id === profId) {
          prof = p;
        }
      }

      if (!prof) {
        try {
          const response = axios.get("/prof/byid/" + profId);

          if (response.status === 200) {
            return response.data;
          }
        } catch (e) {
          return { status: e.code, message: e.message };
        }
      }
    },

    async getProfAvg(profId) {
      try {
        const response = await profcheck_instance.get("/prof/average/" + profId);

        if (response.status === 200) {
          return response;
        }
      } catch (e) {
        return { status: e.code, message: e.message };
      }
    },

    async fetchFactors() {
      try {
        const response = await profcheck_instance.get("/rating/factors");

        if (response.status === 200) {
          return response;
        }
      } catch (e) {
        return { status: e.code, message: e.message };
      }
    },

    async postRating(rating_data) {
      try {
        const response = await profcheck_instance.post("/rating/new", rating_data);

        if (response.status === 200 || response.status === 201) {
          return response;
        }
      } catch (e) {
        return { status: e.code, message: e.message };
      }
    }
  },
  persist: true,
});
