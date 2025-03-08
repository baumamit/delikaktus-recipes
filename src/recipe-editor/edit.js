import { useState } from '@wordpress/element';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
// Import block toolbar icons
//import { FaBalanceScale, FaBalanceScaleLeft, FaBalanceScaleRight } from "react-icons/fa";
import { FaRegStar, FaBalanceScaleLeft ,FaBalanceScale ,FaBalanceScaleRight } from "react-icons/fa";
import { TbCircleLetterMFilled ,TbCircleLetterIFilled, TbCircleDotFilled } from "react-icons/tb";

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, BlockControls } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

// Enum-like object to represent modes
const UnitSystem = {
	DEFAULT: 'default',
	METRIC: 'metric',
	IMPERIAL: 'imperial',
};

// Enum-like object to represent modes
const UnitType = {
	MASS: 'mass',
	VOLUME: 'volume',
	TOOL: 'tool',
};

export default function Edit(props) {
	const { attributes, setAttributes } = props;
	const { unitSystem } = attributes; // Get unitSystem from block attributes
  
	// Function to cycle through the modes
	const toggleUnitSystem = () => {
		const nextUnitSystem = {
		[UnitSystem.DEFAULT]: UnitSystem.METRIC,
		[UnitSystem.METRIC]: UnitSystem.IMPERIAL,
		[UnitSystem.IMPERIAL]: UnitSystem.DEFAULT,
		};
		setAttributes({ unitSystem: nextUnitSystem[unitSystem] }); // Save to block attributes
	};

	// Choose the appropriate icon based on the current mode
	const getUnitSystemIcon = () => {
		switch (unitSystem) {
		case UnitSystem.METRIC:
			return <TbCircleLetterMFilled />;
		case UnitSystem.IMPERIAL:
			return <TbCircleLetterIFilled />;
		case UnitSystem.DEFAULT:
		default:
			return <TbCircleDotFilled />;
		}
	};

	const handleHeadingChange = (e) => {
		props.setAttributes({ blockHeading: e.target.value });
	};

	const handleUnitTypeChange = (e) => {
		props.setAttributes({ingredientUnitType: e.target.value});
	}

	const handleQuantityChange = (e) => {
		props.setAttributes({ingredientQuantity: e.target.value});
	}

	const renderUnitChoice = () => {
		switch (props.attributes.unitSystem) {
			case UnitSystem.METRIC:
				switch (props.attributes.ingredientUnitType) {
					case UnitType.MASS:
						return (
							<select 
								onChange={handleUnitChoiceChange} 
								name="Unit Choice" 
								id="recipe-input-unit-choice" 
								className="recipe-input-unit-choice"
								value={props.attributes.ingredientUnitChoice} // This controls the selected option
							>
								<option value="g">g</option>
								<option value="kg">kg</option>
							</select>
						);
					case UnitType.VOLUME:
						return (
							<select 
								onChange={handleUnitChoiceChange} 
								name="Unit Choice" 
								id="recipe-input-unit-choice" 
								className="recipe-input-unit-choice"
								value={props.attributes.ingredientUnitChoice} // This controls the selected option
							>
								<option value="ml">ml</option>
								<option value="L">L</option>
							</select>
						);
					case UnitType.TOOL:
						return (
							<select 
								onChange={handleUnitChoiceChange} 
								name="Unit Choice" 
								id="recipe-input-unit-choice" 
								className="recipe-input-unit-choice"
								value={props.attributes.ingredientUnitChoice} // This controls the selected option
							>
								<option value="cup">cup</option>
								<option value="tsp">tsp</option>
								<option value="Tbsp">Tbsp</option>
							</select>
						);
	
					default:
						return null;
				}	
		
			case UnitSystem.IMPERIAL:
				switch (props.attributes.ingredientUnitType) {
					case UnitType.MASS:
						return (
							<select 
								onChange={handleUnitChoiceChange} 
								name="Unit Choice" 
								id="recipe-input-unit-choice" 
								className="recipe-input-unit-choice"
								value={props.attributes.ingredientUnitChoice} // This controls the selected option
							>
								<option value="oz">oz</option>
								<option value="lbs">lbs</option>
							</select>
						);
					case UnitType.VOLUME:
						return (
							<select 
								onChange={handleUnitChoiceChange} 
								name="Unit Choice" 
								id="recipe-input-unit-choice" 
								className="recipe-input-unit-choice"
								value={props.attributes.ingredientUnitChoice} // This controls the selected option
							>
								<option value="pint">pint</option>
								<option value="qt">qt</option>
							</select>
						);
					case UnitType.TOOL:
						return (
							<select 
								onChange={handleUnitChoiceChange} 
								name="Unit Choice" 
								id="recipe-input-unit-choice" 
								className="recipe-input-unit-choice"
								value={props.attributes.ingredientUnitChoice} // This controls the selected option
							>
								<option value="cup">cup</option>
								<option value="tsp">tsp</option>
								<option value="Tbsp">Tbsp</option>
							</select>
						);
	
					default:
						return null;
				}	
		
			case UnitSystem.DEFAULT:
				return null;
		
			default:
				return null;
	}
	};

	const addRecipeIngredient = () => {
		return (		
			<div className="ingredient-inputs-container">
				<div className="ingredient-inputs-controllers">
					
					<select 
						onChange={handleUnitTypeChange} 
						name="Unit Type" 
						id="recipe-input-unit-type" 
						className='recipe-input-unit-type' 
					>
						<option 
							className='recipe-input-unit-type-option' 
							value="" 
							selected={props.attributes.ingredientUnitType}
						>No unit</option>
						<option 
							className='recipe-input-unit-type-option'
							value={UnitType.MASS}
							selected={props.attributes.ingredientUnitType == UnitType.MASS}
						>Mass</option>
						<option 
							className='recipe-input-unit-type-option' 
							value={UnitType.VOLUME}
							selected={props.attributes.ingredientUnitType == UnitType.VOLUME}
						>
							Volume
						</option>
						<option 
							className='recipe-input-unit-type-option' 
							value={UnitType.TOOL}
							selected={props.attributes.ingredientUnitType == UnitType.TOOL}
						>Tool</option>
					</select>
				</div>

				<input 
					onChange={handleQuantityChange} 
					className='recipe-input-quantity' 
					type="text" 
					placeholder='How much?' 
					value={props.attributes['ingredientQuantity']} 
				/>
	
				{renderUnitChoice()}
	
				<input 
					onChange={handleNameChange} 
					className='recipe-input-ingredient-name' 
					type="text" 
					placeholder='Ingredient name...' 
					value={props.attributes['ingredientName']} 
				/>
			</div>
		)
	}

	const handleUnitChoiceChange = (e) => {
		props.setAttributes({ingredientUnitChoice: e.target.value});
	}

	const handleNameChange = (e) => {
		props.setAttributes({ingredientName: e.target.value});
	}

	return (
		<div { ...useBlockProps() }>
			<BlockControls>
				<ToolbarGroup>
				<ToolbarButton
					icon={getUnitSystemIcon()} // Dynamically render the icon based on the current mode
					label={__(unitSystem.charAt(0).toUpperCase() + unitSystem.slice(1) + ' Units', 'recipe-editor')}
					onClick={toggleUnitSystem}
					isPressed={false} // No need to track the pressed state in this case
				/>
				</ToolbarGroup>
			</BlockControls>

			<div>
				<input
					className="wp-block-heading"
					type="text"
					value={props.attributes.blockHeading}
					onChange={handleHeadingChange}
					placeholder={__('Enter heading...', 'recipe-editor')}
					style={{ all: 'inherit', border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
				/>
			</div>
	
			{addRecipeIngredient()}
			
		</div>
	);
}
