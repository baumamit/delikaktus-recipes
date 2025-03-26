<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php if ( ! empty( $attributes['blockHeading'] ) ) : ?>
		<h2><?php echo esc_html( $attributes['blockHeading'] ); ?></h2>
	<?php endif; ?>

	<div class="recipe-ingredients-list">
		<?php if ( ! empty( $attributes['ingredients'] ) && is_array( $attributes['ingredients'] ) ) : ?>
			<?php foreach ( $attributes['ingredients'] as $ingredient ) : ?>
				<?php 
					$unitType = esc_html( $ingredient['unitType'] );
					$quantity = esc_html( $ingredient['quantity'] );
					$quantityFraction = esc_html( $ingredient['quantityFraction'] );
					$unitChoice = esc_html( $ingredient['unitChoice'] );
					$name = esc_html( $ingredient['name'] );
				?>
				<label class="recipe-ingredient">
					<input type="checkbox" class="recipe-checkbox">
					<span class="recipe-checkbox-custom"></span>
					<span class="recipe-ingredient-text">
						<?php echo $quantity; ?> <?php echo $quantityFraction; ?> <?php echo $unitChoice; ?> <?php echo $name; ?>
					</span>
				</label>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
</div>
