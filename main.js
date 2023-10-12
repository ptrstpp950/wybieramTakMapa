function recalulateMap() {
    for (const key in window.dane) {
        if (window.dane.hasOwnProperty(key)) {
            const element = window.dane[key];
            let rekomendacje = element.rekomendacjePartii;
            const svgElement = document.getElementById(element.nazwaOkregu + "Icon");

            if (svgElement === null || svgElement === undefined) {
                console.log("no svg element " + key);
                continue;
            }
            const pathElement = svgElement.querySelectorAll("path")[0];
            const txtElement = svgElement.querySelectorAll("text")[0];
            let txtStyle = "txtBlack";

            if (rekomendacje === null || rekomendacje === undefined || rekomendacje.length === 0) {
                rekomendacje = [""];
            }
            if (rekomendacje[0] == "") {
                pathElement.setAttribute("fill", "url(#bg-none)");
            } else {
                let style = "";
                rekomendacje = rekomendacje.sort();
                let styleArray = [];
                for (var i = 0; i < rekomendacje.length; i++) {
                    const current = rekomendacje[i].toLowerCase();
                    if (window.party[current] === true)
                        style += current + "-";
                }
                if (style === "") {
                    style = "none-";
                    txtStyle = "txtWhite";
                } else {
                    txtStyle = "txtWhite";
                }
                style = style.substring(0, style.length - 1);
                console.log("setting style " + style);
                pathElement.setAttribute("fill", "url(#bg-" + style);
            }
            txtElement.setAttribute("class", txtStyle);
        }
    }
    //setState();

};
// checkbox logic
window.party = {
    ko: true,
    lewica: true,
    td: true,
}
for (const key in window.party) {
    if (window.party.hasOwnProperty(key)) {
        const party = key;
        //console.log("processing party "+party);
        const pickerCheckbox = document.querySelector('#' + party + 'Picker input[type="checkbox"]');
        const pickerDiv = document.querySelector('#' + party + 'Picker');
        //console.log(pickerCheckbox);
        pickerDiv.addEventListener('click', function (event) {
            if (event.target.tagName !== 'INPUT') {
                pickerCheckbox.checked = !pickerCheckbox.checked;
            }
            console.log(party + ' picker checkbox is ' + (pickerCheckbox.checked));
            window.party[party] = pickerCheckbox.checked;
            console.log(window.party);
            recalulateMap();
            setState();
        });
    }
}


var list = [];
var select = document.getElementById('nazwaOkreguSelect');
for (const key in window.dane) {
    if (window.dane.hasOwnProperty(key)) {
        list.push(key);
    }
}
list = list.sort();
for (var i = 0; i < list.length; i++) {
    var opt = document.createElement('option');
    var key = list[i];
    const element = window.dane[key];
    opt.value = key;
    opt.innerHTML = element.nazwaOkregu;
    select.appendChild(opt);
}

select.onchange = function () {
    zoomFromInput(select.value);
}



// Zoom on path
//When I click on the path, I want to zoom in on it and show only it
window.zoomState = {
    width: 1000,
    height: 1000,
    zoomIn: false,
    zoomElem: null,
}
function zoomOnPath(path) {
    //Get the bounding box of the path
    var bbox = path.getBBox();

    var width = bbox.width;
    var height = bbox.height;

    //Get the center of the bounding box
    var cx = bbox.x + width / 2;
    var cy = bbox.y + height / 2;

    //Scale factor
    var k = 2.5;

    //Get the new size of the bounding box
    var newWidth = Math.max(width * k, 450);
    var newHeight = Math.max(height * k, 450);

    //Get the new position of the bounding box
    var newX = cx - newWidth / 2;
    var newY = cy - newHeight / 2;

    //Zoom
    path.parentElement.parentElement.setAttribute("viewBox", newX + " " + newY + " " + newWidth + " " + newHeight);
}

function showAll() {
    for (const key in window.dane) {
        if (window.dane.hasOwnProperty(key)) {
            const element = window.dane[key];
            const svgElement = document.getElementById(element.nazwaOkregu + "Icon");
            svgElement.style.display = "block";
        }
    }
}
function hideNonNeibours(idOkregu) {
    var okreg = window.dane[idOkregu];
    var neibourList = window.sasiedzi[okreg.nrOkregu];
    if (neibourList == null || neibourList == undefined) {
        return;
    }
    for (const key in window.dane) {
        if (window.dane.hasOwnProperty(key)) {
            const element = window.dane[key];
            if (element.nrOkregu != okreg.nrOkregu) {
                var isNeibour = false;
                for (let i = 0; i < neibourList.length; i++) {
                    const neibour = neibourList[i];
                    if (neibour == element.nrOkregu) {
                        isNeibour = true;
                        break;
                    }
                }
                if (isNeibour == false) {
                    const svgElement = document.getElementById(element.nazwaOkregu + "Icon");
                    svgElement.style.display = "none";
                }
            }
        }
    }
}

