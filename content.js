// Continually set actualUrl for search results as they are added
handleNewSearchResults();
setInterval(handleNewSearchResults, 500);

function handleNewSearchResults() {
  // The actualUrl for most video search results can be obtained from an attribute called vrhm
  handleVrhms();
  handleNonVrhms();
}

function handleNonVrhms() {
  // Some video search results on a regular (non-video) search page have a class named "b_videocard". The actualUrl for this type of search result is buried in a child element which has a property named "data-itemmeta"
  for(let mainElt of document.querySelectorAll(".b_videocard")) {
    const dataItemMetaElt = mainElt.querySelector("[data-itemmeta]")
    if(dataItemMetaElt) {
      const dataItemMeta = dataItemMetaElt.getAttribute("data-itemmeta");
      const parsed = jsonlite.parse(dataItemMeta);
      const actualUrl = parsed.videos[0].purl;
      setActualUrl(mainElt, actualUrl);
    }
  }

  // Some video search results on a regular (non-video) search page have a class named "rc_videocap". The actualUrl for this type of search result is the URL of the search result.
  for(let elt of document.querySelectorAll(".rc_videocap")) {
    const closest = elt.closest("li");
    const actualUrl = closest.querySelector("a");
    setActualUrl(elt, actualUrl);
  }
}

function handleVrhms() {
  const selector = `
    .dg_u:not(.actualUrl),
    .vidr:not(.actualUrl),
    .mc_vhvc_th:not(.actualUrl)
  `;
  
  for(let elt of document.querySelectorAll(selector)) {
    // Sometimes (very rarely) the link provided by Bing is the actualUrl
    const bingUrl = elt.querySelector("a").href;
    if(!bingUrl.includes("bing.com")) {
      setActualUrl(elt, bingUrl);
      continue;
    }
    
    const vrhmElt = elt.querySelector("[vrhm]") ? elt.querySelector("[vrhm]") : elt;
    const vrhmAttribute = vrhmElt.getAttribute("vrhm");
    if(vrhmAttribute) {
      let vrhm = {};
      try {
        vrhm = jsonlite.parse(vrhmAttribute);
      }
      catch(e) {
        console.log("jsonlite unable to parse vrhmAttribute:", vrhmAttribute);
      }
      setActualUrl(elt, vrhm.pgurl);
    }

    // Certain elements are not assigned a vrhm attribute until the user interacts (e.g. via mouseover). Use an XMLHttpRequest to get the actualUrl for these elements.
    else {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "document";
      xhr.open("GET", bingUrl, true);
      xhr.onreadystatechange = function () {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          const actualUrl = getActualUrlFromResponse(xhr.response);
          setActualUrl(elt, actualUrl);
        }
      };
      xhr.send();
    }
  }
}

function getActualUrlFromResponse(response) {
  const a = response.querySelector('a[title^="View original"]');
  if(a) {
    return a.href;
  }
}

function setActualUrl(mainElt, actualUrl) {
  // Always add "actualUrl" to the classList (even if actualUrl was not found) so that the extension will stop wasting resources trying to find an actualUrl
  mainElt.classList.add("actualUrl");  

  // Set hrefs to the actualUrl
  const elts = nodeListToArray(mainElt.querySelectorAll("[href]"));
  elts.push(mainElt);
  if(actualUrl) {
    for(let elt of elts) {
      elt.setAttribute("href", actualUrl);
    }
  }
}

function nodeListToArray(nodeList) {
  const array = [];
  for(let node of nodeList) {
    array.push(node);
  }
  return array;
}
