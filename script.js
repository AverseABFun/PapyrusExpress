/* make notes look better */
/* CLEAN UP CODE */
/* = */ /* grid view instead? */
/* folders */ /* In progress */
/* editing notes */ /* Done, but the code is a horrible mess */
/* Make things look nicer: 
* yes/no prompt
* middle bar thingy dynamic?
* header scrolls w/ screen
* confirmations (delete note/all)
* code
*/

// Copyright Cosmic Technologies 2023

const fadeAfter = 7000; // In milliseconds
const fadeEvery = 200; // Also milliseconds
const opacityMinus = 0.05; // the value for what it decreases the opacity by every fadeEvery milliseconds

var currentNotes = window.localStorage.getItem("papyrus-notes-num") || 0;
var folders = JSON.parse(window.localStorage.getItem("papyrus-notes-folders")) || ["Root"];

function enterFolder(folderId) {
  console.log(folderId)
  var uuid = document.querySelector(`#${folderId}>.uuid`).innerText;
  var folder = null;
  var folderIndex = null;
  for (var i in JSON.parse(window.localStorage.getItem("papyrus-notes"))) {
    var item = JSON.parse(window.localStorage.getItem("papyrus-notes"))[i];
    console.log(item)
    if (item.uuid==uuid) {
      folder = item;
      folderIndex = i;
    }
  }
  return function() {
    document.getElementById("noteCtnDiv").innerHTML = "";
    var tempNum = 1;
    for (item in folder.content) {
      var num = new Number(tempNum);
      var iitem = folder.content[item];
      createNote(iitem, num);
      tempNum++;
    }
  }
}

function newFolder() {
  if (!document.getElementById("folderName").value) {
    document.getElementById("emptyDiv").style.display = "block";
    document.getElementById("emptyDiv").style.opacity = 1;
    setTimeout(function(){
      var interval = setInterval(function(){
        document.getElementById("emptyDiv").style.opacity -= opacityMinus;
        if (document.getElementById("emptyDiv").style.opacity<=0) {
          clearInterval(interval);
          document.getElementById("emptyDiv").style.display = "none";
        }
      },fadeEvery)
    },fadeAfter) //seven seconds;
    return;
  }
  if (folders.includes(document.getElementById("folderName").value)) {
    document.getElementById("alreadyExistsDiv").style.display = "block";
    document.getElementById("alreadyExistsDiv").style.opacity = 1;
    setTimeout(function(){
      var interval = setInterval(function(){
        document.getElementById("alreadyExistsDiv").style.opacity -= opacityMinus;
        if (document.getElementById("alreadyExistsDiv").style.opacity<=0) {
          clearInterval(interval);
          document.getElementById("alreadyExistsDiv").style.display = "none";
        }
      },fadeEvery)
    },fadeAfter) //seven seconds;
    return;
  }
  folders.push(document.getElementById("folderName").value);

  
  
  window.localStorage.setItem("papyrus-notes-folders",JSON.stringify(folders));

  var prevData = "[]";
  if (window.localStorage.getItem("papyrus-notes")) {
    prevData = window.localStorage.getItem("papyrus-notes");
  }
  prevData = JSON.parse(prevData);
  var newData = {
    heading: document.getElementById("folderName").value,
    folder: true,
    uuid: crypto.randomUUID(),
    content: []
  };
  prevData.push(newData)
  createFolder(newData)
  var data = JSON.stringify(prevData);
  window.localStorage.setItem("papyrus-notes",data);
  console.log(window.localStorage.getItem("papyrus-notes"));
}

function createFolder(data) {
  var folder = document.createElement("div");
  folder.setAttribute("id", `folder${folders.length-1}`);
  folder.setAttribute("class", "folders notes");

  var name = document.createElement("h3");
  name.innerText = data.heading;
  name.setAttribute("class", "heading");
  folder.appendChild(name);

  var uuidThing = document.createElement("span");
  uuidThing.style.display = "none";
  uuidThing.classList.add("uuid");
  uuidThing.innerText = data.uuid;
  folder.appendChild(uuidThing);

  document.getElementById("noteCtnDiv").appendChild(folder);
  folder.onclick = enterFolder(`folder${folders.length-1}`)
}

