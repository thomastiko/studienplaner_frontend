import { defineStore } from 'pinia';
import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/auth';

export const useLvStore = defineStore("lv", {
    state: () => {
        return {
            // store shopping cart
            cart: [
                /**
                 * name: string,
                 * ects: number
                 */
            ],
            // courses coming from getCourses are stored here
            list: [
                /*
                * _id: string,
                * name: string,
                * subject_name: string,
                * ...
                */
            ],
            // course_ids coming from getRegisteredCourse are stored here
            course_ids: [
                /**
                 * id: string
                 */
            ],
            // courses coming from getCoursesForIdList are stored here
            calendar: [
                /**
                * _id: string,
                * name: string,
                * subject_name: string,
                * ...
                 */
            ],

            counter: ref(0)
        }
    },
    actions: {
        /**
         * This method adds a subject to the "shopping-cart"
         * @param {string} name The name of the subject
         * @param {number} ects The ects count the subject is "worth"
         * @param {index} index The index of the subject
         */
        addToCart(name, ects) {
            const isNameInCart = this.cart.some(item => item.name === name);
            if (!isNameInCart) {
                this.cart.push({ name, ects })
            } else {
                return
            }

        },
        removeFromCart(index) {
            this.cart.splice(index, 1)
        },
        /**
         * Given a set of subjects this method returns all the courses that are available this semester
         * 
         * @param {Array} subjects The subjects to search for
         */
        async getCourses(subjects) {
            const res = await planner_instance.post("/course/subject_list", subjects)
            this.list = res.data
            return res.data
        },
        /**
         * Searches for user's registered course_ids
         * 
         * 
         */
        async getRegisteredCourseIds() {
            const res = await planner_instance.get("/course/user")
            this.course_ids = res.data
            return res.data
        },
        /**
         * Given a set of course_ids this method returns array of courses data (name, subject_name, ...)
         * 
         * @param {Array} course_ids the course_ids to search for
         */
        async getCoursesForIdList() {
            if (this.course_ids.length === 0) return [];
            const ids = this.course_ids.map(item => item.course_id)
            const color = this.course_ids.map(item => item.color)
            const res = await planner_instance.post("/course/id_list", ids)
            res.data.forEach(course => {
                course.color = color[ids.indexOf(course._id)]
            });
            return res.data
        },
        /**
         * combines getRegisteredCourseIds and getCoursesForIdList and pushes the result to the calendar
         * 
         * 
         */
        async fetchRegisteredCourses() {
            await this.getRegisteredCourseIds();
            this.calendar = await this.getCoursesForIdList();
            return this.calendar
        },
        /**
         * Adds a course to the user's planner
         * @param {*} courseID 
         * @param {*} notify A quasar notify object
         */
        async storeCourse(courseID, notify = false) {
            try {
                const res = await planner_instance.patch(`/course/user/${courseID}`)

                // just for development
                console.log('Store Course Response: ', res.status);

                if (notify) {
                    if (res.status === 200) {

                        notify({
                            type: 'positive',
                            icon: "done",
                            message: "Course successfully added"
                        });

                    } else {
                        notify({
                            type: 'negative',
                            icon: "error",
                            message: `Something went wrong (${res.response.status}): ${res.response.data.message || ""}`
                        });
                    }
                }
            } catch (error) {
                if (notify) {
                    notify({
                        type: 'negative',
                        icon: "error",
                        message: "Something went wrong: " + error.response.data.message || ""
                    });
                }
                console.log(error)
            }
        },
        async removeCourse(courseID, notify = false) {
            try {
                const res = await planner_instance.delete(`/course/user/${courseID}`)

                // just for development
                console.log('Remove Course Response: ', res);
                console.log(notify)

                if (notify) {
                    if (res.status === 200) {

                        notify({
                            type: 'positive',
                            icon: "done",
                            message: "Course successfully removed"
                        });

                    } else {
                        notify({
                            type: 'negative',
                            icon: "error",
                            message: `Something went wrong (${res.response.status}): ${res.response.data.message || ""}`
                        });
                    }
                }

            } catch (error) {
                if (notify) {
                    notify({
                        type: 'negative',
                        icon: "error",
                        message: "Something went wrong: " + error.response.data.message || ""
                    });
                }
                console.log(error)
            }
        },
        async changeColor(courseID, changedColor) {
            const res = await planner_instance.post(`course/color/${courseID}`, {color: changedColor })
            return res.data
        },
        async searchCourse() {
            const res = await planner_instance.get("/course/search")
            return res.data
        }

    }
});