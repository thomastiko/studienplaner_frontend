<template>
  <div>
    <div>
      <div class="text-h4 q-mt-md q-pa-md">Professor*in hinzufügen</div>
      <div class="q-pa-md" style="max-width: 500px">
        <q-input
          v-model="fnames"
          label="Vorname *"
          outlined
          class="q-mb-md"
          @input="fnames = $event"
        />
        <q-input
          v-model="lnames"
          label="Nachname *"
          outlined
          class="q-mb-md"
          @input="lnames = $event"
        />
        <q-input
          v-model="institutions"
          label="Institution *"
          outlined
          class="q-mb-md"
          @input="institutions = $event"
        />
        <q-input
          v-model="url"
          label="URL"
          type="url"
          outlined
          class="q-mb-md"
          @input="url = $event"
        />
        <q-btn
          label="Hinzufügen"
          color="positive"
          class="q-mb-md"
          :disable="fnames == '' || lnames == '' || institutions == ''"
          @click="addProf(fnames, lnames, institutions, url)"
        />
      </div>
    </div>
    <div class="text-h4 text-center q-mb-md">Kommentare zum Freigeben</div>
    <div v-if="adminStore.comments.length > 0">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          v-for="(comment, i) in adminStore.comments"
          :key="i"
          expand-separator
          default-opened
          icon="perm_identity"
          :label="comment.lname + ' ' + comment.fname"
          :caption="formatDate(comment.date)"
        >
          <q-card>
            <q-card-section>
              <q-editor v-model="comment.text" :toolbar="[]" min-height="5rem" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Freigeben" color="primary" @click="approveComment(comment)" />
              <q-btn
                flat
                label="Löschen"
                color="negative"
                @click="deleteCommentSuggestion(comment._id)"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
    <div v-else class="text-h6 text-center">Aktuell keine Kommentare zum Freigeben!</div>
  </div>
</template>

<script>
import { useAdminStore } from '@/stores/admin.store.js'
import { onMounted } from 'vue'
import { ref } from 'vue'
export default {
  setup() {
    const adminStore = useAdminStore()

    onMounted(() => {
      adminStore.fetchAllComments()
    })
    const formatDate = (isoDate) => {
      const date = new Date(isoDate)
      const day = date.getDate()
      const month = date.getMonth() + 1 // Monat ist nullbasiert
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    }
    const deleteCommentSuggestion = (commentId) => {
      adminStore.deleteCommentSuggestion(commentId)
    }

    const approveComment = (comment) => {
      const profId = comment.profId // Prof ID aus dem Kommentar holen
      const commentId = comment._id // Kommentar ID aus dem Kommentar holen
      const commentText = comment.text // Kommentar Text aus dem Kommentar holen

      adminStore.approveComment(profId, commentId, commentText)
    }

    return {
      adminStore,
      formatDate,
      deleteCommentSuggestion,
      approveComment,
      fnames: ref([]),
      lnames: ref([]),
      institutions: ref([]),
      url: ref('')
    }
  },
  methods: {
    addProf(fnames, lnames, institutions, url) {
      const professor = {
        fname: fnames,
        lname: lnames,
        institute: institutions,
        url: url && url.trim() !== '' ? url : 'not present'
      }
      try {
        this.adminStore.addProf(professor)
      } catch (error) {
        console.error(error)
      }

      this.fnames = ''
      this.lnames = ''
      this.institutions = ''
      this.url = ''
    }
  }
}
</script>

<style></style>
