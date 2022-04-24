<template>
  <v-container fluid>
    <EditModal
      :opened="dialogData.opened"
      :possibleLabels="Object.keys(reportData.categories)"
      :initialItem="dialogData.item"
      @saveItemEdits="saveItemEdits($event)"
      @closeModal="closeModal()"
    />
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
          @change="loadExistingReport"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-expansion-panels v-if="fileLoaded">
      <v-expansion-panel>
        <v-expansion-panel-header>
          Categories and Labels
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row class="text-center">
            <v-col
              cols="6"
              v-for="(val, name) in reportData.categories"
              :key="name"
            >
              <v-autocomplete
                v-if="name !== 'Ambiguous'"
                v-model="reportData.categories[name].labels"
                :items="
                  reportData.categories[name].labels.concat(unsortedLabels)
                "
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
      <v-row justify="center">
        <v-col>
          <v-text-field
            label="Report Title"
            v-model="reportData.name"
          ></v-text-field>
        </v-col>

        <v-col>
          <v-btn class="ma-2" text color="blue lighten-2" @click="saveReport()">
            Save Report
          </v-btn>
          <v-btn class="ma-2" text color="blue lighten-2" @click="exportReport()">
            Export as Markdown
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid v-if="fileLoaded">
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(data, category) in reportData.items"
          :key="'pullRequests-' + category"
        >
          <v-expansion-panel-header>
            <h3>{{ category }} - ({{ data.length }})</h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row
              v-for="(pr, index) in data"
              :key="pr.url"
              style="background-color: #292929; margin-bottom: 0.25em"
            >
              <v-col cols="8">
                <!-- title -->
                <strike v-if="pr.disabled">
                  <a :href="pr.url">{{ pr.title }}</a>
                </strike>
                <a v-else :href="pr.url">{{ pr.title }}</a>
                <br />
                <!-- description -->
                <template v-if="pr.description && pr.description !== ''">
                  <p>
                    {{ pr.description }}
                  </p>
                  <br />
                </template>
                <!-- labels -->
                <v-chip
                  v-for="label in pr.labels"
                  :key="label"
                  outlined
                  pill
                  :color="getLabelColor(label)"
                >
                  {{ label }}
                </v-chip>
              </v-col>
              <v-col cols="4" class="d-flex justify-end">
                <!-- enable -->
                <v-btn
                  v-if="pr.disabled"
                  class="ma-2"
                  text
                  icon
                  color="green lighten-2"
                  @click="includeItem(category, index)"
                >
                  <v-icon>mdi-plus-circle</v-icon>
                </v-btn>
                <!-- else - disable -->
                <v-btn
                  v-else
                  class="ma-2"
                  text
                  icon
                  color="red lighten-2"
                  @click="excludeItem(category, index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <!-- edit -->
                <v-btn
                  class="ma-2"
                  text
                  icon
                  color="green lighten-2"
                  @click="openEditModal(category, index)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <!-- order up -->
                <v-btn
                  class="ma-2"
                  text
                  icon
                  color="purple lighten-2"
                  @click="moveOrderUp(category, index)"
                >
                  <v-icon>mdi-arrow-up-thick</v-icon>
                </v-btn>
                <!-- order down -->
                <v-btn
                  class="ma-2"
                  text
                  icon
                  color="purple lighten-2"
                  @click="moveOrderDown(category, index)"
                >
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
import EditModal from "./EditModal";

