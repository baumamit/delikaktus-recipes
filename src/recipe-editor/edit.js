import { useState } from '@wordpress/element';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
// Import block toolbar icons
import { TbCircleLetterMFilled ,TbCircleLetterIFilled, TbCircleDotFilled } from "react-icons/tb";
// Import add/delete icons
import { MdAddToPhotos, MdDelete, MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

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

// Enum-like object to represent unit system modes
const UnitSystem = {
	DEFAULT: 'default',
	METRIC: 'metric',
	IMPERIAL: 'imperial',
};

// Enum-like object to represent the type of units for each ingredient
const UnitType = {
	MASS: 'mass',
	VOLUME: 'volume',
	TOOL: 'tool',
};

// Unit options based on unit system and type
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
	[UnitSystem.DEFAULT]: {},
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

	// Function that returns the current language code or english as default
	const currentLanguage = window.recipeEditorData?.currentLanguage || 'en';
	return translations[currentLanguage]?.[text] || text;
};

export default function Edit(props) {
	const { attributes, setAttributes } = props;
	const { unitSystem, blockHeading, ingredients } = attributes;

	// Function to toggle between unit systems
	const toggleUnitSystem = () => {
		const nextUnitSystem = {
			[UnitSystem.DEFAULT]: UnitSystem.METRIC,
			[UnitSystem.METRIC]: UnitSystem.IMPERIAL,
			[UnitSystem.IMPERIAL]: UnitSystem.DEFAULT,
		};

		const newUnitSystem = nextUnitSystem[unitSystem];
		setAttributes({ unitSystem: newUnitSystem });
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
		setAttributes({ blockHeading: e.target.value });
	};

	// Handle ingredient changes
	const handleIngredientChange = (index, key, value) => {
		const newIngredients = [...ingredients];
		newIngredients[index] = { ...newIngredients[index], [key]: value };
		setAttributes({ ingredients: newIngredients });
	};

	// Handle adding a new ingredient
	const addIngredient = () => {
		setAttributes({
			ingredients: [
				...ingredients,
				{
					unitType: '',
					quantity: '',
					quantityFraction: '',
					unitChoice: '',
					name: ''
				}
			]
		});
	};

	// Handle deleting an ingredient
	const deleteIngredient = (index) => {
		const newIngredients = ingredients.filter((_, i) => i !== index);
		setAttributes({ ingredients: newIngredients });
	};

	// Handle unit type change
	const handleUnitTypeChange = (index, e) => {
		const newUnitType = e.target.value || UnitType.MASS; // Default to mass if empty
		const newUnitChoice = (unitOptions[unitSystem]?.[newUnitType] || [])[0] || ''; 
	
		console.log("Before Update:", ingredients[index]);
	
		// Update the attributes in one go
		setAttributes({
			ingredients: ingredients.map((ingredient, i) =>
				i === index ? { ...ingredient, unitType: newUnitType, unitChoice: newUnitChoice } : ingredient
			),
		});
	
		console.log("After Update:", { ...ingredients[index], unitType: newUnitType, unitChoice: newUnitChoice });
	};

	// Handle quantity change
	const handleQuantityChange = (index, e) => {
		handleIngredientChange(index, 'quantity', e.target.value);
	};

	// Handle quantity fraction change
	const handleQuantityFractionChange = (index, e) => {
		handleIngredientChange(index, 'quantityFraction', e.target.value);
	};

	// Handle ingredient name change
	const handleNameChange = (index, e) => {
		handleIngredientChange(index, 'name', e.target.value);
	};

	// Render ingredient input fields
	return (
		<div { ...useBlockProps() }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={getUnitSystemIcon()}
						label={getTranslation(unitSystem.charAt(0).toUpperCase() + unitSystem.slice(1) + ' Units')}
						onClick={toggleUnitSystem}
						isPressed={false}
					/>
				</ToolbarGroup>
			</BlockControls>

			<h2>
				<input
					className="wp-block-heading "
					type="text"
					value={blockHeading}
					onChange={handleHeadingChange}
					placeholder={getTranslation('Enter heading...')}
					style={{ all: 'inherit', border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
				/>
			</h2>

			<div className="ingredient-inputs-container">
				{/* Render each ingredient */}
				{ingredients.map((ingredient, index) => (
					<div key={index} className="ingredient-input">
						<div className="ingredient-controllers">
							<button
								onClick={() => deleteIngredient(index)}
								className='recipe-ingredient-delete'
							>
								<MdDelete />
							</button>

							<div className='recipe-ingredient-arrows'>
								{/* Button to move ingredient up in the list */}
								<button
									onClick={() => {}}
									className='recipe-ingredient-arrow-up'
								>
									<MdArrowDropUp />
								</button>
								{/* Button to move ingredient up in the list */}
								<button
									onClick={() => {}}
									className='recipe-ingredient-arrow-down'
								>
									<MdArrowDropDown />
								</button>
							</div>

						</div>

						{/* Unit Type */}
						<select
							onChange={(e) => handleUnitTypeChange(index, e)}
							name="Unit Type"
							value={ingredient.unitType}
							className='recipe-input-unit-type'
						>
							<option value="">No unit</option>
							<option value={UnitType.MASS}>⚖️ {getTranslation('Mass')}</option>
							<option value={UnitType.VOLUME}>💧 {getTranslation('Volume')}</option>
							<option value={UnitType.TOOL}>🥄 {getTranslation('Tool')}</option>
						</select>

						{/* Quantity */}
						<input 
							onChange={(e) => handleQuantityChange(index, e)} 
							className='recipe-input-quantity' 
							type="text" 
							placeholder={getTranslation('How much?')}
							value={ingredient.quantity} 
						/>

						{/* Quantity Fraction */}
						<select 
							onChange={(e) => handleQuantityFractionChange(index, e)} 
							name="Quantity Fraction" 
							className="recipe-input-quantity-fraction"
							value={ingredient.quantityFraction}
						>
							<option value=""></option>
							<option value="½">½</option>
							<option value="⅓">⅓</option>
							<option value="¼">¼</option>
							<option value="⅕">⅕</option>
							<option value="⅙">⅙</option>
							<option value="⅛">⅛</option>
							<option value="⅔">⅔</option>
							<option value="⅖">⅖</option>
							<option value="⅜">⅜</option>
							<option value="¾">¾</option>
							<option value="⅝">⅝</option>
							<option value="⅞">⅞</option>
						</select>

						{/* Unit Choice */}
						<select 
							onChange={(e) => handleIngredientChange(index, 'unitChoice', e.target.value)} 
							name="Unit Choice" 
							className="recipe-input-unit-choice"
							value={ingredient.unitChoice}
						>
							<option value="" disabled>{getTranslation('Select a unit')}</option>
							{(unitOptions[unitSystem]?.[ingredient.unitType] || []).map((option, i) => (
								<option key={i} value={option}>{getTranslation(option)}</option>
							))}
						</select>

						{/* Ingredient Name */}
						<input 
							onChange={(e) => handleNameChange(index, e)} 
							className='recipe-input-ingredient-name' 
							type="text" 
							placeholder={getTranslation('Ingredient name...')} 
							value={ingredient.name} 
						/>
					</div>
				))}

				{/* Button to add a new ingredient */}
				<button
					onClick={addIngredient}
					className='recipe-ingredient-create'
				>
					<MdAddToPhotos />
				</button>

			</div>
		</div>
	);
}
