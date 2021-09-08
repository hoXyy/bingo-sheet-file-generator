<template>
  <v-app>
    <v-container fluid class="d-flex flex-column justify-center">
      <div id="title" class="center text-h4">Bingo Sheet File Generator</div>
      <a href="https://github.com/hoXyy/bingo-sheet-file-generator" class="center ">Source code</a>
    </v-container>
    <v-main>
      <div id="top-buttons" class="d-flex justify-center pa-2">
        <v-btn class="mr-2" @click="showUploadInput = true">Load existing goal sheet</v-btn>
        <v-dialog v-model="showResetDialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="ml-2" v-bind="attrs" v-on="on">Reset board</v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5">Reset board</v-card-title>
            <v-divider class="mb-5"></v-divider>
            <v-card-text>Are you sure you want to reset the board? This action cannot be undone!</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="showResetDialog = false">Cancel</v-btn>
              <v-btn @click="resetBoard()" color="red">Reset</v-btn>
            </v-card-actions>
          </v-card>  
        </v-dialog>
      </div>
      <v-container id="upload-form" v-if="showUploadInput" style="width: 30%;">
        <div class="d-flex flex-column justify-center pa-2 ml-50">
          <div class="center text-h6">Select file to upload:</div>
          <div class="center text-caption mb-2">Supported file extensions: *.xml</div>
          <v-file-input v-model="file" id="file-upload" dense outlined truncate-length="25" show-size accept="application/xml"></v-file-input>
          <div class="d-flex justify-center">
            <v-btn class="mr-2" @click="showUploadInput = false">Cancel upload</v-btn>
            <v-btn class="ml-2" @click="() => {uploadFile(file)}">Upload file</v-btn>
          </div>
        </div>
      </v-container>
      <v-container id="set-board-details" class="d-flex justify-center">
        <v-dialog persistent v-model="showDetailsDialog" width="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="ml-2" v-bind="attrs" v-on="on">Set board details</v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5">Set board details</v-card-title>
            <v-divider class="mb-5"></v-divider>
            <v-card-text>
              <v-text-field outlined label="Title" v-model="boardTitle"></v-text-field>
              <v-textarea outlined label="Description" v-model="boardDesc" height="300"></v-textarea>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="showDetailsDialog = false" color="green">Save</v-btn>
            </v-card-actions>
          </v-card>  
        </v-dialog>
      </v-container>
      <v-container fluid class="d-flex justify-center">
        <v-btn @click="createXML()">Generate XML</v-btn>
      </v-container>
      <v-container v-if="showXML" class="d-flex justify-center">
        <v-textarea v-model="generatedXML" readonly no-resize outlined ref="xmlTextArea" :style="{ 'width': '200px' }"></v-textarea>
      </v-container>
      <v-container v-if="showXML" class="d-flex justify-center">
        <v-btn class="mr-2" @click="copyXML()">Copy XML</v-btn>
        <v-btn class="mr-2" @click="downloadXML()">Download XML</v-btn>
        <v-btn @click="() => {showXML = false}">Close</v-btn>
      </v-container>
      <v-snackbar v-model="snackbar" :timeout="2000">
        {{ snackbarText }}
      </v-snackbar>
      <v-container id="board" fluid>
        <div v-if="boardTitle.length > 0" class="text-h4 center" :style="{ 'margin-bottom': '20px' }"><b>{{ boardTitle }}</b> <br> <span v-if="boardDesc.length > 0" class="text-h6">{{ boardDesc }}</span></div>
        <v-container id="board-goals">
          <table class="tg">
          <tbody>
            <tr>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[0].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[0].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[1].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[1].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[2].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[2].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[3].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[3].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[4].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[4].desc"></v-textarea>
              </td>
            </tr>
            <tr>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[5].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[5].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[6].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[6].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[7].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[7].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[8].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[8].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[9].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[9].desc"></v-textarea>
              </td>
            </tr>
            <tr>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[10].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[10].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[11].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[11].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[12].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[12].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[13].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[13].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[14].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[14].desc"></v-textarea>
              </td>
            </tr>
            <tr>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[15].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[15].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[16].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[16].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[17].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[17].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[18].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[18].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[19].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[19].desc"></v-textarea>
              </td>
            </tr>
            <tr>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[20].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[20].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[21].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[21].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[22].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[22].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[23].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[23].desc"></v-textarea>
              </td>
              <td class="tg-0lax">
                <v-text-field label="Goal Name" v-model="goals[24].title"></v-text-field>
                <v-textarea label="Goal Description" v-model="goals[24].desc"></v-textarea>
              </td>
            </tr>
          </tbody>
          </table>
     
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import * as xml from 'xmlbuilder2';

