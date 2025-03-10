<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php if ( $attributes['blockHeading'] ) : ?>
		<h2><?php echo esc_html( $attributes['blockHeading'] ); ?></h2>
	<?php endif; ?>
	<div class="recipe-ingredient">
		<span class="recipe-ingredient-quantity"><?php echo esc_html( $attributes['ingredientQuantity'] ); ?></span>
		<span class="recipe-ingredient-quantity-fraction"><?php echo esc_html( $attributes['ingredientQuantityFraction'] ); ?></span>
		<span class="recipe-ingredient-unit-choice"><?php echo ( $attributes['ingredientUnitChoice'] ); ?></span>
		<span class="recipe-input-ingredient-name"><?php echo esc_html( $attributes['ingredientName'] ); ?></span>
	</div>
</div>
