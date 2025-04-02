<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <div class="delikaktus-recipes-portions-box">
        <span class="delikaktus-recipes-portions-box-prompt">
            <?php echo __("How many portions would you like to make?", 'delikaktus-recipes'); ?>
        </span>
        <!-- <span class="delikaktus-recipes-portions-box-input">
            <?php
            $portions = esc_html($attributes['portionsAmount']);
            if (is_numeric($portions)) :
                echo $portions;
            endif;
            ?>
        </span> -->
        <span class="delikaktus-recipes-portions-box-input">
            <input class="portionsMultiplier" type="number" value="1" min="1">
        </span>
    </div>
    <div class="delikaktus-recipes-ingredients-list-container">
        <?php if (!empty($attributes['ingredients']) && is_array($attributes['ingredients'])) :
            foreach ($attributes['ingredients'] as $ingredient) :
                $unitType = esc_html($ingredient['unitType']);
                $quantity = esc_html($ingredient['quantity']);
                $quantityFraction = esc_html($ingredient['quantityFraction']);
                $unitChoice = esc_html($ingredient['unitChoice']);
                $name = esc_html($ingredient['name']);
                ?>
                <label class="delikaktus-recipes-ingredient-item">
                    <input type="checkbox" class="delikaktus-recipes-ingredients-list-checkbox">
                    <span class="delikaktus-recipes-ingredients-list-checkbox-custom"></span>
                    <span class="delikaktus-recipes-ingredients-list-ingredient-text" 
                        data-quantity="<?php echo $quantity; ?>" 
                        data-quantity-fraction="<?php echo $quantityFraction; ?>">
                        <?php echo $quantity; echo $quantityFraction; echo $unitChoice; echo $name; ?>
                    </span>
                    <!-- <span class="delikaktus-recipes-ingredients-list-ingredient-text">
                        <?php echo $quantity; echo $quantityFraction; echo $unitChoice; echo $name; ?>
                    </span> -->
                </label>
            <?php endforeach;
        endif; ?>
    </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const multiplierInput = document.querySelector(".portionsMultiplier");
    const ingredientTexts = document.querySelectorAll(".delikaktus-recipes-ingredients-list-ingredient-text");

    multiplierInput.addEventListener("input", function() {
        const multiplier = parseFloat(this.value) || 1;

        ingredientTexts.forEach(span => {
            const baseQuantity = parseFloat(span.dataset.quantity) || 0;
            const baseFraction = parseFloat(span.dataset.quantityFraction) || 0;
            const totalQuantity = (baseQuantity + baseFraction) * multiplier;

            span.innerText = totalQuantity.toFixed(2) + " " + span.innerText.replace(/^[\d.]+/, '');
        });
    });
});
</script>