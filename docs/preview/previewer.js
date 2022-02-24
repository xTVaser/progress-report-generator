// Load the File
function loadFile() {
  var input = document.createElement('input');
  input.type = 'file';

  input.onchange = e => {
    // getting a hold of the file reference
    var file = e.target.files[0];
    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      var content = readerEvent.target.result; // this is the content!
      generateHTML(content);
    }
  }
  input.click();
}

function itemsToHtml(data, key) {
  console.log(key);
  if (data.items[key].length == 0) {
    return "";
  }
  let html = ""
  html += `<p><strong><span style="color: #00ccff;">[Enhancement]</span> ${key} improvements:</strong></p>\n`
  for (let i = 0; i < data.items[key].length; i++) {
    let item = data.items[key][i];

    let prNum = "NOT A PR";
    if (item.url.includes("pull/")) {
      prNum = `#${item.url.split("pull/")[1]}`;
    }

    html += `<p><a href="${item.url}">${prNum}</a> ${item.title} By <a href="${item.authorUrl}">${item.authorName}</a>.</p>\n`
    // TODO - descriptions
  }
  return html;
}

var currentHtml = "";

// Generate the HTML
function generateHTML(contents) {
  var data = JSON.parse(contents);
  var html = "";

  // Generate Title
  html += `<h2 class="contentheading"><a href="#">${data.name}</a></h2>\n`;

  // Core Improvements
  html += `<h1 style="margin-top: 1em; margin-bottom: 1em">Core Improvements</h1>\n`
  // - Dev9
  html += itemsToHtml(data, "DEV9");
  // - Counters
  html += itemsToHtml(data, "Counters");
  // - MTVU
  html += itemsToHtml(data, "MTVU");
  // - VU
  html += itemsToHtml(data, "VU");
  // - microVU
  html += itemsToHtml(data, "microVU");
  // - GIF
  html += itemsToHtml(data, "GIF");
  // - VIF
  html += itemsToHtml(data, "VIF");
  // - SPU2
  html += itemsToHtml(data, "SPU2");
  // - PAD
  html += itemsToHtml(data, "PAD");
  // - USB
  html += itemsToHtml(data, "USB");
  // - CDVD
  html += itemsToHtml(data, "CDVD");
  // - IPU
  html += itemsToHtml(data, "IPU");

  html += `<hr style="margin-top: 1em; margin-bottom: 1em">\n`

  // GS Improvements
  html += `<h1 style="margin-top: 1em; margin-bottom: 1em">GS Improvements</h1>\n`
  // - GS
  html += itemsToHtml(data, "GS");

  html += `<hr style="margin-top: 1em; margin-bottom: 1em">\n`

  // Misc Improvements
  html += `<h1 style="margin-top: 1em; margin-bottom: 1em">Miscellaneous Improvements</h1>\n`
  // - Debugger
  html += itemsToHtml(data, "Debugger");
  // - GUI
  html += itemsToHtml(data, "GUI");
  // - Input Recording
  html += itemsToHtml(data, "Input Recording");
  // - Other AND Ambiguous
  html += itemsToHtml(data, "Other");
  html += itemsToHtml(data, "Ambiguous");

  html += `<hr style="margin-top: 1em; margin-bottom: 1em">\n`

  // Maintenance
  html += `<h1 style="margin-top: 1em; margin-bottom: 1em">Maintenance</h1>\n`
  html += itemsToHtml(data, "Maintenance");

  updateHtml(html);
}

// Update the HTML
function updateHtml(html) {
  var container = document.getElementById("previewContainer");
  container.innerHTML = html;
  currentHtml = html;
  editor.setValue(html);
}

// Allow user to Download it (just the generated contents)
function downloadPreviewHtml() {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(currentHtml));
  element.setAttribute('download', `progress-report-html-${new Date().toISOString()}.html`);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14')
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/html");
editor.setShowPrintMargin(false);

function showHtmlEditor() {
  var container = document.getElementById("editorWrapper");
  container.style.display = "unset";
}

function updateArticle() {
  updateHtml(editor.getValue());
}