function createNote(data, num) {
  console.log(data);
  var note = document.createElement("div");
  note.setAttribute("id", `note${num}`);
  note.setAttribute("class", "notes");
  var headingElement = document.createElement("h3");
  headingElement.innerText = data.heading;
  headingElement.classList.add("heading");
  note.appendChild(headingElement);
  var noteNumberElement = document.createElement("h5");
  noteNumberElement.innerText = `Note #${num}`;
  noteNumberElement.classList.add("noteNumber");
  note.appendChild(noteNumberElement);
  var typeElement = document.createElement("h4");
  typeElement.innerText = data.type
  typeElement.classList.add("sourceType");
  note.appendChild(typeElement);
  var bodyElement = document.createElement("p");
  bodyElement.innerText = data.body;
  bodyElement.classList.add("body");
  note.appendChild(bodyElement);
  var sourceElement = document.createElement("p");
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  if (matches) {
    let m;
    while ((m = regex.exec(data.source)) != null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
        data.source = data.source.replace(match,"<a href=\""+match+"\">"+match+"</a>");
      });
    }
  }
  sourceElement.innerText = data.source;
  sourceElement.classList.add("source");
  note.appendChild(sourceElement);
  var exportButton = document.createElement("button");
  exportButton.classList.add("export-button");
  exportButton.onclick = ()=>{
    exportNote(`note${num}`);
  };
  exportButton.innerText = "Export";
  note.appendChild(exportButton);
  var uuidThing = document.createElement("span");
  uuidThing.style.display = "none";
  uuidThing.classList.add("uuid");
  uuidThing.innerText = data.uuid;
  note.appendChild(uuidThing);
  var editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.innerText = "Edit";
  note.appendChild(editButton);
  var deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = deleteQuestion(`note${num}`);
  deleteButton.innerText = "Delete";
  note.appendChild(deleteButton);
  document.getElementById("noteCtnDiv").appendChild(note);
  editButton.onclick = editThing(`note${num}`);
}

