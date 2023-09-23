/* make notes look better */
/* = */ /* grid view instead? */
/* folders */
/* editing notes */ /* In progress */
/* make not filled out thing fade out after a bit */
/* Make things look nicer: 
* yes/no prompt
* middle bar thingy dynamic?
* header scrolls w/ screen
* confirmations (delete note/all)
*/
var currentNotes = window.localStorage.getItem("papyrus-notes-num") || 0;

function newNote() {
  if (!document.getElementById("noteHeadingText").value || (!document.getElementById("primaryInp").checked && !document.getElementById("secondaryInp").checked) || !document.getElementById("noteBodyText").value || !document.getElementById("sourceText").value) {
    document.getElementById("haventFilledOutDiv").classList.remove("hidden");
    return;
  }
  document.getElementById("haventFilledOutDiv").classList.add("hidden");
  currentNotes++;
  window.localStorage.setItem("papyrus-notes-num", currentNotes);
  var note = document.createElement("div");
  note.setAttribute("id", `note${currentNotes}`);
  note.setAttribute("class", "notes");
  var headingElement = document.createElement("h3");
  headingElement.innerText = document.getElementById("noteHeadingText").value;
  headingElement.classList.add("heading");
  note.appendChild(headingElement);
  var noteNumberElement = document.createElement("h5");
  noteNumberElement.innerText = `Note #${currentNotes}`;
  noteNumberElement.classList.add("noteNumber");
  note.appendChild(noteNumberElement);
  var typeElement = document.createElement("h4");
  if (document.getElementById("primaryInp").checked) {
    typeElement.innerText = "Primary Source";
  } else if (document.getElementById("secondaryInp").checked) {
    typeElement.innerText = "Secondary Source"
  }
  typeElement.classList.add("sourceType");
  note.appendChild(typeElement);
  var bodyElement = document.createElement("p");
  bodyElement.innerText = document.getElementById("noteBodyText").value;
  bodyElement.classList.add("body");
  note.appendChild(bodyElement);
  var sourceElement = document.createElement("p");
  sourceElement.innerText = document.getElementById("sourceText").value;
  sourceElement.classList.add("source");
  note.appendChild(sourceElement);
  var exportButton = document.createElement("button");
  exportButton.classList.add("export-button");
  exportButton.onclick = ()=>{
    exportNote(note.id);
  };
  exportButton.innerHTML = "Export";
  note.appendChild(exportButton);
  var editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.onclick = editThing(note.id);
  editButton.innerHTML = "Edit";
  note.appendChild(editButton);
  var deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = deleteQuestion(note.id);
  deleteButton.innerHTML = "Delete";
  note.appendChild(deleteButton);
  document.getElementById("noteCtnDiv").appendChild(note);
  var uuidThing = document.createElement("span");
  uuidThing.style.display = "none";
  uuidThing.class = "uuid";
  uuidThing.innerHTML = crypto.randomUUID();
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
    uuid: document.querySelector(`#${note.id}>.uuid`).innerHTML
  };
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
        source: document.querySelector(`#${note.id}>.source`).innerText,
        uuid: crypto.randomUUID()
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
  var jsonThing = null;
  var jsonIndex = 0;
  for (var i in JSON.parse(window.localStorage.getItem("papyrus-notes"))) {
    var item = JSON.parse(window.localStorage.getItem("papyrus-notes"))[i];
    if (document.querySelector(`#${id}>.uuid`)==item.uuid) {
      jsonThing = item;
      jsonIndex = i;
      break;
    }
  }
  function callback(mutationRecords) {
    console.log(mutationRecords);
    for (var i in mutationRecords) {
      var item = mutationRecords[i];
      item.target.innerText
    }
  }
  return function() {
  const config = { attributes: false, childList: true, subtree: true };
  document.getElementById(id).contentEditable = true;
  var observer = new MutationObserver(callback);
  observer.observe(document.getElementById(id), config);
  
  }
}

function darkModeSwitch() {
  if (document.querySelector("body").style.backgroundColor == "rgb(32, 32, 33)") {
    document.querySelector("body").style.backgroundColor = "white";
    document.querySelector("body").style.color = "black";
    window.localStorage.setItem("darkMode","false");
  } else {
    document.querySelector("body").style.backgroundColor = "#202021";
    document.querySelector("body").style.color = "white";
    window.localStorage.setItem("darkMode","true");
  }
}

