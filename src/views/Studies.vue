<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm">
      Studien&shy;gänge
    </div>
    <div class="q-pa-md">
      <q-stepper
        v-model="step"
        class="stepper"
        ref="stepper"
        color="primary"
        animated
      >
        <!-- Schritt 1: Studiengang auswählen -->
        <q-step
          class="step"
          :name="1"
          title="Studiengang auswählen"
          active-icon="fa-solid fa-1"
          icon="fa-solid fa-1"
          :done="step > 1"
        >
          <div class="row justify-center">
            <div class="q-gutter-md">
              <q-card
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectStudy('WISO')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WISO</div>
                  <div class="text-subtitle2 text-white">
                    Wirtschafts- und Sozialwissenschaften
                  </div>
                </q-card-section>
              </q-card>
              <q-card
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectStudy('WIRE')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WIRE</div>
                  <div class="text-subtitle2 text-white">Wirtschaftsrecht</div>
                </q-card-section>
              </q-card>
              <q-card
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectStudy('bbe')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">BBE</div>
                  <div class="text-subtitle2 text-white">
                    Business and Economics
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-step>

        <!-- Schritt 2: Jahrgang auswählen (nur für WISO und WIRE) -->
        <q-step
          class="step"
          :name="2"
          title="Jahrgang auswählen"
          active-icon="fa-solid fa-2"
          icon="fa-solid fa-2"
          :done="step > 2"
        >
          <div
            v-if="selectedStudy === 'WISO' || selectedStudy === 'WIRE'"
            class="row justify-center"
          >
            <div class="q-gutter-md">
              <q-card v-if="selectedStudy === 'WISO'"
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectYear('WISO 23')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WISO 23</div>
                  <div class="text-subtitle2 text-white">
                    Wirtschafts- und Sozialwissenschaften
                  </div>
                </q-card-section>
              </q-card>
              <q-card v-if="selectedStudy === 'WISO'"
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectYear('WISO 19')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WISO 19</div>
                  <div class="text-subtitle2 text-white">
                    Wirtschafts- und Sozialwissenschaften
                  </div>
                </q-card-section>
              </q-card>
              <q-card v-if="selectedStudy === 'WIRE'"
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectYear('wire')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WIRE 16</div>
                  <div class="text-subtitle2 text-white">
                    Wirtschaftsrecht
                  </div>
                </q-card-section>
              </q-card>
              <q-card v-if="selectedStudy === 'WIRE'"
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectYear('wire-23')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WIRE 23</div>
                  <div class="text-subtitle2 text-white">
                    Wirtschaftsrecht
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div v-else>
            <p>Wähle zuerst einen Studiengang</p>
          </div>
        </q-step>

        <!-- Schritt 3: Zweig auswählen (nur für WISO 23) -->
        <q-step
          class="step"
          :name="3"
          title="Studienzweig auswählen"
          active-icon="fa-solid fa-3"
          icon="fa-solid fa-3"
          :done="step > 3"
        >
          <div
            v-if="selectedStudy === 'WISO' && selectedYear === 'WISO 23'"
            class="row justify-center"
          >
            <div class="q-gutter-md">
              <q-btn
                label="Betriebswirtschaft"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-bwl-23')"
              />
              <q-btn
                label="Internationale Betriebswirtschaft"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-ibw-23')"
              />
              <q-btn
                label="Volkswirtschaft"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-vwl-23')"
              />
              <q-btn
                label="Wirtschaftsinformatik"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-winf-23')"
              />
              <q-btn
                label="Wirtschaft - Umwelt - Politik"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-wupol-23')"
              />
            </div>
          </div>


        <!-- Schritt 3: Zweig auswählen (nur für WISO 19) -->

        
          <div
            v-if="selectedStudy === 'WISO' && selectedYear === 'WISO 19'"
            class="row justify-center"
          >
            <div class="q-gutter-md">
              <q-btn
                label="Betriebswirtschaft"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-bwl')"
              />
              <q-btn
                label="Internationale Betriebswirtschaft"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-ibw')"
              />
              <q-btn
                label="Volkswirtschaft"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-vwl')"
              />
              <q-btn
                label="Sozioökonomie"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-sz')"
              />
              <q-btn
                label="Wirtschaftsinformatik"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-winf')"
              />
            </div>
          </div>
        </q-step>

        <!-- Schritt 4: Fertig -->
        <q-step
          class="step"
          :name="4"
          title="Fertig"
          active-icon="fa-solid fa-4"
          icon="fa-solid fa-4"
        >
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-h6">Deine Auswahl</div>
              <p><strong>Studiengang:</strong> {{ selectedStudy }}</p>
              <p v-if="selectedYear && selectedStudy !== 'bbe'">
                <strong>Jahrgang:</strong> {{ selectedYear }}
              </p>
              <p
                v-if="
                  selectedBranch &&
                  selectedStudy !== 'bbe' &&
                  selectedStudy !== 'WIRE'
                "
              >
                <strong>Zweig:</strong> {{ selectedBranch }}
              </p>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                @click="confirmSelection"
                label="Bestätigen"
                color="primary"
              />
            </q-card-actions>
          </q-card>
        </q-step>

        <!-- Navigation -->
        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              label="Zurück"
              icon="arrow_back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "@/stores/user.store";

export default {
  setup() {
    const userStore = useUserStore();
    const step = ref(1);
    const selectedStudy = ref(null);
    const selectedYear = ref(null);
    const selectedBranch = ref(null);

    const selectStudy = (study) => {
      selectedStudy.value = study;
      if (study === "bbe") {
        step.value = 4;
        selectedYear.value = null;
        selectedBranch.value = null;
      } else {
        step.value = 2; // Bei anderen Studiengängen zu Schritt 2
      }
    };

    const selectYear = (year) => {
      selectedYear.value = year;
      console.log(selectedYear.value);
      if (selectedStudy.value === "WISO") {
        step.value = 3; // Bei WISO zu Schritt 3
      } else {
        step.value = 4;
        selectedBranch.value = null;
      }
    };

    const selectBranch = (branch) => {
      selectedBranch.value = branch;
      step.value = 4;
    };

    const confirmSelection = async () => {
      // Formatieren der Study ID
      let studyId = selectedStudy.value;
      if (selectedYear.value) {
        studyId = selectedYear.value;
      }
      if (selectedBranch.value) {
        studyId = selectedBranch.value; // Zweig verwenden, wenn vorhanden
      }

      try {
        // Studiengang speichern
        await userStore.addStudy(studyId);

        alert(
          `Auswahl bestätigt und gespeichert: ${selectedStudy.value}, ${selectedYear.value}, ${
            selectedBranch.value || "kein Zweig"
          }`
        );
      } catch (error) {
        console.error("Fehler beim Speichern des Studiengangs:", error);
      }
    };

    return {
      step,
      selectedStudy,
      selectedYear,
      selectedBranch,
      selectStudy,
      selectYear,
      selectBranch,
      confirmSelection,
    };
  },
};
</script>

<style scoped>
.my-box {
  transition: all 0.3s;
}

.my-box:hover {
  filter: brightness(1.1);
}
.step {
  min-height: 400px;
}
</style>
