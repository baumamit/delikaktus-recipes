document.addEventListener("DOMContentLoaded", function() {
    const portionsInput = document.querySelector(".delikaktus-recipes-portions-box-input");
    const ingredientQuantities = document.querySelectorAll(".ingredient-quantity");
    const fractionElements = document.querySelectorAll(".ingredient-quantity-fraction");

    // Store initial values
    const originalQuantities = Array.from(ingredientQuantities).map(el => parseFloat(el.dataset.quantity));
    const originalFractions = Array.from(fractionElements).map(el => el.dataset.quantityFraction);
    // Retrieve the localized data
    //const unitSystem = $attributes['unitSystem'] // line change recommended by ChatGPT
    const unitSystem = recipeEditorData.unitSystem;  // From localized PHP data
    const portionsAmount = parseFloat(recipeEditorData.portions);  // From localized PHP data
    if (isNaN(portionsAmount)) {
            console.error("Invalid portionsAmount value.");
            return; // Exit if invalid
    }




    portionsInput.addEventListener("input", function() {
        console.log("Portions Input Value: ", this.value);
        let portionsRatio = parseFloat(this.value) / portionsAmount;
        console.log("parseFloat(this.value) : ", parseFloat(this.value) );
        console.log("Portions Ratio: ", portionsRatio);


        // Set default ratio if the input is invalid
        if (isNaN(portionsRatio) || portionsRatio <= 0) {
        portionsRatio = 1; 
        }

        ingredientQuantities.forEach((el, index) => {
            let newQuantity = originalQuantities[index];
            //console.log("Original Quantity: ", originalQuantities[index]);

            const newSum = (originalQuantities[index] + originalFractions[index]) * portionsRatio;
            //console.log("New Sum for Ingredient", index, ": ", newSum);

            switch (unitSystem) {
                case "metric":
                    if (newSum[index] <= 0.94) {
                        newQuantity = Math.roundTo(newSum[index], 1); // Round to the first decimal
                    } else if (newSum[index] < 10) {
                        newQuantity = Math.round(newSum[index]); // Round to the closest g
                    } else if (newSum[index] < 100) {
                        newQuantity = Math.round(newSum[index] / 5) * 5; // Round to the nearest 5 g
                    } else if (newSum[index] < 200) {
                        newQuantity = Math.round(newSum[index] / 10) * 10; // Round to the nearest 10 g
                    } else if (newSum[index] < 500) {
                        newQuantity = Math.round(newSum[index] / 25) * 25; // Round to the nearest 25 g
                    } else if (newSum[index] < 1000) {
                        newQuantity = Math.round(newSum[index] / 50) * 50; // Round to the nearest 50 g
                    } else {
                        newQuantity = Math.round(newSum[index] / 100) * 100; // Round to the nearest 100 g
                    }
                    fractionElements.forEach((el, i) => {
                            el.textContent = 0;
                    });
                    break;

                default: // imperial or default
                if (newSum[index] <= 1) {
                        newQuantity = Math.round(newSum[index] * 12) / 12; // Round to the nearest 12th
                    } else if (newSum[index] < 2) {
                        newQuantity = Math.round(newSum[index] * 4) / 4; // Round to the nearest quarter
                    } else if (newSum[index] < 5) {
                        newQuantity = Math.round(newSum[index] * 2) / 2; // Round to the nearest half
                    } else if (newSum[index] < 10) {
                        newQuantity = Math.round(newSum[index]); // Round to the closest g
                    } else if (newSum[index] < 100) {
                        newQuantity = Math.round(newSum[index] / 5) * 5; // Round to the nearest 5 g
                    } else if (newSum[index] < 200) {
                        newQuantity = Math.round(newSum[index] / 10) * 10; // Round to the nearest 10 g
                    } else if (newSum[index] < 500) {
                        newQuantity = Math.round(newSum[index] / 25) * 25; // Round to the nearest 25 g
                    } else if (newSum[index] < 1000) {
                        newQuantity = Math.round(newSum[index] / 50) * 50; // Round to the nearest 50 g
                    } else {
                        newQuantity = Math.round(newSum[index] / 100) * 100; // Round to the nearest 100 g
                    }
                    fractionElements.forEach((el, i) => {
                        el.textContent = originalFractions[i];
                    });
                    break;
            }

            el.textContent = newQuantity.toFixed(2).replace(/\.00$/, ""); // Remove unnecessary decimals
        });

       /*  fractionElements.forEach((el, index) => {
            el.textContent = originalFractions[index]; // Keep fractions unchanged for now
        }); */
    });
});