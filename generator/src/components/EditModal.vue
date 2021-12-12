<template>
  <v-dialog v-if="item != undefined" v-model="opened" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit Item</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Override Title"
                v-model="item.title"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Override Description"
                v-model="item.description"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                :items="possibleLabels"
                v-model="item.categoryOverride"
                label="Override Category"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="saveEditModal(false)">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="saveEditModal(true)">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditModal",
  props: {
    opened: Boolean,
    possibleLabels: Array,
    initialItem: Object,
  },
  data: function () {
    return {
      item: {
        title: this.initialItem.title,
        description: this.initialItem.description == undefined ? "" : this.initialItem.description,
        categoryOverride: this.initialItem.categoryOverride == undefined ? "" : this.initialItem.categoryOverride
      },
    }
  },
  watch: {
    initialItem: function () {
      this.item = {
        title: this.initialItem.title,
        description: this.initialItem.description == undefined ? "" : this.initialItem.description,
        categoryOverride: this.initialItem.categoryOverride == undefined ? "" : this.initialItem.categoryOverride
      }
    }
  },
  methods: {
    saveEditModal: function (save) {
      let newItem = {};
      if (save) {
        newItem.title = this.item.title;
        newItem.description = this.item.description;
        newItem.categoryOverride = this.item.categoryOverride;
        this.$emit('saveItemEdits', newItem);
      }
      this.$emit('closeModal');
    },
  },
};
</script>
