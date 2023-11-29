/**!
 * @name BannerFontSizeFix
 * @author Pickaxe828#4385, monochromeninja
 * @description Fixes the font size of banners
 * @version 0.1.0
 */

const BANNER_REGEX = /^[\uE000-\uEFFF󏿷\s]+$/
const MULTIPLIER = 3
const UNIT_SEPARATION_REGEX = /^(\d+)(\D+)$/

/**  
 * Credit: monochromeninja 
*/
function enlargeSpanText(destinationSpan: HTMLElement) {
  destinationSpan.style.fontSize = ""
  destinationSpan.style.lineHeight = ""

  // Get current style, font size and line height
  let style = getComputedStyle(destinationSpan, null) as CSSStyleDeclaration
  let fontSize = style?.getPropertyValue("font-size").match(UNIT_SEPARATION_REGEX)?.slice(1) ?? [16, "px"]
  let lineHeight = style?.getPropertyValue("line-height").match(UNIT_SEPARATION_REGEX)?.slice(1) ?? [22, "px"]

  console.log(fontSize, lineHeight)

  if (destinationSpan.childNodes.length === 1 && destinationSpan.childNodes[0].nodeName === "#text" && destinationSpan.innerText.match(BANNER_REGEX) && !destinationSpan.innerText.match(/^\s+$/)) {
    // Add the multiplier to the font size and line height
    destinationSpan.style.fontSize = String(fontSize[0] as number * MULTIPLIER) + fontSize[1]
    destinationSpan.style.lineHeight = String(lineHeight[0] as number * MULTIPLIER) + lineHeight[1]
  }
}

// @ts-ignore
module.exports = class BannerFont {

  start() {
    console.log("Banner font enabled!")
  }

  observer(mutation: MutationRecord, observer: MutationObserver) {
    let scroller = document.querySelector(`[class^="scrollerInner"]`) as HTMLElement
    let result = mutation.addedNodes[0] as Node & Element

    // Bunch of early returns
    if (
      result === undefined ||
      result.textContent === undefined ||
      result.textContent === ""
    ) { return } // No or not text

    try { if (result.id.search("chat-messages") === -1) { return } } // Not a message 
    catch { }

    if (result instanceof Text) { console.log("The evil type called 'Text' has been spotted."); return } // Not a node

    let destination = result.querySelector(`[id^="message-content"]`) // Get into the message content

    if (destination === null) { console.log(destination); return } // Nothing inside destination again D:

    if ((destination?.textContent ?? "").match(BANNER_REGEX) === null) { return } // Not a banner

    let destinationSpan = destination.querySelector(`span`) as HTMLElement
    enlargeSpanText(destinationSpan as HTMLElement) // Enlarge the text
  }

  onSwitch() {
    let scroller = document.querySelector(`[class^="scrollerInner"]`) as HTMLElement
    scroller.querySelectorAll(`[id^="message-content"]`).forEach((messageContent) => {
      Array.from(messageContent.children).forEach((child) => {
        if (
          (child.textContent ?? "").match(BANNER_REGEX) === null
          || (child.textContent ?? "") === " "
        ) { return } // Not a banner or is a space bar

        enlargeSpanText(child as HTMLElement)
      })
    })
  }

  stop() {
    console.log("Banner font disabled!")
  }
}
