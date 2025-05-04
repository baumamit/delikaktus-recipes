console.log('view.js is indeed loaded');

/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
/* console.log( 'Hello World! (from create-block-recipe-editor block)' ); */
/* eslint-enable no-console */

// Define a fraction map similar to $fractionMap in PHP
const fractionMap = {
    0: "",
    0.125: "⅛",
    0.25: "¼",
    0.33: "⅓",
    0.375: "⅜",
    0.5: "½",
    0.625: "⅝",
    0.66: "⅔",
    0.75: "¾",
    0.875: "⅞"
};

document.addEventListener("DOMContentLoaded", function() {
    //console.log("DOMContentLoaded event fired"); // Debugging log

    const portionsInput = document.querySelector(".delikaktus-recipes-portions-box-input");
    const quantityElements = document.querySelectorAll(".ingredient-quantity");
    const fractionElements = document.querySelectorAll(".ingredient-quantity-fraction");

    // Exit if no elements are found
    if (quantityElements.length === 0 && fractionElements.length === 0) {
        console.warn("No ingredient quantities or fraction elements found."); // Debugging log
        return; // Exit the script
    }

    // Store initial values
    const originalQuantities = Array.from(quantityElements).map(el => Number.parseFloat(el.dataset.quantity) || 0);
    const originalFractions = Array.from(fractionElements).map(el => {
        console.log('el.dataset = ', el.dataset);
        return(Number.parseFloat(el.dataset.quantityFraction) || 0);
    });



    // Retrieve the localized data
    const unitSystem = recipeEditorData.unitSystem;  // From localized PHP data
    const portionsAmount = Number.parseFloat(recipeEditorData.portionsAmount) || 1;// From localized PHP data
    console.log("portionsAmount = ", portionsAmount);
    
    if (portionsInput) {
        portionsInput.addEventListener("input", function() {
            //console.log("Number.parseFloat(recipeEditorData.portions) = ", Number.parseFloat(recipeEditorData.portions));
            // Set default newPortionsAmount to the same if the input is invalid
            const newPortionsAmount = Number.parseFloat(this.value || portionsAmount);
            let portionsRatio = newPortionsAmount / portionsAmount;
            console.log("portionsRatio = ", portionsRatio);

            quantityElements.forEach((singleQuantityElement, index) => {
                //console.log("ingredientQuantityElement.dataset.quantity = ", ingredientQuantityElement.dataset.quantity);
                
                const originalQuantity = Number.parseFloat(originalQuantities[index]);
                const originalFraction = Number.parseFloat(originalFractions[index]) || 0;
                const newSum = (originalQuantity + originalFraction) * portionsRatio;
                const unitType = singleQuantityElement.dataset.unitType;

                let newQuantity = originalQuantities[index];
                let newFraction = originalFractions[index];
                let roundedNewSum = 0;

                switch (unitSystem) {
                    case "metric":
                        if ((unitType === 'mass') || (unitType === 'volume')) {
                            if (newSum < 20) {
                                newQuantity = Math.round(newSum); // Round to the closest unit
                            } else if (newSum < 500) {
                                newQuantity = Math.round(newSum / 5) * 5; // Round to the nearest 5 units
                            } else if (newSum < 1000) {
                                newQuantity = Math.round(newSum / 10) * 10; // Round to the nearest 10 units
                            } else if (newSum >= 1000) {
                                newQuantity = Math.round(newSum / 25) * 25; // Round to the nearest 25 units
                            }
                            // Update the data-fraction attribute value
                            fractionElements[index].dataset.quantityFraction = 0;
                            // Update the data-fraction text content as a fraction with two decimal places
                            fractionElements[index].textContent = newFraction > 0 ? newFraction.toFixed(2).replace(/\.00$/, "") : ""; // Remove unnecessary decimals and convert to a string
                        } else { // unitType is tool or by the eye
                            if (newSum < 0.95) {
                                roundedNewSum = Math.round(newSum * 12) / 12; // Round to the closest t
                            } else if (newSum < 2) {
                                roundedNewSum = Math.round(newSum * 4) / 4; // Round to the closest quarter of a unit
                            } else if (newSum < 10) {
                                roundedNewSum = Math.round(newSum * 2) / 2; // Round to the closest half of a unit
                            } else if (newSum < 20) {
                                roundedNewSum = Math.round(newSum); // Round to the closest unit
                            } else if (newSum < 500) {
                                roundedNewSum = Math.round(newSum / 5) * 5; // Round to the closest 5 units
                            } else if (newSum < 1000) {
                                roundedNewSum = Math.round(newSum / 10) * 10; // Round to the closest 10 units
                            } else if (newSum >= 1000) {
                                roundedNewSum = Math.round(newSum / 25) * 25; // Round to the closest 25 units
                            }
                            newFraction = roundedNewSum % 1;
                            // Update the data-fraction attribute value
                            fractionElements[index].dataset.quantityFraction = 0;
                            // Update the data-fraction text content as an explicit fraction
                            fractionElements[index].textContent = fractionMap[newFraction] ; // Use the map to get the fraction symbol
                        }
                        newQuantity = Math.floor(roundedNewSum);
                        // Update the data-quantity attribute value to keep the total quantity with the fractions
                        singleQuantityElement.dataset.quantity = newSum;
                        // Update the data-quantity text content
                        singleQuantityElement.textContent = newQuantity > 0 ? newQuantity.toFixed(2).replace(/\.00$/, "") : ""; // Remove unnecessary decimals and convert to a string
                        break;

                    /* default: // imperial or default
                        if (newSum <= 1) {
                            newQuantity = Math.round(newSum * 12) / 12; // Round to the nearest 12th
                        } else if (newSum < 2) {
                            newQuantity = Math.round(newSum * 4) / 4; // Round to the nearest quarter
                        } else if (newSum < 5) {
                            newQuantity = Math.round(newSum * 2) / 2; // Round to the nearest half
                        } else if (newSum < 10) {
                            newQuantity = Math.round(newSum); // Round to the closest g
                        } else if (newSum < 100) {
                            newQuantity = Math.round(newSum / 5) * 5; // Round to the nearest 5 g
                        } else if (newSum < 200) {
                            newQuantity = Math.round(newSum / 10) * 10; // Round to the nearest 10 g
                        } else if (newSum < 500) {
                            newQuantity = Math.round(newSum / 25) * 25; // Round to the nearest 25 g
                        } else if (newSum < 1000) {
                            newQuantity = Math.round(newSum / 50) * 50; // Round to the nearest 50 g
                        } else {
                            newQuantity = Math.round(newSum / 100) * 100; // Round to the nearest 100 g
                        }

                        fractionElements[index].textContent = originalFractions[index];

                        break; */
                }
            });

            // Update the step based on the current value
            if (newPortionsAmount > 1) {
                this.step = '1';
            } else {
                this.step = '0.125';
            }
        });
    }
});