export default {
  name: 'App',

  data: () => ({
    showUploadInput: false,
    showResetDialog: false,
    showDetailsDialog: false,
    showXML: false,
    snackbar: false,
    file: [],
    boardTitle: '',
    boardDesc: '',
    generatedXML: '',
    snackbarText: '',
    goals: [
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
    ]
  }),
  methods: {
    async uploadFile() {
      var text = await this.file.text();
      const doc = xml.create(text);
      const json = doc.end({ format: 'object' })

      // Board description
      this.$data.boardTitle = json.bingoals.info["@title"];
      this.$data.boardDesc = json.bingoals.info["@description"];

      // 1st goal
      this.$data.goals[0].title = json.bingoals.goals["#"][1].goal[0]["@name"];
      this.$data.goals[0].desc = json.bingoals.goals["#"][1].goal[0]["@description"];

      // 2nd goal
      this.$data.goals[1].title = json.bingoals.goals["#"][1].goal[1]["@name"];
      this.$data.goals[1].desc = json.bingoals.goals["#"][1].goal[1]["@description"];

      // 3rd goal
      this.$data.goals[2].title = json.bingoals.goals["#"][1].goal[2]["@name"];
      this.$data.goals[2].desc = json.bingoals.goals["#"][1].goal[2]["@description"];

      // 4th goal
      this.$data.goals[3].title = json.bingoals.goals["#"][1].goal[3]["@name"];
      this.$data.goals[3].desc = json.bingoals.goals["#"][1].goal[3]["@description"];

      // 5th goal
      this.$data.goals[4].title = json.bingoals.goals["#"][1].goal[4]["@name"];
      this.$data.goals[4].desc = json.bingoals.goals["#"][1].goal[4]["@description"];

      // 6th goal
      this.$data.goals[5].title = json.bingoals.goals["#"][3].goal[0]["@name"];
      this.$data.goals[5].desc = json.bingoals.goals["#"][3].goal[0]["@description"];

      // 7th goal
      this.$data.goals[6].title = json.bingoals.goals["#"][3].goal[1]["@name"];
      this.$data.goals[6].desc = json.bingoals.goals["#"][3].goal[1]["@description"];

      // 8th goal
      this.$data.goals[7].title = json.bingoals.goals["#"][3].goal[2]["@name"];
      this.$data.goals[7].desc = json.bingoals.goals["#"][3].goal[2]["@description"];

      // 9th goal
      this.$data.goals[8].title = json.bingoals.goals["#"][3].goal[3]["@name"];
      this.$data.goals[8].desc = json.bingoals.goals["#"][3].goal[3]["@description"];

      // 10th goal
      this.$data.goals[9].title = json.bingoals.goals["#"][3].goal[4]["@name"];
      this.$data.goals[9].desc = json.bingoals.goals["#"][3].goal[4]["@description"];

      // 11th goal
      this.$data.goals[10].title = json.bingoals.goals["#"][5].goal[0]["@name"];
      this.$data.goals[10].desc = json.bingoals.goals["#"][5].goal[0]["@description"];

      // 12th goal
      this.$data.goals[11].title = json.bingoals.goals["#"][5].goal[1]["@name"];
      this.$data.goals[11].desc = json.bingoals.goals["#"][5].goal[1]["@description"];

      // 13th goal
      this.$data.goals[12].title = json.bingoals.goals["#"][5].goal[2]["@name"];
      this.$data.goals[12].desc = json.bingoals.goals["#"][5].goal[2]["@description"];

      // 14th goal
      this.$data.goals[13].title = json.bingoals.goals["#"][5].goal[3]["@name"];
      this.$data.goals[13].desc = json.bingoals.goals["#"][5].goal[3]["@description"];

      // 15th goal
      this.$data.goals[14].title = json.bingoals.goals["#"][5].goal[4]["@name"];
      this.$data.goals[14].desc = json.bingoals.goals["#"][5].goal[4]["@description"];

      // 16th goal
      this.$data.goals[15].title = json.bingoals.goals["#"][7].goal[0]["@name"];
      this.$data.goals[15].desc = json.bingoals.goals["#"][7].goal[0]["@description"];

      // 17th goal
      this.$data.goals[16].title = json.bingoals.goals["#"][7].goal[1]["@name"];
      this.$data.goals[16].desc = json.bingoals.goals["#"][7].goal[1]["@description"];

      // 18th goal
      this.$data.goals[17].title = json.bingoals.goals["#"][7].goal[2]["@name"];
      this.$data.goals[17].desc = json.bingoals.goals["#"][7].goal[2]["@description"];

      // 19th goal
      this.$data.goals[18].title = json.bingoals.goals["#"][7].goal[3]["@name"];
      this.$data.goals[18].desc = json.bingoals.goals["#"][7].goal[3]["@description"];
           
      // 20th goal
      this.$data.goals[19].title = json.bingoals.goals["#"][7].goal[4]["@name"];
      this.$data.goals[19].desc = json.bingoals.goals["#"][7].goal[4]["@description"];

      // 21st goal
      this.$data.goals[20].title = json.bingoals.goals["#"][9].goal[0]["@name"];
      this.$data.goals[20].desc = json.bingoals.goals["#"][9].goal[0]["@description"];

      // 22nd goal
      this.$data.goals[21].title = json.bingoals.goals["#"][9].goal[1]["@name"];
      this.$data.goals[21].desc = json.bingoals.goals["#"][9].goal[1]["@description"];

      // 23rd goal
      this.$data.goals[22].title = json.bingoals.goals["#"][9].goal[2]["@name"];
      this.$data.goals[22].desc = json.bingoals.goals["#"][9].goal[2]["@description"];

      // 24th goal
      this.$data.goals[23].title = json.bingoals.goals["#"][9].goal[3]["@name"];
      this.$data.goals[23].desc = json.bingoals.goals["#"][9].goal[3]["@description"];

      // 25th goal
      this.$data.goals[24].title = json.bingoals.goals["#"][9].goal[4]["@name"];
      this.$data.goals[24].desc = json.bingoals.goals["#"][9].goal[4]["@description"];

      // Hide upload dialog and clear file upload input
      this.showUploadInput = false;
      this.file = [];
    },
    resetBoard() {
      this.boardTitle = '';
      this.boardDesc = '';
      this.goals = [
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
      {
        title: "",
        desc: ""
      },
    ]
      // hide dialog
      this.showResetDialog = false;
    },
    createXML() {
      const obj = {
        bingoals: {
          version: {
            "@version": "1"
          },
          info: {
            "@title": this.boardTitle,
            "@description": this.boardDesc,
            "@premade": "true"
          },
          "!1": " These lines intentionally left blank ",
          "!2": " NO CHEATING ",
          "!3": " These lines intentionally left blank ",
          "!4": " These lines intentionally left blank ",
          "!5": " NO CHEATING ",
          "!6": " NO CHEATING ",
          "!7": " These lines intentionally left blank ",
          "!8": " NO CHEATING ",
          "!9": " These lines intentionally left blank ",
          "!10": " NO CHEATING ",
          "!11": " These lines intentionally left blank ",
          "!12": " These lines intentionally left blank ",
          "!13": " NO CHEATING ",
          "!14": " These lines intentionally left blank ",
          "!15": " NO CHEATING ",
          "!16": " These lines intentionally left blank ",
          "!17": " NO CHEATING ",
          "!18": " These lines intentionally left blank ",
          goals: {
            "#": [
              {
                "!": " top row "
              },
              {
                goal: [
                  {
                    "@name": this.goals[0].title,
                    "@description": this.goals[0].desc
                  },
                  {
                    "@name": this.goals[1].title,
                    "@description": this.goals[1].desc
                  },
                  {
                    "@name": this.goals[2].title,
                    "@description": this.goals[2].desc
                  },
                  {
                    "@name": this.goals[3].title,
                    "@description": this.goals[3].desc
                  },
                  {
                    "@name": this.goals[4].title,
                    "@description": this.goals[4].desc
                  }
                ]
              },
              {
                "!": " second row "
              },
              {
               goal: [
                  {
                    "@name": this.goals[5].title,
                    "@description": this.goals[5].desc
                  },
                  {
                    "@name": this.goals[6].title,
                    "@description": this.goals[6].desc
                  },
                  {
                    "@name": this.goals[7].title,
                    "@description": this.goals[7].desc
                  },
                  {
                    "@name": this.goals[8].title,
                    "@description": this.goals[8].desc
                  },
                  {
                    "@name": this.goals[9].title,
                    "@description": this.goals[9].desc
                  }
                ]
              },
              {
                "!": " third/middle row "
              },
              {
               goal: [
                  {
                    "@name": this.goals[10].title,
                    "@description": this.goals[10].desc
                  },
                  {
                    "@name": this.goals[11].title,
                    "@description": this.goals[11].desc
                  },
                  {
                    "@name": this.goals[12].title,
                    "@description": this.goals[12].desc
                  },
                  {
                    "@name": this.goals[13].title,
                    "@description": this.goals[13].desc
                  },
                  {
                    "@name": this.goals[14].title,
                    "@description": this.goals[14].desc
                  }
                ]
              },
              {
                "!": " fourth row "
              },
              {
               goal: [
                  {
                    "@name": this.goals[15].title,
                    "@description": this.goals[15].desc
                  },
                  {
                    "@name": this.goals[16].title,
                    "@description": this.goals[16].desc
                  },
                  {
                    "@name": this.goals[17].title,
                    "@description": this.goals[17].desc
                  },
                  {
                    "@name": this.goals[18].title,
                    "@description": this.goals[18].desc
                  },
                  {
                    "@name": this.goals[19].title,
                    "@description": this.goals[19].desc
                  }
                ]
              },
              {
                "!": " bottom row "
              },
              {
                goal: [
                  {
                    "@name": this.goals[20].title,
                    "@description": this.goals[20].desc
                  },
                  {
                    "@name": this.goals[21].title,
                    "@description": this.goals[21].desc
                  },
                  {
                    "@name": this.goals[22].title,
                    "@description": this.goals[22].desc
                  },
                  {
                    "@name": this.goals[23].title,
                    "@description": this.goals[23].desc
                  },
                  {
                    "@name": this.goals[24].title,
                    "@description": this.goals[24].desc
                  }
                ]
              }
            ]
          }
        }
      }
      const doc = xml.create(obj);
      const xmlFile = doc.end({ prettyPrint: true });
      this.$data.showXML = true;
      this.$data.generatedXML = xmlFile;
    },
    copyXML() {
      navigator.clipboard.writeText(this.$data.generatedXML).then(() => {
        this.$data.snackbar = true;
        this.$data.snackbarText = "Copied XML to clipboard"
      })
    },
    downloadXML() {
      var filename = this.$data.boardTitle + ".xml";
      var pom = document.createElement('a');
      var bb = new Blob([this.$data.generatedXML], {type: 'application/xml'});

      pom.setAttribute('href', window.URL.createObjectURL(bb));
      pom.setAttribute('download', filename);

      pom.dataset.downloadurl = ['application/xml', pom.download, pom.href].join(':');
      pom.draggable = true;
      pom.classList.add('dragout');

      pom.click();
    }
  }
};
</script>

