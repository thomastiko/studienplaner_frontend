<template>
  <div>
    <q-list v-if="adminStore.comments.length > 0" bordered class="rounded-borders">
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
            <q-btn flat label="Löschen" color="negative" @click="deleteComment(comment._id)" />
          </q-card-actions>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else class="text-h4 text-center">Aktuell keine Kommentare zum Freigeben!</div>
  </div>
</template>

<script>
import { useAdminStore } from '@/stores/admin.store.js'
import { onMounted } from 'vue'
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
    const deleteComment = (commentId) => {
      adminStore.deleteComment(commentId)
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
      deleteComment,
      approveComment
    }
  }
}
</script>

<style></style>
