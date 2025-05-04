<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

//error_log(print_r($attributes, true));

// Check the debug.log file in wp-content to verify that the attributes are being passed correctly
error_log(print_r($attributes, true));


// Assuming $attributes are passed to the render.php function
// from the block's attributes set by the user in the block editor edit.js
$attributes = isset($attributes) ? $attributes : []; // Ensure $attributes is defined
$unitSystem = isset($attributes['unitSystem']) ? $attributes['unitSystem'] : 'metric'; // Default to 'metric' if not set
$portionsAmount = isset($attributes['portionsAmount']) ? $attributes['portionsAmount'] : 1;  // Default to 1 portion if not set

// Enqueue your frontend JavaScript file
wp_enqueue_script(
    'delikaktus-recipes-frontend-js',
    plugin_dir_url(__FILE__) . 'view.js', // Path set in webpack.config.js
    array('jquery'),
    '1.0',
    true  // Load script in the footer
);

// Localize the script to pass all attributes to JS
wp_localize_script('delikaktus-recipes-frontend-js', 'recipeEditorData', $attributes);

// Define a mapping between numeric values and their fraction symbols
$fractionMap = [
    "0" => "",
    "0.125" => "⅛",
    "0.25"  => "¼",
    "0.3333"  => "⅓",
    "0.375" => "⅜",
    "0.5"   => "½",
    "0.625" => "⅝",
    "0.6667"  => "⅔",
    "0.75"  => "¾",
    "0.875" => "⅞"
];
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <div class="delikaktus-recipes-portions-box">
        <span class="delikaktus-recipes-portions-box-prompt">
            <?php echo __("For how many portions is this recipe?", 'delikaktus-recipes'); ?>
        </span>

        <input
            type="number"
            class="delikaktus-recipes-portions-box-input"
            value="<?php echo esc_html($portionsAmount); ?>"
            min="0"
            step="<?php echo ($portionsAmount > 1) ? '1' :  '0.5'; ?>"
            aria-live="assertive"
        />
    </div>

    <div class="delikaktus-recipes-ingredients-list-container">
        <?php if (!empty($attributes['ingredients']) && is_array($attributes['ingredients'])) :
            foreach ($attributes['ingredients'] as $ingredient) :
                $unitType = isset($ingredient['unitType']) ? esc_html($ingredient['unitType']) : '';
                $quantity = !empty($ingredient['quantity']) ? esc_html($ingredient['quantity']) : 0;
                $quantityFractionValue = !empty($ingredient['quantityFraction']) ? esc_html($ingredient['quantityFraction']) : 0;
                //error_log("Quantity: " . print_r($quantity, true));
                //error_log("Quantity Fraction: " . print_r($quantityFractionValue, true));
                $unitChoice = isset($ingredient['unitChoice']) ? esc_html($ingredient['unitChoice']) : '';
                $name = isset($ingredient['name']) ? esc_html($ingredient['name']) : '';
        
                // Convert numeric fraction to fraction symbol
                $quantityFractionSymbol = $fractionMap[$quantityFractionValue] ?? "";
                ?>
                <label class="delikaktus-recipes-ingredient-item" data-key="<?php echo esc_attr($ingredient['id'] ?? $index); ?>">
                    <input type="checkbox"
                        class="delikaktus-recipes-ingredients-list-checkbox"
                        aria-label="Checkbox for ingredient: <?php echo $name; ?>"
                        aria-live="polite"
                    >
                    <span class="delikaktus-recipes-ingredients-list-checkbox-custom"></span>

                    <span class="ingredient-quantity"
                        aria-live="polite"
                        data-quantity="<?php echo $quantity; ?>">
                        <?php echo ($quantity > 0) ? $quantity : ''; ?>
                    </span>

                    <span class="ingredient-quantity-fraction" 
                        aria-live="polite"
                        data-quantity-fraction="<?php echo $quantityFractionValue; ?>">
                        <?php echo $quantityFractionSymbol ? $quantityFractionSymbol : ""; ?>
                    </span>

                    <span class="ingredient-unit-choice" aria-live="polite">
                        <?php echo $unitChoice; ?>
                    </span>

                    <span class="ingredient-name" aria-live="polite">
                        <?php echo $name; ?>
                    </span>
                </label>
            <?php endforeach;
        endif; ?>
    </div>
</div>