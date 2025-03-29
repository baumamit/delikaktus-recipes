<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <div class="delikaktus-recipes-ingredients-list-container">
        <?php if (!empty($attributes['ingredients']) && is_array($attributes['ingredients'])) : ?>
            <?php foreach ($attributes['ingredients'] as $ingredient) : ?>
                <?php
                $unitType = esc_html($ingredient['unitType']);
                $quantity = esc_html($ingredient['quantity']);
                $quantityFraction = esc_html($ingredient['quantityFraction']);
                $unitChoice = esc_html($ingredient['unitChoice']);
                $name = esc_html($ingredient['name']);
                ?>
                <label class="delikaktus-recipes-ingredient-item">
                    <input type="checkbox" class="delikaktus-recipes-ingredients-list-checkbox">
                    <span class="delikaktus-recipes-ingredients-list-checkbox-custom"></span>
                    <span class="delikaktus-recipes-ingredients-list-ingredient-text">
                        <?php echo $quantity; ?> <?php echo $quantityFraction; ?> <?php echo $unitChoice; ?> <?php echo $name; ?>
                    </span>
                </label>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>