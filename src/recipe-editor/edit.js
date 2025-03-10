import { useState } from '@wordpress/element';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
// Import block toolbar icons
import { TbCircleLetterMFilled ,TbCircleLetterIFilled, TbCircleDotFilled } from "react-icons/tb";
import { MdAddToPhotos, MdDelete } from "react-icons/md";

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

//Object of unit choices matching every unit system and unit type
const unitOptions = {
	[UnitSystem.METRIC]: {
		[UnitType.MASS]: ['g', 'kg'],
		[UnitType.VOLUME]: ['ml', 'L'],
		[UnitType.TOOL]: ['cup', 'tsp', 'Tbsp'],
	},
	[UnitSystem.IMPERIAL]: {
		[UnitType.MASS]: ['oz', 'lbs'],
		[UnitType.VOLUME]: ['pint', 'qt'],
		[UnitType.TOOL]: ['cup', 'tsp', 'Tbsp'],
	},
	[UnitSystem.DEFAULT]: {} //null,
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

		const newUnitSystem = nextUnitSystem[unitSystem];
		let newUnitType = props.attributes.ingredientUnitType;
		// If the current unit type is not valid in the new unit system, reset it
		if (!unitOptions[newUnitSystem]?.[newUnitType]) {
			newUnitType = Object.keys(unitOptions[newUnitSystem] || {})[0] || '';
		}
		const newUnitChoice = unitOptions[newUnitSystem]?.[newUnitType]?.[0] || '';

		setAttributes({ 
			unitSystem: newUnitSystem, 
			ingredientUnitType: newUnitType, 
			ingredientUnitChoice: newUnitChoice//unitOptions[newUnitSystem][newUnitType] || ''
		}); // Save to block attributes
	};

	// Choose the appropriate icon based on the current mode
	const getUnitSystemIcon = () => {
		switch (unitSystem) {
		case UnitSystem.METRIC:
			return <TbCircleLetterMFilled />;
		case UnitSystem.IMPERIAL:
			return <TbCircleLetterIFilled />;
		default:
			return <TbCircleDotFilled />;
		}
	};

	const handleHeadingChange = (e) => {
		props.setAttributes({ blockHeading: e.target.value });
	};

	// Function to translate terms based on current language
	const getTranslation = (text) => {
		const translations = {
		en: {
			cup: 'cup',
			tsp: 'tsp',
			Tbsp: 'Tbsp'
		},
		it: {
			cup: 'tazza',
			tsp: 'cucchiaino',
			Tbsp: 'cucchiaio'
		},
		he: {
			cup: 'כוס',
			tsp: 'כפית',
			Tbsp: 'כף'
		},
		};

		const currentLanguage = window.recipeEditorData?.currentLanguage || 'en';
		return translations[currentLanguage]?.[text] || text;
	};
	
	const addRecipeIngredient = () => {
		const renderUnitTypeChoice = () => {
			const handleUnitTypeChange = (e) => {
				const newUnitType = e.target.value;
				const { unitSystem } = props.attributes;
				
				// Get the first available unit choice for the new unit type
				const newUnitChoice = unitOptions[unitSystem]?.[newUnitType]?.[0] || '';
			
				props.setAttributes({
					ingredientUnitType: newUnitType,
					ingredientUnitChoice: newUnitChoice, // Set default unit choice
				});
			};

			return (
				<select
					onChange={handleUnitTypeChange}
					name="Unit Type"
					value={props.attributes.ingredientUnitType}
					id="recipe-input-unit-type"
					className='recipe-input-unit-type'
					>
					<option
						className='recipe-input-unit-type-option'
						value=""
					>No unit</option>

					<option
						className='recipe-input-unit-type-option'
						value={UnitType.MASS}
						//selected={props.attributes.ingredientUnitType == UnitType.MASS}
					>⚖️ Mass</option>

					<option 
						className='recipe-input-unit-type-option' 
						value={UnitType.VOLUME}
						//selected={props.attributes.ingredientUnitType == UnitType.VOLUME}
					>💧 Volume</option>

					<option 
						className='recipe-input-unit-type-option' 
						value={UnitType.TOOL}
						//selected={props.attributes.ingredientUnitType == UnitType.TOOL}
					>🥄 Tool</option>
				</select>
			)
		};

		const handleQuantityChange = (e) => {
			props.setAttributes({ingredientQuantity: e.target.value});
		};

		const renderQuantityFractionChange = () => {
			const handleQuantityFractionChange = (e) => {
				props.setAttributes({ingredientQuantityFraction: e.target.value});
			}

			return (
				<select 
					onChange={handleQuantityFractionChange} 
					name="Quantity Fraction" 
					id="recipe-input-quantity-fraction"  //https://lights0123.com/fractions/
					className="recipe-input-quantity-fraction"
					value={props.attributes.ingredientQuantityFraction} // This controls the selected option
				>

					<option
						className='recipe-input-quantity-fraction-option'
						value=""
					></option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="½"
					>½</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="⅓"
					>⅓</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="¼"
					>¼</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="⅕"
					>⅕</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="⅙"
					>⅙</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="⅛"
					>⅛</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="⅔"
					>⅔</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="⅖"
					>⅖</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="⅜"
					>⅜</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="¾"
					>¾</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="⅝"
					>⅝</option>

					<option
						className='recipe-input-quantity-fraction-option'
						value="⅞"
					>⅞</option>
				</select>
			);
		};	


		const renderUnitChoice = () => {
			const { unitSystem = UnitSystem.DEFAULT, ingredientUnitType } = props.attributes;

			// Return the appropriate select element based on the unit system and unit type
			const options = unitOptions[unitSystem]?.[ingredientUnitType];
	
			const renderUnitChoiceSelect = (options) => {
				const handleUnitChoiceChange = (e) => {
					props.setAttributes({ingredientUnitChoice: e.target.value});
				}

				return (
					<select 
						onChange={handleUnitChoiceChange} 
						name="Unit Choice" 
						id="recipe-input-unit-choice" 
						className="recipe-input-unit-choice"
						value={props.attributes.ingredientUnitChoice} // This controls the selected option
					>
						{options.map((option, index) => (
							  <option key={index} value={option}>
								{getTranslation(option)}
							</option> // Translate option values
						))}
					</select>
				);
			};	
	
			return options ? renderUnitChoiceSelect(options) : null;
		};

		const handleNameChange = (e) => {
			props.setAttributes({ingredientName: e.target.value});
		}

		return (		
			<div className="ingredient-inputs-container">
				<div className="ingredient-inputs-controllers">
					<button
						onClick={()=>{}}
						id='recipe-ingredient-delete'
						className='recipe-ingredient-delete'
					>
						<MdDelete />
					</button>
					
					<button
						onClick={()=>{}}
						id='recipe-ingredient-create'
						className='recipe-ingredient-create'
					>
						<MdAddToPhotos />
					</button>
				</div>

				{renderUnitTypeChoice()}

				<input 
					onChange={handleQuantityChange} 
					className='recipe-input-quantity' 
					type="text" 
					placeholder='How much?'
					value={props.attributes['ingredientQuantity']} 
				/>

				{renderQuantityFractionChange()}

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
