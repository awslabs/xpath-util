# Xpath Utility 

This is a simple utility that takes an element and generates a corresponding Xpath for it.

It contains a single method `getXpath` which returns an object containing 3 values:

```Typescript
export interface ElementInfo {
    xpath: string;
    customPath: string;
    elementData: {};
}
```

## xpath

This is the entire xpath from the element to the root element on the page. Elements will be tagged with a class *or** and id if present.

\* For now elements will only contain a class or the id if present. It will not contain both. The precendence is to use the id if available. 

## customPath

As xpaths can at times be difficult to parse you have the opportunity to generate a much smaller and high fidelty path using two `data-` attributes: `data-analytics` and `data-analytics-type`. By tagging your element

The usage of these looks a little as follows:

```HTML
    <div 
        data-analytics="ec2"
        data-analytics-type="service"
    >
```

This segment will produce a custom path of `/service(ec2)`

## Data objects

Instead of having to parse data out of the analytic path we also provide an object containing all the data from custom path. For the above example it would look as follows:

```javascript
{"service": "ec2"}
```

## Complete Example

Given the following snippet of HTML:

```HTML
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
```

The following you can execute the following code:

```Typescript
    const firstParagraph = (document.querySelector("#another-better-id p") as HTMLElement);

    const firstParagraphElementInfo = getXpath(firstParagraph)
```

The variable `firstParagraphElementInfo` will equal the following:

```Javascript
  "customPath": "/serviceSubSection(otherParent)/tag(introParagraph)",
  "elementData": {
    "serviceSubSection": "otherParent",
    "tag": "introParagraph",
  },
  "xpath": "/html/body/div/div[@id=\\"another-better-id\\"]/div[@id=\\"some-unique-id\\"]/div[@class=\\"ASKLJHASDLKJH\\"]/p",
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
