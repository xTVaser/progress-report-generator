<template>
  <!-- TODO - multiple components eventually -->
  <v-container fluid>
    <v-row v-if="!fileLoaded" class="text-center">
      <v-col cols="12">
        <v-file-input
          accept=".json"
          label="New Pull Request Data (Start a new Report)"
          @change="loadPrData"
        ></v-file-input>
        <v-file-input
          accept=".json"
          label="Existing Report Data (Resume Working)"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-expansion-panels v-if="fileLoaded">
      <v-expansion-panel>
        <v-expansion-panel-header>
          Categories and Labels
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Load Category:[Label] Configuration -->
          <!-- allow adding a new category or removing one -->
          <v-row class="text-center">
            <v-col cols="6" v-for="(val, name) in categories" :key="name">
              <v-autocomplete
                v-if="name !== 'Ambiguous'"
                v-model="categories[name].labels"
                :items="categories[name].labels.concat(unsortedLabels)"
                chips
                deletable-chips
                multiple
                small-chips
                dense
                :label="name"
                @change="updateCategoryLabels()"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-container fluid v-if="fileLoaded">
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(prs, category) in reportData.pullRequests"
          :key="'pullRequests-' + category"
        >
          <v-expansion-panel-header>
            <h3>{{ category }} - ({{ prs.length }})</h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row
              v-for="(pr, index) in prs"
              :key="pr.url"
              style="background-color: #292929; margin-bottom: 0.25em"
            >
              <v-col cols="8">
                <a :href="pr.url">{{ pr.title }}</a>
                <br />
                <v-chip v-for="label in pr.labels" :key="label" outlined pill>
                  {{ label }}
                </v-chip>
              </v-col>
              <v-col cols="4" class="d-flex justify-end">
                <!-- delete -->
                <v-btn class="ma-2" text icon color="red lighten-2">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <!-- edit -->
                <v-btn class="ma-2" text icon color="green lighten-2">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <!-- order up -->
                <v-btn class="ma-2" text icon color="purple lighten-2" @click="moveOrderUp(category, index)">
                  <v-icon>mdi-arrow-up-thick</v-icon>
                </v-btn>
                <!-- order down -->
                <v-btn class="ma-2" text icon color="purple lighten-2">
                  <v-icon>mdi-arrow-down-thick</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",

  data: () => ({
    fileLoaded: false,
    prData: {},
    reportData: {
      name: "",
      categories: {},
      pullRequests: {},
    },
    categories: {
      GS: {
        labels: ["GS"],
        prs: [],
        color: "#ba68c8"
      },
      DEV9: {
        labels: ["DEV9"],
        prs: [],
        color: "#c0ca33"
      },
      Counters: {
        labels: ["Counters"],
        prs: [],
        color: "#ff5722"
      },
      MTVU: {
        labels: [],
        prs: [],
        color: "#757575"
      },
      VU: {
        labels: ["Vector Units"],
        prs: [],
        color: "#90a4ae"
      },
      microVU: {
        labels: [],
        prs: [],
        color: "#8d6e63"
      },
      GIF: {
        labels: [],
        prs: [],
        color: "#e65100"
      },
      VIF: {
        labels: [],
        prs: [],
        color: "#ffb74d"
      },
      SPU2: {
        labels: ["SPU2"],
        prs: [],
        color: "#76ff03"
      },
      PAD: {
        labels: ["PAD: Windows", "PAD: Linux/Mac"],
        prs: [],
        color: "#eeff41"
      },
      USB: {
        labels: ["USB"],
        prs: [],
        color: "#a5d6a7"
      },
      CDVD: {
        labels: ["CDVD"],
        prs: [],
        color: "#f0f4c3"
      },
      IPU: {
        labels: ["IPU"],
        prs: [],
        color: "#64ffda"
      },
      Debugger: {
        labels: ["Debugger"],
        prs: [],
        color: "#006064"
      },
      "Input Recording": {
        labels: ["TAS Functionality"],
        prs: [],
        color: "#4dd0e1"
      },
      "Miscellanous Core": {
        labels: ["IPC", "Core"],
        prs: [],
        color: "#b2dfdb"
      },
      GUI: {
        labels: ["GUI/WX", "Translations"],
        prs: [],
        color: "#303f9f"
      },
      Maintenance: {
        labels: [
          "GameDB",
          "Dependencies",
          "Upstream | External",
          "Build | Project System",
          "Documentation",
        ],
        prs: [],
        color: "#42a5f5"
      },
      Other: {
        labels: [],
        prs: [],
        color: "#ef5350"
      },
      Ambiguous: {
        labels: [],
        prs: [],
      },
    },
    unsortedLabels: [], // holds all labels that aren't assigned to the above!
  }),

  methods: {
    loadPrData: async function (file) {
      this.prData = await this.fileToJSON(file);
      // use the default category information
      this.reportData.categoryInfo = this.defaultCategories;
      this.updateCategoryLabels();
      this.fileLoaded = true;
    },
    updateCategoryLabels: function () {
      // find all labels that are in the PR data, that aren't already set as a category filter
      let allLabels = [];
      let newUnsortedLabels = [];
      for (let i = 0; i < this.prData.length; i++) {
        const pr = this.prData[i];
        allLabels = allLabels.concat(pr.labels);
      }
      let allSortedLabels = [];
      for (const category of Object.keys(this.categories)) {
        allSortedLabels = allSortedLabels.concat(this.categories[category].labels);
      }
      for (let i = 0; i < allLabels.length; i++) {
        const label = allLabels[i];
        if (
          !allSortedLabels.includes(label) &&
          !newUnsortedLabels.includes(label)
        ) {
          newUnsortedLabels.push(label);
        }
      }
      this.unsortedLabels = newUnsortedLabels;
      this.updatePrSorting();
    },
    updatePrSorting: function () {
      // clear / init all pullRequests
      // - this is fine to do, as overrides and order is separate!
      for (const key of Object.keys(this.categories)) {
        this.reportData.pullRequests[key] = [];
      }
      for (var i = 0; i < this.prData.length; i++) {
        const pr = this.prData[i];
        // for each PR, figure out what category they belong to, if they belong to multiple don't decide!
        const category = this.identifyCategory(pr.labels);
        this.reportData.pullRequests[category].push(pr);
      }
    },
    identifyCategory: function (labels) {
      if (labels.length == 0) {
        return "Other";
      }
      let relevantCategories = [];
      for (const [key, val] of Object.entries(this.categories)) {
        const intersection = labels.filter((value) =>
          val.labels.includes(value)
        );
        if (intersection.length > 0) {
          relevantCategories.push(key);
        }
      }
      if (relevantCategories.length > 1) {
        // remove lower priority categories, if there are still categories left then its still ambiguous
        const removeLowPriority = relevantCategories.filter(
          (cat) => !["GUI", "Maintenance", "Other"].includes(cat)
        );
        if (removeLowPriority.length > 1) {
          return "Ambiguous";
        }
        return relevantCategories[0];
      } else if (relevantCategories.length == 1) {
        return relevantCategories[0];
      }
      return "Other";
    },
    moveOrderUp: function (category, index) {
      const saveBefore = this.reportData.pullRequests[category][index - 1];
      const saveCurr = this.reportData.pullRequests[category][index];
      this.reportData.pullRequests[category].splice(index - 1, 2, saveCurr, saveBefore);
    },
    fileToJSON: async function (file) {
      console.log(file);
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsText(file);
      });
    },
  },
};
</script>