function openTab(evt, cityName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
openTab({currentTarget: document.getElementById("noteTab")}, 'noteInputs')

function newNote() {
  if (!document.getElementById("noteHeadingText").value || (!document.getElementById("primaryInp").checked && !document.getElementById("secondaryInp").checked) || !document.getElementById("noteBodyText").value || !document.getElementById("sourceText").value) {
    document.getElementById("haventFilledOutDiv").style.display = "block";
    document.getElementById("haventFilledOutDiv").style.opacity = 1;
    setTimeout(function(){
      var interval = setInterval(function(){
        document.getElementById("haventFilledOutDiv").style.opacity -= opacityMinus;
        if (document.getElementById("haventFilledOutDiv").style.opacity<=0) {
          clearInterval(interval);
          document.getElementById("haventFilledOutDiv").style.display = "none";
        }
      },fadeEvery)
    },fadeAfter) //seven seconds;
    return;
  }
  currentNotes++;
  window.localStorage.setItem("papyrus-notes-num", currentNotes);
  
  var prevData = "[]";
  if (window.localStorage.getItem("papyrus-notes")) {
    prevData = window.localStorage.getItem("papyrus-notes");
  }
  prevData = JSON.parse(prevData);
  var newData = {
    heading: document.getElementById("noteHeadingText").value,
    body: document.getElementById("noteBodyText").value,
    type: document.getElementById("primaryInp").checked ? "Primary Source" : "Secondary Source",
    source: document.getElementById("sourceText").value,
    uuid: crypto.randomUUID(),
    folder: false
  };
  createNote(newData, currentNotes);
  prevData.push(newData)
  var data = JSON.stringify(prevData);
  window.localStorage.setItem("papyrus-notes",data);
  console.log(window.localStorage.getItem("papyrus-notes"));
  var elements = document.getElementsByTagName("input");
  for (var i = 0; i < elements.length; i++) {
      if (elements[i].type == "radio") {
          elements[i].checked = false;
      }
  }
  document.getElementById("noteHeadingText").value = "";
  document.getElementById("noteBodyText").value = "";
  document.getElementById("sourceText").value = "";
}

function deleteQuestion(id) {
  return function() {
  document.getElementById("delete-yes").onclick = function() {
    var toDelete = document.getElementById(id);
    toDelete.parentElement.removeChild(toDelete);
    toDelete.remove();
    currentNotes--;
    var notes = document.getElementById("noteCtnDiv");
    var note = null;
    var notess = [];
    for (note in notes.children) {
      note = notes.children[note];
      if (!note.id) {
        continue;
      }
      console.log(note.id);
      console.log(id);
      var notee = {
        heading: document.querySelector(`#${note.id}>.heading`).innerText,
        body: document.querySelector(`#${note.id}>.body`).innerText,
        type: document.querySelector(`#${note.id}>.sourceType`).innerText,
        source: document.querySelector(`#${note.id}>.source`).innerHTML,
        uuid: document.querySelector(`#${note.id}>.uuid`).innerText
      };
      notess.push(notee);
    }
    window.localStorage.setItem("papyrus-notes",JSON.stringify(notess));
    window.localStorage.setItem("papyrus-notes-num", currentNotes);
    document.getElementById("deleteQuestionDiv").classList.add("hidden");
  }
    document.getElementById("delete-no").onclick = function() {
    document.getElementById("deleteQuestionDiv").classList.add("hidden");
  }
    document.getElementById("deleteQuestionDiv").classList.remove("hidden");
  }
}

function editThing(id) {
  var observers = {};
  var editing = false;
  var jsonThing = null;
  var jsonIndex = 0;
  var allData = JSON.parse(window.localStorage.getItem("papyrus-notes"));
  for (var i in allData) {
    var item = allData[i];
    console.log(item)
    if (document.querySelector(`#${id}>.uuid`).innerText==item.uuid) {
      jsonThing = item;
      jsonIndex = i;
      break;
    }
  }
  var firstEdit = true;
  function wrapper(type) {
    return function(mutationRecords) {
      if (firstEdit) {
        allData = JSON.parse(window.localStorage.getItem("papyrus-notes"));
    for (var i in allData) {
      var item = allData[i];
      console.log(item)
      if (document.querySelector(`#${id}>.uuid`).innerText==item.uuid) {
        jsonThing = item;
        jsonIndex = i;
        break;
      }
    }
        firstEdit = false;
      }
      for (var i in mutationRecords) {
        var item = mutationRecords[i].target;
        console.log(item);
        allData = JSON.parse(window.localStorage.getItem("papyrus-notes")); //Just to make sure it's up to date
        jsonThing[type] = item.wholeText;
        allData[jsonIndex] = jsonThing;
        window.localStorage.setItem("papyrus-notes",JSON.stringify(allData));
      }
    }
  }
  return function() {
    if (editing) {
      document.querySelector(`#${id}>.edit-button`).innerText = "Edit";
      document.getElementById(id).contentEditable = false;
      editing = false;
      for (var num in Object.keys(observers)) {
        var val = observers[Object.keys(observers)[num]];
        val.disconnect();
      }
      return;
    }
    document.querySelector(`#${id}>.edit-button`).innerText = "Stop editing";
    editing = true;
    const config = { attributes: false, childList: true, subtree: true, characterData: true };
    document.getElementById(id).contentEditable = true;
    document.querySelector(`#${id}>.noteNumber`).contentEditable = false
    document.querySelectorAll(`#${id}>button`).forEach(function(val) {val.contentEditable = false});
    const types = ["heading","body","source"];
      for (var typeNum in types) {
        var type = types[typeNum];
        observers[type] = new MutationObserver(wrapper(type));
        console.log(type);
        observers[type].observe(document.querySelector(`#${id}>.${type}`), config);
      }
    }
}

function darkModeSwitch() {
  if (document.querySelector("body").style.backgroundColor == "rgb(32, 32, 33)") {
    document.querySelector("body").style.backgroundColor = "white";
    document.querySelector("body").style.color = "black";
    document.getElementById("dark-tab-wrapper").id = "tab-wrapper";
    window.localStorage.setItem("darkMode","false");
  } else {
    document.querySelector("body").style.backgroundColor = "#202021";
    document.querySelector("body").style.color = "white";
    document.getElementById("tab-wrapper").id = "dark-tab-wrapper";
    window.localStorage.setItem("darkMode","true");
  }
}

function exportNote(id) {
  console.log(id);
  var note = {
    heading: document.querySelector(`#${id}>.heading`).innerText,
    body: document.querySelector(`#${id}>.body`).innerText,
    type: document.querySelector(`#${id}>.sourceType`).innerText,
    source: document.querySelector(`#${id}>.source`).innerHTML,
    uuid: document.querySelector(`#${id}>.uuid`).innerText
  };
  note = btoa(JSON.stringify(note));
  var downloadElement = document.createElement("a");
  downloadElement.style.display = "none";
  downloadElement.download = `${document.querySelector(`#${id}>h3`).innerText}.note`;
  downloadElement.href = "data:text/note,"+note;
  downloadElement.click();
  downloadElement.remove();
}
function exportNotes() {
  var notes = document.getElementById("noteCtnDiv");
  var note = null;
  var notess = [];
  for (note in notes.children) {
    note = notes.children[note];
    console.log(note.id);
    if (!note.id) {
      continue;
    }
    var notee = {
      heading: document.querySelector(`#${note.id}>.heading`).innerText,
      body: document.querySelector(`#${note.id}>.body`).innerText,
      type: document.querySelector(`#${note.id}>.sourceType`).innerText,
      source: document.querySelector(`#${note.id}>.source`).innerHTML,
      uuid: document.querySelector(`#${note.id}>.uuid`).innerText
    };
    notess.push(notee);
  }
  notes = btoa(JSON.stringify(notess))+`||${notess.length}||NOTES`;
  var downloadElement = document.createElement("a");
  downloadElement.style.display = "none";
  downloadElement.download = `my_notes.notes`;
  downloadElement.href = "data:text/notes,"+notes;
  downloadElement.click();
  downloadElement.remove();
}
function importSingleFile(e) {
  currentNotes++;
  var iitem = JSON.parse(atob(e.target.result));
  var prevData = "[]";
  if (window.localStorage.getItem("papyrus-notes")) {
    prevData = window.localStorage.getItem("papyrus-notes");
  }
  prevData = JSON.parse(prevData);
  var newData = iitem;
  prevData.push(newData)
  createNote(newData, currentNotes);
  var data = JSON.stringify(prevData);
  window.localStorage.setItem("papyrus-notes",data);
  window.localStorage.setItem("papyrus-notes-num",currentNotes)
}
function importMultipleFile(e) {
  var tempNum = 1;
  var item = null;
  for (item in JSON.parse(atob(e.target.result.split("||")[0].toString()))) {
    var num = new Number(tempNum);
    var iitem = JSON.parse(atob(e.target.result.split("||")[0]))[item];
    var prevData = "[]";
    if (window.localStorage.getItem("papyrus-notes")) {
      prevData = window.localStorage.getItem("papyrus-notes");
    }
    prevData = JSON.parse(prevData);
    var newData = iitem;
    prevData.push(newData)
    var data = JSON.stringify(prevData);
    window.localStorage.setItem("papyrus-notes",data);
    createNote(newData, currentNotes);
    tempNum++;
    currentNotes++;
  }
  window.localStorage.setItem("papyrus-notes-num",currentNotes);
}
function importFileThing(file) {
    let reader = new FileReader();

    reader.onload = (function(file) {
        return function(e) {
          console.log(e.target.result);
          if (!e.target.result.endsWith("||NOTES")) {
            importSingleFile(e);
          } else {
            importMultipleFile(e);
          }
        };
      })(file);

      reader.readAsText(file);
}
function importNote() {
  var fileImport = document.getElementById("fileImport");
  fileImport.onchange = _ => {
    importFileThing(Array.from(fileImport.files)[0]);
  };
  fileImport.click();
}

if (window.localStorage.getItem("papyrus-notes")) {
  var tempNum = 1;
  for (item in JSON.parse(window.localStorage.getItem("papyrus-notes"))) {
    var num = new Number(tempNum);
    var iitem = JSON.parse(window.localStorage.getItem("papyrus-notes"))[item];
    createNote(iitem, num);
    tempNum++;
  }
}
if (window.localStorage.getItem("darkMode")=="true") {
  darkModeSwitch();
}

let dropArea = document.getElementById('drop-area')
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
  dropArea.addEventListener(eventName, handleDrop, false)
})
function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}
function handleFiles(files) {
  importFileThing(Array.from(files)[0])
}
