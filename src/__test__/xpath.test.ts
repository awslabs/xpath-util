import { JSDOM } from "jsdom";

import {
    getXpath
} from "../xpath";

export const sampleHTML = 
`
<div id="another-better-id">
    <div 
        id="some-unique-id"
        data-analytics="otherParent"
        data-analytics-type="serviceSubSection"
    >
        <div 
            class="ASKLJHASDLKJH" 
            style="background: #eee; padding: 10px"
            data-analytics="introParagraph"
        >
            <p>
                This is a sibling paragraph
            </p>
            <p>
            This paragraph
            contains      a lot of spaces
            in the source     code,
            but the    browser 
            ignores it.
            </p>

        </div>
    </div>
</div>
`;

test("Can get element info from block of HTML", () => {
    const inputElement = document.createElement("div");
    inputElement.innerHTML = sampleHTML;
    document.body.appendChild(inputElement);

    // We'll grab the paragraph by diving into the element twice
    // using the "firstChild" attribute
    const firstParagraph = (document.querySelector("#another-better-id p") as HTMLElement);
    const secondParagraph = (document.querySelector("#another-better-id p:last-child") as HTMLElement);

    const firstParagraphElementInfo = getXpath(firstParagraph)

    // A catchall snapshot
    expect(firstParagraphElementInfo).toMatchSnapshot();

    // More precise tests around the returned element data
    expect(firstParagraphElementInfo.elementData["tag"]).toBe("introParagraph")
    expect(firstParagraphElementInfo.elementData["serviceSubSection"]).toBe("otherParent")

    const secondParagraphElementInfo = getXpath(secondParagraph)
    expect(secondParagraphElementInfo).toMatchSnapshot();
});

test("Test what happens when passing an empty element", () => {
    const inputElement = document.createElement("div");

    const elementInfo = getXpath(inputElement);

    expect(elementInfo.customPath).toBe("");
    expect(elementInfo.elementData).toStrictEqual({});
})