export default {
  name: "ReportDashboard",
  components: {
    EditModal,
  },
  data: () => ({
    dialogData: {
      opened: false,
      item: {},
      itemCategory: "",
      itemIndex: -1,
    },
    fileLoaded: false,
    reportData: {
      name: "Sample Report",
      categories: {
        GS: {
          labels: ["GS"],
          color: "#ba68c8",
        },
        DEV9: {
          labels: ["DEV9"],
          color: "#c0ca33",
        },
        Counters: {
          labels: ["Counters"],
          color: "#ff5722",
        },
        MTVU: {
          labels: [],
          color: "#757575",
        },
        VU: {
          labels: ["Vector Units"],
          color: "#90a4ae",
        },
        microVU: {
          labels: ["micro VU"],
          color: "#8d6e63",
        },
        GIF: {
          labels: [],
          color: "#e65100",
        },
        VIF: {
          labels: ["VIF"],
          color: "#ffb74d",
        },
        SPU2: {
          labels: ["SPU2"],
          color: "#76ff03",
        },
        PAD: {
          labels: ["PAD: Windows", "PAD: Linux/Mac"],
          color: "#eeff41",
        },
        USB: {
          labels: ["USB"],
          color: "#a5d6a7",
        },
        CDVD: {
          labels: ["CDVD"],
          color: "#f0f4c3",
        },
        IPU: {
          labels: ["IPU"],
          color: "#64ffda",
        },
        Debugger: {
          labels: ["Debugger"],
          color: "#006064",
        },
        "Input Recording": {
          labels: ["TAS Functionality"],
          color: "#4dd0e1",
        },
        "Miscellanous Core": {
          labels: ["IPC", "Core", "Memory Card"],
          color: "#b2dfdb",
        },
        GUI: {
          labels: ["GUI/WX", "Translations", "GUI/Windows", "GUI/GTX"],
          color: "#303f9f",
        },
        Maintenance: {
          labels: [
            "GameDB",
            "Dependencies",
            "Upstream | External",
            "Build | Project System",
            "Documentation",
            "Code Cleanup / Refactoring",
          ],
          color: "#42a5f5",
        },
        Other: {
          labels: [],
          color: "#ef5350",
        },
        Ambiguous: {
          labels: [],
          color: "inherit",
        },
      },
      items: {
        GS: [],
        DEV9: [],
        Counters: [],
        MTVU: [],
        VU: [],
        microVU: [],
        GIF: [],
        VIF: [],
        SPU2: [],
        PAD: [],
        USB: [],
        CDVD: [],
        IPU: [],
        Debugger: [],
        "Input Recording": [],
        "Miscellanous Core": [],
        GUI: [],
        Maintenance: [],
        Other: [],
        Ambiguous: [],
      },
      unsortedLabels: [],
    },
  }),
  methods: {
    identifyCategory: function (labels) {
      if (labels.length == 0) {
        return "Other";
      }
      let relevantCategories = [];
      for (const [key, val] of Object.entries(this.reportData.categories)) {
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
    loadPrData: async function (file) {
      let prData = await this.fileToJSON(file);
      for (var i = 0; i < prData.length; i++) {
        let pr = prData[i];
        const category =
          pr.categoryOverride == undefined || pr.categoryOverride === ""
            ? this.identifyCategory(pr.labels)
            : pr.categoryOverride;
        this.reportData.items[category].push(pr);
      }
      this.updateCategoryLabels();
      this.fileLoaded = true;
    },
    loadExistingReport: async function (file) {
      this.reportData = await this.fileToJSON(file);
      this.updateCategoryLabels();
      this.fileLoaded = true;
    },
    updateCategoryLabels: function () {
      // find all labels that are in the PR data, that aren't already set as a category filter
      let allLabels = [];
      let newUnsortedLabels = [];
      for (const category of Object.keys(this.reportData.items)) {
        for (let i = 0; i < this.reportData.items[category].length; i++) {
          const pr = this.reportData.items[category][i];
          allLabels = allLabels.concat(pr.labels);
        }
      }
      let allSortedLabels = [];
      for (const category of Object.keys(this.reportData.categories)) {
        allSortedLabels = allSortedLabels.concat(
          this.reportData.categories[category].labels
        );
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
      // for every item, check that it's still in the category that it should be
      // if its not, remove it and move it to the end of that one
      for (const category of Object.keys(this.reportData.items)) {
        for (let i = this.reportData.items[category].length - 1; i >= 0; i--) {
          const pr = this.reportData.items[category][i];
          const correctCategory =
            pr.categoryOverride == undefined || pr.categoryOverride === ""
              ? this.identifyCategory(pr.labels)
              : pr.categoryOverride;
          if (correctCategory !== category) {
            this.reportData.items[correctCategory].push(
              this.reportData.items[category].splice(i, 1)[0]
            );
          }
        }
      }
    },
    getLabelColor: function (label) {
      return this.reportData.categories[this.identifyCategory([label])].color;
    },
    moveOrderUp: function (category, index) {
      if (index == 0) {
        return;
      }
      const saveBefore = this.reportData.items[category][index - 1];
      const saveCurr = this.reportData.items[category][index];
      this.reportData.items[category].splice(
        index - 1,
        2,
        saveCurr,
        saveBefore
      );
    },
    moveOrderDown: function (category, index) {
      if (index == this.reportData.items[category].length - 1) {
        return;
      }
      const saveAhead = this.reportData.items[category][index + 1];
      const saveCurr = this.reportData.items[category][index];
      this.reportData.items[category].splice(index, 2, saveAhead, saveCurr);
    },
    excludeItem: function (category, index) {
      let item = this.reportData.items[category].splice(index, 1)[0];
      item.disabled = true;
      this.reportData.items[category].push(item);
    },
    includeItem: function (category, index) {
      let item = this.reportData.items[category].splice(index, 1)[0];
      item.disabled = false;
      // re=add before all disabled items
      let insertIndex = -1;
      for (let i = 0; i < this.reportData.items[category].length; i++) {
        const pr = this.reportData.items[category][i];
        if (pr.disabled) {
          insertIndex = i;
          break;
        }
      }
      if (insertIndex == -1) {
        this.reportData.items[category].push(item);
      } else {
        this.reportData.items[category].splice(insertIndex, 0, item);
      }
    },
    openEditModal: function (category, index) {
      // setup the modal
      this.dialogData.opened = true;
      this.dialogData.itemCategory = category;
      this.dialogData.itemIndex = index;
      this.dialogData.item = this.reportData.items[category][index];
    },
    saveItemEdits: function (item) {
      let reportItem =
        this.reportData.items[this.dialogData.itemCategory][
          this.dialogData.itemIndex
        ];
      if (item.title !== "") {
        reportItem.title = item.title;
      }
      reportItem.description = item.description;
      if (
        reportItem.categoryOverride !== "" ||
        reportItem.categoryOverride !== undefined
      ) {
        reportItem.categoryOverride = item.categoryOverride;
      }
      this.updatePrSorting();
    },
    closeModal: function () {
      this.dialogData.opened = false;
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
    saveReport: async function () {
      const data = JSON.stringify(this.reportData);
      const date = new Date();
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = `${this.reportData.name}-${date.toISOString()}.json`;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
    exportReport: function() {
      let markdownData = "";
      for (const [key, value] of Object.entries(this.reportData.items)) {
        if (value.length > 0) {
          markdownData += `## ${key}\n\n`;
          for (let i = 0; i < value.length; i++) {
            const entry = value[i];
            if (!("disabled" in entry) || !entry.disabled) {
              markdownData += `{{< progress/github-link prNums="${entry.url.split("pull/")[1]}" title="${entry.title.replaceAll("\"", "\\\"")}" authors="${entry.authorName}" >}}\n\n`;
              if ("description" in entry) {
                markdownData += entry.description.replaceAll("\"", "\\\"") + "\n\n";
              }
            }
          }
        }
      }
      const blob = new Blob([markdownData], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = `${this.reportData.name}.md`;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    }
  },
};
</script>
