

let lang = "fr";
let dic = {};

const supported = ['fr', 'nl', 'en'];

/** @brief swith the current language
@param language : string. the new language to translate to.
        accepted val : fr, en, nl
        if undefined, use the user's locale or the last lang used on this device

@return a promice that is resolved when the dic is done loading

@note when switching languages, the code should look like
setLang(newLang).then(app.reRenderAll)
@warning nust be called at startup time. Example :
setLang().then(app.render)
*/
export function setLang(language){
    if(language === undefined){
        if(localStorage.getItem('lastLangUsed'))
            language = localStorage.getItem('lastLangUsed');
        else
            language = navigator.language.slice(0, 2);
    }

    if(!supported.includes(language)){
        alert( 'lang ' + language + ' not supported. defaulting to english');
        language = "en";
    }

    localStorage.setItem('lastLangUsed', language)


    lang = language;

    return fetch("tr/" + lang + ".dic").then((response) => response.json())
    .then(newDic => {
        dic = newDic;
    })
    .catch(e => {alert(e); dic = {}})
    ;
}


/** @brief translate a string into the current language
@param str : text to translate. can contain once a %d, that will be replaced by the count
@param ctx : text context. Used by the translator to choose the most appropriate translation. can be undefined
@param count : number. if str includes %d, will replace that. else should be undefined

@return the translation if existing, else the original string

@example tr("il y a %d chat", "un contexte", 3)

@note it's preferable to do "example" than tr(il y a ) + 3 + tr(chat)
        because the plural cannot be handeled corectly in the second case

@IMPORTANT this function should only be given string KNOWN at COMPILE TIME.

                let greeting = "hello " + userName;
                tr(str)

                will not work. do

                tr("hello") + userName instead

@IMPORTANT as this function isnt pure, its ans should not be cached. i.e.
            IT SHOULD BE CALLED at RENDER TIME
*/
export function tr(str, ctx, count){
    if(str in dic && typeof dic[str] == 'string'){
        if(count  !== undefined){
            let f = new Function("count", dic[str]);

            return f(count).replace("%d", count);
        }
        else
            return dic[str];
    }


    dic[str] = {context:ctx}; //mark as 'need translation' part of the dic


    // fallback : original string. (with replacement, just in case)
    return str.replace("%d", count);
}




//to be checked
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}




//download dic button + functionnality ================================

function downloadDic(){
    //add a line break for all the lines we have to translate
    download(lang + "tmp.dic",JSON.stringify(dic).replace(/},/g, "},\n"));
}

//this code is for dev only
$(function(){
    let downloadDicButton = $('<img src="res/icons/download.png" id="bDownloadDic" title="(Dev) download dic" class="mainButton"/>');
    downloadDicButton.on("click", () => {
        downloadDic();
    });

    $('#dCentralArea').append(downloadDicButton);

});
