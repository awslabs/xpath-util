export interface ElementInfo {
    xpath: string;
    customPath: string;
    elementData: {};
}

// Method to take a DOM element and generate an xpath
// taken directly from https://stackoverflow.com/a/5178132
// the code is a little tough to parse, going to rely on this being correct
//
// [June 17th 2019] DJ Petersen
// I'm refactoring this to make it more than just the xpath
// we are going to return
export function getXpath(element: HTMLElement): ElementInfo {
    let xpathSegments = [];
    let analyticsSegments: Array<string> = [];

    // We have an 
    let elementData: {} = {};

    for (xpathSegments = []; element && element.nodeType == 1; element = element.parentNode as HTMLElement) {
        if (element.hasAttribute("data-analytics")) {
            const aKey = element.getAttribute("data-analytics-type")
                ? element.getAttribute("data-analytics-type")
                : "tag";
            const aValue = element.getAttribute("data-analytics");
            analyticsSegments.unshift(`${aKey}(${aValue})`);

            // [June 22nd 2020]
            //
            // We have been asked to provide a way for team's to enrich the events that
            // are interacted with beyond just the tagging syntax, this will allow us to pass
            // back a key/value object where we populate it with the the tagging types and their values
            // passed back
            //
            // We'll keep track of all the different values we see along the way
            // in this we'll set our analyticData to have a key that contains key/type
            // for example...
            //
            // /serviceSubSection(someSection)/tag(createUserWizard)/context(userContext)
            //
            // would yield:
            //
            // {
            //   "serviceSubSection": "someSection",
            //   "tag": "createUserWizard",
            //   "context": "userContext"
            // }
            //
            // Note #1: What would happen if a value is doubly defined? E.g. /tag(value1)/tag(value2)
            //          Since we populate the tag string as we move up the DOM tree, the last one defined
            //          will "win". In this case "tag" would be assigned to "value1"
            elementData[aKey] = aValue;
        }

        // Currently we only let the xpath contain a id or a class
        if (element.hasAttribute("id")) {
            var elementId = element.getAttribute("id");
            xpathSegments.unshift(element.localName.toLowerCase() + '[@id="' + elementId + '"]');
        } else if (element.hasAttribute("class")) {
            xpathSegments.unshift(element.localName.toLowerCase() + '[@class="' + element.getAttribute("class") + '"]');
        } else {
            // This chunk of code adds the index to the element
            // if it is surrounded by siblings
            let index;
            let sib = element.previousSibling as HTMLElement;
            for (index = 1; sib; sib = sib.previousSibling as HTMLElement) {
                if (sib.localName == element.localName) {
                    index++;
                }
            }
            const indexPlaceholder = index > 1 ? `[${index - 1}]` : "";
            // We decrement the index by 1 to make it 0-indexed
            xpathSegments.unshift(element.localName.toLowerCase() + indexPlaceholder);
        }
    }

    return {
        xpath: "/" + xpathSegments.join("/"),
        customPath: analyticsSegments.length > 0 ? "/" + analyticsSegments.join("/") : "",
        elementData,
    };
}
