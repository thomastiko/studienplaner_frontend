<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm">
      Studiengänge
    </div>
    <div class="q-pa-md">
      <q-stepper v-model="step" ref="stepper" color="primary" animated>
        <q-step
          :name="1"
          title="Studiengang auswählen"
          active-icon="fa-solid fa-1"
          icon="fa-sold fa-1"
          :done="step > 1"
        >
          <div class="row justify-center">
            <div class="q-gutter-md">
              <q-card v-ripple class="my-box cursor-pointer" @click="step = 2">
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WISO</div>
                  <div class="text-subtitle2 text-white">
                    Wirtschafts- und Sozialwissenschaften
                  </div>
                </q-card-section>
              </q-card>
              <q-card v-ripple class="my-box cursor-pointer" @click="step = 2">
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WIRE</div>
                  <div class="text-subtitle2 text-white">Wirtschaftsrecht</div>
                </q-card-section>
              </q-card>
              <q-card v-ripple class="my-box cursor-pointer" @click="step = 4">
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

        <q-step
          :name="2"
          title="Jahrgang auswählen"
          active-icon="fa-solid fa-2"
          inactive-icon="fa-solid fa-2"
          icon="fa-solid fa-2"
          :done="step > 2"
        >
          An ad group contains one or more ads which target a shared set of
          keywords.
        </q-step>

        <q-step
          :name="3"
          title="Studienzweig auswählen"
          active-icon="fa-solid fa-3"
          inactive-icon="fa-solid fa-3"
          icon="fa-solid fa-3"
          :done="step > 3"
        >
          This step won't show up because it is disabled.
        </q-step>

        <q-step
          :name="4"
          title="Fertig"
          active-icon="fa-solid fa-4"
          inactive-icon="fa-solid fa-4"
          icon="fa-solid fa-4"
        >
          Try out different ad text to see what brings in the most customers,
          and learn how to enhance your ads using features like ad extensions.
          If you run into any problems with your ads, find out how to tell if
          they're running and how to resolve approval issues.
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              @click="$refs.stepper.next()"
              color="primary"
              :label="step === 4 ? 'Finish' : 'Continue'"
            />
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              label="Back"
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

export default {
  setup() {
    return {
      step: ref(1),
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
</style>