<style>
  #title {
    font-weight: 600;
  }

  .center {
    text-align: center;
  }

  .goal {
    width: 20%;
    height: 100%;
    border: 2px solid white;
  }

  .row {
    width: 100%;
  }

  #board-goals {
    width: 100%;
    height: 500px;
  }

  table .bingo-card {
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 20px;
    margin-left: 20px;
    float: left;
    width: 20cm;  
    height: 20cm;  
    font-size: 14px;
  }

  .bingo-card td {
    border: 2px solid white;
    text-align: center;
    word-break: break-word;
  }

  .tg  {
    border-collapse:collapse;
    border-spacing:0;
    margin:0px auto;
    width: 100%;
    height: 500px;
  }

  .tg td {
    border-color:white;
    border-style:solid;
    border-width:2px;
    font-size:14px;
    overflow:hidden;
    padding:10px 5px;
    word-break:normal;
    text-align: center;
  }
  .tg th {
    border-color:white;
    border-style:solid;
    border-width:2px;
    font-size:14px;
    font-weight:normal;
    overflow:hidden;
    padding:10px 5px;
    word-break:normal;
    text-align: center;
  }

  .tg .tg-0lax {
    text-align:center;
    vertical-align:top
  }

  html {
    background: rgb(18,18,18);
  }
</style>