function setState() {
    var queryString = "?d=12a";
    const element = document.getElementById("nazwaOkreguSelect");
    let okreg = element.value;

    if (okreg == null || okreg == undefined) {
        okreg = "";
    }

    queryString += okreg != "" ? "&okreg=" + okreg : "";
    queryString += window.party.ko ? "" : "&ko=0";
    queryString += window.party.lewica ? "" : "&lewica=0";
    queryString += window.party.td ? "" : "&td=0";

    window.history.pushState("", "", queryString);    

    url = decodeURI(window.location);

    document.getElementById("shareFacebook").setAttribute("href", "https://www.facebook.com/sharer.php?u="+url);
    document.getElementById("shareTwitter").setAttribute("href", "https://twitter.com/intent/tweet?url="+url);
    document.getElementById("shareLinkedIn").setAttribute("href", "https://www.linkedin.com/sharing/share-offsite/?url="+url);

    var gEvent = {
        'okreg': (okreg == ""? "wszyscy" : okreg),
        'ko': window.party.ko,
        'lewica': window.party.lewica,
        'td': window.party.td,
      };

    console.log(gEvent);
    gtag('event', 'set_state', gEvent);
}


function selectElement(id, valueToSelect) {
    let element = document.getElementById(id);
    element.value = valueToSelect;
    setState();
}

function zoomFromInput(inputValue) {
    if (inputValue == null || inputValue == undefined)
        inputValue = "";

    if (inputValue == "") {
        resetZoom();
        return;
    }

    if (window.zoomState.zoomIn == true)
        resetZoom();
    
    window.zoomState.zoomElem = inputValue;
    selectElement("nazwaOkreguSelect", inputValue);
    
    window.zoomState.zoomIn = true;
    if (window.dane[inputValue] != null) {
        var parentElementToClick = document.getElementById(window.dane[inputValue].nazwaOkregu + "Icon");
        if (parentElementToClick == null) {
            resetZoom();
            return;
        }
        zoomOnPath(parentElementToClick.getElementsByTagName("path")[0]);
        hideNonNeibours(inputValue);
        setSuggestion(window.rekomendacje[window.dane[inputValue].nrOkregu] , window.dane[inputValue].nazwaOkregu);

    }
}

function resetZoom() {
    setSuggestion("");
    selectElement("nazwaOkreguSelect", "");
    window.zoomState.zoomIn = false;
    document.getElementById("svgMap").setAttribute("viewBox", 0 + " " + 0 + " " + window.zoomState.width + " " + window.zoomState.height);
    showAll();
}

function setSuggestion(txt, nazwaOkregu) {
    const nazwaOkreguHtml = '<b class="bold">'+nazwaOkregu+"</b>";
    if (nazwaOkregu == null || nazwaOkregu == undefined || nazwaOkregu == "") {
        document.getElementById("suggestion").innerHTML = "";
    } else if (txt == null || txt == undefined || txt == "") {
        document.getElementById("suggestion").innerHTML = nazwaOkreguHtml + ": " + "Brak aktualnych rekomendacji strategicznych. Sprawdź rekomendacje przed wyborami.";
        return;
    } else {
        document.getElementById("suggestion").innerHTML = nazwaOkreguHtml + ": " + txt;
    }

}


function readState() {
    var urlParams = new URLSearchParams(window.location.search);
    var okreg = urlParams.get('okreg');
    var ko = urlParams.get('ko');
    var lewica = urlParams.get('lewica');
    var td = urlParams.get('td');

    window.party.ko = (ko != "0");
    window.party.lewica = (lewica != "0");
    window.party.td = (td != "0");

    document.getElementById("koCheckbox").checked = window.party.ko;
    document.getElementById("lewicaCheckbox").checked = window.party.lewica;
    document.getElementById("tdCheckbox").checked = window.party.td;

    zoomFromInput(okreg);
    recalulateMap();
}
readState();


//Get all the paths
var paths = document.querySelectorAll("svg path");
var texts = document.querySelectorAll("svg text");
//For each path
for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    //When I click on the path
    path.addEventListener("click", function (e) {
        var idOkregu = this.parentElement.id.replace("Icon", "");
        if (window.zoomState.zoomIn == false) {
            zoomFromInput(idOkregu);
        } else if (window.zoomState.zoomElem != idOkregu) {
            zoomFromInput(idOkregu);
        } else {
            resetZoom();
        }
    });
}
for (var i = 0; i < texts.length; i++) {
    var text = texts[i];
    text.addEventListener("click", function (e) {
        this.parentElement.getElementsByTagName("path")[0].dispatchEvent(new Event('click'));
    });
}
