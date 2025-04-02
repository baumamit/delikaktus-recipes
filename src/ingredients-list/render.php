<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Define a mapping between numeric values and their fraction symbols
$fractionMap = [
    "0.5"   => "½",
    "0.33"  => "⅓",
    "0.25"  => "¼",
    "0.2"   => "⅕",
    "0.166" => "⅙",
    "0.125" => "⅛",
    "0.66"  => "⅔",
    "0.4"   => "⅖",
    "0.375" => "⅜",
    "0.75"  => "¾",
    "0.625" => "⅝",
    "0.875" => "⅞"
];

?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <div class="delikaktus-recipes-portions-box">
        <span class="delikaktus-recipes-portions-box-prompt">
            <?php echo __("How many portions would you like to make?", 'delikaktus-recipes'); ?>
        </span>
        <span class="delikaktus-recipes-portions-box-input">
            <?php
            $portions = esc_html($attributes['portionsAmount']);
            if (is_numeric($portions)) :
                echo $portions;
            endif;
            ?>
        </span>
        <input type="number" class="portionsMultiplier" value="1" min="1">
    </div>

    <div class="delikaktus-recipes-ingredients-list-container">
        <?php if (!empty($attributes['ingredients']) && is_array($attributes['ingredients'])) :
            foreach ($attributes['ingredients'] as $ingredient) :
                $unitType = esc_html($ingredient['unitType']);
                $quantity = esc_html($ingredient['quantity']);
                $quantityFractionValue = esc_html($ingredient['quantityFraction']);
                $unitChoice = esc_html($ingredient['unitChoice']);
                $name = esc_html($ingredient['name']);

                // Convert numeric fraction to fraction symbol
                $quantityFractionSymbol = $fractionMap[$quantityFractionValue] ?? "";
                ?>
                <label class="delikaktus-recipes-ingredient-item">
                    <input type="checkbox" class="delikaktus-recipes-ingredients-list-checkbox">
                    <span class="delikaktus-recipes-ingredients-list-checkbox-custom"></span>

                    <span class="ingredient-quantity" data-quantity="<?php echo $quantity; ?>">
                        <?php echo $quantity; ?>
                    </span>

                    <span class="ingredient-quantity-fraction" data-quantity-fraction="<?php echo $quantityFractionValue; ?>">
                        <?php echo $quantityFractionSymbol; ?>
                    </span>

                    <span class="ingredient-unit-choice">
                        <?php echo $unitChoice; ?>
                    </span>

                    <span class="ingredient-name">
                        <?php echo $name; ?>
                    </span>
                </label>
            <?php endforeach;
        endif; ?>
    </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const portionsInput = document.querySelector(".portionsMultiplier");
    const ingredientQuantities = document.querySelectorAll(".ingredient-quantity");
    const fractionElements = document.querySelectorAll(".ingredient-quantity-fraction");

    // Store initial values
    const originalQuantities = Array.from(ingredientQuantities).map(el => parseFloat(el.dataset.quantity));
    const originalFractions = Array.from(fractionElements).map(el => el.dataset.quantityFraction);

    portionsInput.addEventListener("input", function() {
        let multiplier = parseFloat(this.value);
        if (isNaN(multiplier) || multiplier < 1) multiplier = 1;

        ingredientQuantities.forEach((el, index) => {
            const newQuantity = originalQuantities[index] * multiplier;
            el.textContent = newQuantity.toFixed(2).replace(/\.00$/, ""); // Remove unnecessary decimals
        });

        fractionElements.forEach((el, index) => {
            el.textContent = originalFractions[index]; // Keep fractions unchanged for now
        });
    });
});
</script>
