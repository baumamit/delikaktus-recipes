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

/**
 * Finds the closest fraction symbol from the fractionMap for a given number.
 * @param {number} decimalFraction - The number to compare with the fractionMap.
 * @returns {string} - The closest fraction symbol (e.g., "½", "¼").
 */
function getClosestFractionSymbol(decimalFraction) {
    // Define a fraction map similar to $fractionMap in PHP
    const fractionMap = {
        0: "",
        0.125: "⅛",
        0.25: "¼",
        0.333: "⅓",
        0.375: "⅜",
        0.5: "½",
        0.625: "⅝",
        0.667: "⅔",
        0.75: "¾",
        0.875: "⅞"
    };

    // Find the closest fraction key
    const closestFraction = Object.keys(fractionMap).reduce((closest, current) => {
        const currentValue = parseFloat(current); // Convert the key to a number
        return Math.abs(currentValue - decimalFraction) < Math.abs(closest - decimalFraction)
            ? currentValue
            : closest;
    }, 0);

    // Return the corresponding fraction symbol
    return fractionMap[closestFraction];
}

document.addEventListener("DOMContentLoaded", function () {
    const portionsInput = document.querySelector(".delikaktus-recipes-portions-box-input");
    const ingredientElements = document.querySelectorAll(".delikaktus-recipes-ingredient-item");
    const quantityElements = document.querySelectorAll(".ingredient-quantity");
    const fractionElements = document.querySelectorAll(".ingredient-quantity-fraction");
    const unitChoiceElements = document.querySelectorAll(".ingredient-unit-choice");

    // Exit if no elements are found
    if (ingredientElements.length === 0) {
        console.warn("No ingredients found."); // Debugging log
        return; // Exit the script
    }

    // Store initial values to avoid overwriting
    const originalQuantities = Array.from(quantityElements).map(el => Number.parseFloat(el.dataset.quantity) || 0);
    const originalFractions = Array.from(fractionElements).map(el => Number.parseFloat(el.dataset.quantityFraction) || 0);
    const originalUnitChoices = Array.from(unitChoiceElements).map(el => el.dataset.unitChoice);

    // Localized PHP data, dynamically set from edit.js
    const unitSystem = recipeEditorData.unitSystem;
    // Localized PHP data, dynamically set from PortionsEditPanel React component
    const portionsAmount = Number.parseFloat(recipeEditorData.portionsAmount) || 1;

    if (portionsInput) {
        portionsInput.addEventListener("input", function () {
            console.log('\n\n\n');

            // Ensure the value is positive number
            if (isNaN(this.value) || this.value <= 0) {
                this.value = portionsAmount; // Reset to 1 if the value is less than 1
            }

            // Set default newPortionsAmount to the same if the input is invalid
            const newPortionsAmount = Number.parseFloat(this.value || portionsAmount);
            let portionsRatio = newPortionsAmount / portionsAmount;

            for (let index = 0; index < ingredientElements.length; index++) {
                const unitType = ingredientElements[index].dataset.unitType;
                //const unitChoice = ingredientElements[index].dataset.unitChoice;
                //const unitChoice = unitChoiceElements[index].textContent.trim();
                const unitChoice = originalUnitChoices[index];

                // Calculate the original total quantity as a number
                const originalQuantity = Number.parseFloat(originalQuantities[index]) || 0;
                const originalFraction = Number.parseFloat(originalFractions[index]) || 0;
                const originalUnitChoice = originalUnitChoices[index];
                let newNumber = (originalQuantity + originalFraction) * portionsRatio;
                //console.log('newNumber = ', newNumber);
                 let newUnitChoice = originalUnitChoice;
                //let newUnitChoice = unitChoiceElements[index].textContent.trim();
                //console.log('newUnitChoice before the loop = ', newUnitChoice);


                // Keep original values for each iteration
                let newQuantity = originalQuantity;
                let newFraction = originalFraction;
                let roundedNewNumber = 0;


                // Convert kg and L to g and ml
                /* if (originalUnitChoice == "kg" || originalUnitChoice == "L") {
                    newNumber = newNumber * 1000;
                    newUnitChoice = originalUnitChoice == "kg" ? "g" : "ml";
                } */



                //console.log('unitSystem unitType = ', unitSystem+" "+unitType);
                switch (unitSystem) {
                    case "metric":
                        if ((unitType === 'mass') || (unitType === 'volume')) {
                            // Convert kg and L to g and ml
                            /* console.log('unitChoice = ', unitChoice);
                            console.log('is it kg or L ? ', unitChoice == "kg" || unitChoice == "L");
                            console.log('is it g or ml ? ', unitChoice == "g" || unitChoice == "ml"); */

                            console.log(`Original: ${originalQuantity}${unitChoice}, Ratio: ${portionsRatio}`);
                            console.log(`→ Converted number: ${newNumber}`);
                            console.log(`→ New unit: ${newUnitChoice}`);

                            // Handle conversion between kg/L and g/ml if needed
                            if ((unitChoice === "kg" || unitChoice === "L") && newNumber < 1) {
                                newNumber *= 1000;
                                newUnitChoice = unitChoice === "kg" ? "g" : "ml";
                            } else if ((unitChoice === "g" || unitChoice === "ml") && newNumber >= 1000) {
                                newNumber /= 1000;
                                newUnitChoice = unitChoice === "g" ? "kg" : "L";
                            }

                            // Re-check and round according to magnitude and the appropriate unit choice
                            if (unitChoice === "kg" || unitChoice === "L") {
                                // Round to nearest 0.05 kg/L
                                newQuantity = Math.round(newNumber / 0.05) * 0.05;
                                newQuantity = parseFloat(newQuantity.toFixed(2)); // Ensure two decimal places
                            } else if (newNumber < 1) {
                                // Round to the closest tenths of a unit
                                newQuantity = Math.round(newNumber * 10) / 10;
                            } else if (newNumber < 10) {
                                // Round to the closest half of a unit
                                newQuantity = Math.round(newNumber * 2) / 2;
                            } else if (newNumber < 100) {
                                // Round to the closest whole number
                                newQuantity = Math.round(newNumber);
                            } else if (newNumber < 1000) {
                                // Round to the closest five of a unit
                                newQuantity = Math.round(newNumber / 5) * 5;
                            } else {
                                // Round to the closest ten of a unit
                                newQuantity = Math.round(newNumber / 10) * 10;
                            }

                            // Always update DOM
                            // Update the quantity textContent field with the total number, blank if 0
                            quantityElements[index].textContent = newQuantity.toFixed(2).replace(/\.00$/, "");
                            fractionElements[index].textContent = "";
                            unitChoiceElements[index].textContent = newUnitChoice;

                            /* if (unitChoice == "kg" || unitChoice == "L") {
                                if (newNumber < 1) {
                                    newNumber = newNumber * 1000;
                                    //newUnitChoice = ( (unitChoice == "kg") ? "g" : "ml" );
                                    newUnitChoice = (newUnitChoice == "kg") ? "g" : "ml";
                                    quantityElements[index].textContent = newNumber.toFixed(2).replace(/\.00$/, ""); // Remove unnecessary decimals and convert to a string
                                    fractionElements[index].textContent = "";
                                    unitChoiceElements[index].textContent = newUnitChoice;
                                    console.log('multiplyed by 1000');
                                    console.log('newUnitChoice = ', newUnitChoice);
                                }
                                // Convert g and ml to kg and L
                            } else if (unitChoice == "g" || unitChoice == "ml") {
                                if (newNumber >= 1000) {
                                    newNumber = newNumber / 1000;
                                    //newUnitChoice = ( (unitChoice == "g") ? "kg" : "L" );
                                    newUnitChoice = (newUnitChoice == "g") ? "kg" : "L";
                                    quantityElements[index].textContent = newNumber.toFixed(2).replace(/\.00$/, ""); // Remove unnecessary decimals and convert to a string
                                    fractionElements[index].textContent = "";
                                    unitChoiceElements[index].textContent = newUnitChoice;
                                    console.log('divided by 1000');
                                    console.log('newUnitChoice = ', newUnitChoice);
                                }
                            } */
                            /* roundedNewNumber = newNumber;
                            console.log('roundedNewNumber = ', roundedNewNumber);
                            

                            if (newNumber < 1) {
                                roundedNewNumber = Math.round(newNumber * 10) / 10; // Round to the closest tenths of a unit
                            } else if (newNumber < 10) {
                                roundedNewNumber = Math.round(newNumber * 2) / 2; // Round to the closest half of a unit
                            } else if (newNumber < 100) {
                                roundedNewNumber = Math.round(newNumber); // Round to the closest unit
                            } else if (newNumber < 1000) {
                                roundedNewNumber = Math.round(newNumber / 5) * 5; // Round to the nearest 5 units
                            } else if (newNumber >= 1000) {
                                roundedNewNumber = Math.round(newNumber / 10) * 10; */ // Round to the nearest 25 units
                                // Change unit choice for large amounts of g or ml
                                /* if (newUnitChoice == "g") {
                                    roundedNewNumber = roundedNewNumber / 1000;
                                    newUnitChoice = "kg";
                                } else if (newUnitChoice == "ml") {
                                    roundedNewNumber = roundedNewNumber / 1000;
                                    newUnitChoice = "L";
                                }
                                unitChoiceElements[index].textContent = newUnitChoice; */
                            /* }
                            newQuantity = roundedNewNumber;
                            // Update the data-quantity text content as the total number, blank if 0
                            quantityElements[index].textContent = newQuantity > 0 ? newQuantity.toFixed(2).replace(/\.00$/, "") : ""; // Remove unnecessary decimals and convert to a string
                            unitChoiceElements[index].textContent = newUnitChoice; */






                        /* } else { // unitType is tool or by the eye
                            if (newNumber < 2) {
                                roundedNewNumber = newNumber;
                            } else if (newNumber < 10) {
                                roundedNewNumber = Math.round(newNumber * 2) / 2; // Round to the closest half of a unit
                            } else if (newNumber < 20) {
                                roundedNewNumber = Math.round(newNumber); // Round to the closest unit
                            } else if (newNumber < 500) {
                                roundedNewNumber = Math.round(newNumber / 5) * 5; // Round to the closest 5 units
                            } else if (newNumber < 1000) {
                                roundedNewNumber = Math.round(newNumber / 10) * 10; // Round to the closest 10 units
                            } else if (newNumber >= 1000) {
                                roundedNewNumber = Math.round(newNumber / 25) * 25; // Round to the closest 25 units
                            }

                            // Update the data-fraction attribute value
                            newFraction = roundedNewNumber % 1;
                            // Update the data-fraction text content as an explicit fraction
                            fractionElements[index].textContent = getClosestFractionSymbol(newFraction); // Use the map to get the fraction symbol
                            // Update the data-quantity attribute value to keep the total quantity with the fractions
                            newQuantity = roundedNewNumber - newFraction;
                            // Update the data-quantity text content
                            quantityElements[index].textContent = newQuantity > 0 ? newQuantity : ""; */
                            //quantityElement.textContent = newQuantity > 0 ? newQuantity : ""; // Remove unnecessary decimals and convert to a string
                        }
                        break;

                    /* default: // imperial or default
                        if (newNumber <= 1) {
                            newQuantity = Math.round(newNumber * 12) / 12; // Round to the nearest 12th
                        } else if (newNumber < 2) {
                            newQuantity = Math.round(newNumber * 4) / 4; // Round to the nearest quarter
                        } else if (newNumber < 5) {
                            newQuantity = Math.round(newNumber * 2) / 2; // Round to the nearest half
                        } else if (newNumber < 10) {
                            newQuantity = Math.round(newNumber); // Round to the closest g
                        } else if (newNumber < 100) {
                            newQuantity = Math.round(newNumber / 5) * 5; // Round to the nearest 5 g
                        } else if (newNumber < 200) {
                            newQuantity = Math.round(newNumber / 10) * 10; // Round to the nearest 10 g
                        } else if (newNumber < 500) {
                            newQuantity = Math.round(newNumber / 25) * 25; // Round to the nearest 25 g
                        } else if (newNumber < 1000) {
                            newQuantity = Math.round(newNumber / 50) * 50; // Round to the nearest 50 g
                        } else {
                            newQuantity = Math.round(newNumber / 100) * 100; // Round to the nearest 100 g
                        }

                        fractionElements[index].textContent = originalFractions[index];

                        break; */
                }
            };

            // Update the step based on the current value
            if (newPortionsAmount > 1) {
                this.step = '1';
            } else {
                this.step = '0.1';
            }
        });
    }
});