function exportNote(id) {
  console.log(id);
  var note = {
    heading: document.querySelector(`#${id}>.heading`).innerText,
    body: document.querySelector(`#${id}>.body`).innerText,
    type: document.querySelector(`#${id}>.sourceType`).innerText,
    source: document.querySelector(`#${id}>.source`).innerText,
    //uuid: document.querySelector(`#${id}>.uuid`).innerText
  };
  note = btoa(JSON.stringify(note));
  var downloadElement = document.createElement("a");
  downloadElement.style.display = "none";
  downloadElement.download = `${document.querySelector(`#${id}>h3`).innerHTML}.note`;
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
      source: document.querySelector(`#${note.id}>.source`).innerText,
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
function importNote() {
  var fileImport = document.getElementById("fileImport");
  fileImport.onchange = _ => {
    let file = Array.from(fileImport.files)[0];
    let reader = new FileReader();

    reader.onload = (function(file) {
        return function(e) {
          console.log(e.target.result);
          if (!e.target.result.endsWith("||NOTES")) {
            currentNotes++;
            var iitem = JSON.parse(atob(e.target.result));
            console.log(iitem);
            console.log(currentNotes);
            var note = document.createElement("div");
            note.setAttribute("id", `note${currentNotes}`);
            note.setAttribute("class", "notes");
            var headingElement = document.createElement("h3");
            headingElement.innerText = iitem.heading;
            headingElement.classList.add("heading");
            note.appendChild(headingElement);
            var noteNumberElement = document.createElement("h5");
            noteNumberElement.innerText = `Note #${currentNotes}`;
            noteNumberElement.classList.add("noteNumber");
            note.appendChild(noteNumberElement);
            var typeElement = document.createElement("h4");
            typeElement.innerText = iitem.type
            noteNumberElement.classList.add("sourceType");
            note.appendChild(typeElement);
            var bodyElement = document.createElement("p");
            bodyElement.innerText = iitem.body;
            bodyElement.classList.add("body");
            note.appendChild(bodyElement);
            var sourceElement = document.createElement("p");
            sourceElement.innerText = iitem.source;
            sourceElement.classList.add("source");
            note.appendChild(sourceElement);
            var exportButton = document.createElement("button");
            exportButton.classList.add("export-button");
            exportButton.onclick = ()=>{
              exportNote(`note${currentNotes}`);
            };
            exportButton.innerHTML = "Export";
            note.appendChild(exportButton);
            var editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.onclick = editThing(`note${currentNotes}`);
            editButton.innerHTML = "Edit";
            note.appendChild(editButton);
            var deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = deleteQuestion(`note${currentNotes}`);
            deleteButton.innerHTML = "Delete";
            note.appendChild(deleteButton);
            var uuidThing = document.createElement("span");
            uuidThing.style.display = "none";
            uuidThing.class = "uuid";
            uuidThing.innerHTML = iitem.uuid;
            note.appendChild(uuidThing);
            document.getElementById("noteCtnDiv").appendChild(note);
            var prevData = "[]";
            if (window.localStorage.getItem("papyrus-notes")) {
              prevData = window.localStorage.getItem("papyrus-notes");
            }
            prevData = JSON.parse(prevData);
            var newData = iitem;
            prevData.push(newData)
            var data = JSON.stringify(prevData);
            window.localStorage.setItem("papyrus-notes",data);
            window.localStorage.setItem("papyrus-notes-num",currentNotes)
          } else {
            var tempNum = 1;
              var item = null;
  for (item in JSON.parse(atob(e.target.result.split("||")[0].toString()))) {
    (function(item){
    var num = new Number(tempNum);
    var iitem = JSON.parse(atob(e.target.result.split("||")[0]))[item];
    console.log(iitem);
    console.log(num);
    var note = document.createElement("div");
    note.setAttribute("id", `note${num}`);
    note.setAttribute("class", "notes");
    var headingElement = document.createElement("h3");
    headingElement.innerText = iitem.heading;
    headingElement.classList.add("heading");
    note.appendChild(headingElement);
    var noteNumberElement = document.createElement("h5");
    noteNumberElement.innerText = `Note #${num}`;
    noteNumberElement.classList.add("noteNumber");
    note.appendChild(noteNumberElement);
    var typeElement = document.createElement("h4");
    typeElement.innerText = iitem.type
    typeElement.classList.add("sourceType");
    note.appendChild(typeElement);
    var bodyElement = document.createElement("p");
    bodyElement.innerText = iitem.body;
    bodyElement.classList.add("body");
    note.appendChild(bodyElement);
    var sourceElement = document.createElement("p");
    sourceElement.innerText = iitem.source;
    sourceElement.classList.add("source");
    note.appendChild(sourceElement);
    var exportButton = document.createElement("button");
    exportButton.classList.add("export-button");
    exportButton.onclick = ()=>{
      exportNote(`note${num}`);
    };
    exportButton.innerHTML = "Export";
    note.appendChild(exportButton);
    var editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.onclick = editThing(`note${num}`);
    editButton.innerHTML = "Edit";
    note.appendChild(editButton);
    var deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = deleteQuestion(`note${num}`);
    deleteButton.innerHTML = "Delete";
    note.appendChild(deleteButton);
    var uuidThing = document.createElement("span");
    uuidThing.style.display = "none";
    uuidThing.class = "uuid";
    uuidThing.innerHTML = iitem.uuid;
    note.appendChild(uuidThing);
    document.getElementById("noteCtnDiv").appendChild(note);
    var prevData = "[]";
    if (window.localStorage.getItem("papyrus-notes")) {
      prevData = window.localStorage.getItem("papyrus-notes");
    }
    prevData = JSON.parse(prevData);
    var newData = iitem;
    prevData.push(newData)
    var data = JSON.stringify(prevData);
    window.localStorage.setItem("papyrus-notes",data);
    tempNum++;
    currentNotes++;
    })(item);
  }
              window.localStorage.setItem("papyrus-notes-num",currentNotes);
          }
        };
      })(file);

      reader.readAsText(file);
  };
  fileImport.click();
}

if (window.localStorage.getItem("papyrus-notes")) {
  var tempNum = 1;
  for (item in JSON.parse(window.localStorage.getItem("papyrus-notes"))) {
    (function(item){
    var num = new Number(tempNum);
    var iitem = JSON.parse(window.localStorage.getItem("papyrus-notes"))[item];
    console.log(iitem);
    console.log(num);
    var note = document.createElement("div");
    note.setAttribute("id", `note${num}`);
    note.setAttribute("class", "notes");
    var headingElement = document.createElement("h3");
    headingElement.innerText = iitem.heading;
    headingElement.classList.add("heading");
    note.appendChild(headingElement);
    var noteNumberElement = document.createElement("h5");
    noteNumberElement.innerText = `Note #${num}`;
    noteNumberElement.classList.add("noteNumber");
    note.appendChild(noteNumberElement);
    var typeElement = document.createElement("h4");
    typeElement.innerText = iitem.type
    typeElement.classList.add("sourceType");
    note.appendChild(typeElement);
    var bodyElement = document.createElement("p");
    bodyElement.innerText = iitem.body;
    bodyElement.classList.add("body");
    note.appendChild(bodyElement);
    var sourceElement = document.createElement("p");
    sourceElement.innerText = iitem.source;
    sourceElement.classList.add("source");
    note.appendChild(sourceElement);
    var exportButton = document.createElement("button");
    exportButton.classList.add("export-button");
    exportButton.onclick = ()=>{
      exportNote(`note${num}`);
    };
    exportButton.innerHTML = "Export";
    note.appendChild(exportButton);
    var editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.onclick = editThing(`note${num}`);
    editButton.innerHTML = "Edit";
    note.appendChild(editButton);
    var deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = deleteQuestion(`note${num}`);
    deleteButton.innerHTML = "Delete";
    note.appendChild(deleteButton);
    /*var uuidThing = document.createElement("span");
    uuidThing.style.display = "none";
    uuidThing.class = "uuid";
    uuidThing.innerHTML = iitem.uuid;
    note.appendChild(uuidThing);*/
    document.getElementById("noteCtnDiv").appendChild(note);
    tempNum++;
    })(item);
  }
}
if (window.localStorage.getItem("darkMode")=="true") {
  document.querySelector("body").style.backgroundColor = "#202021";
  document.querySelector("body").style.color = "white";
}
