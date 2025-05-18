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
 * WordPress components
 */
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

/**
 * Import icons
 */
import { TbCircleLetterMFilled, TbCircleLetterIFilled, TbCircleDotFilled } from "react-icons/tb";
import { GiKnifeFork as PortionsModeButton } from "react-icons/gi";
import { MdAddToPhotos as IconAdd, MdDelete as IconDelete } from "react-icons/md";
import { IoIosArrowUp as IconArrowUp, IoIosArrowDown as IconArrowDown, IoIosAdd as IconPlus, IoIosRemove as IconMinus } from "react-icons/io";

/**
 * Import custom components
 */
import PortionsEditPanel from "./components/PortionsEditPanel";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
// Development path,Webpack converts this to the path '../css/editor.css' relative to this file in the build folder
import './editor.scss';

// To Generate a Unique ID for Each Ingredient
import { v4 as uuidv4 } from 'uuid'; // Import uuid library
// useMemo to optimize re-renders of uuid
import { useMemo } from 'react';

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
    DEFAULT: "default",
    METRIC: "metric",
    IMPERIAL: "imperial",
};

// Enum-like object to represent the type of units for each ingredient
const UnitType = {
    EYE: "eye",
    MASS: "mass",
    VOLUME: "volume",
    TOOL: "tool",
};

// Unit options based on unit system and type
const unitOptions = {
    [UnitSystem.METRIC]: {
        [UnitType.EYE]: [""],
        [UnitType.MASS]: ["g", "kg"],
        [UnitType.VOLUME]: ["ml", "L"],
        [UnitType.TOOL]: ["cup", "tsp", "Tbsp"],
    },
    [UnitSystem.IMPERIAL]: {
        [UnitType.EYE]: [""],
        [UnitType.MASS]: ["oz", "lbs"],
        [UnitType.VOLUME]: ["fl oz", "pt", "qt", "gal"],
        [UnitType.TOOL]: ["cup", "tsp", "Tbsp"],
    },
    [UnitSystem.DEFAULT]: {
        [UnitType.EYE]: [""],
        [UnitType.MASS]: [""],
        [UnitType.VOLUME]: [""],
        [UnitType.TOOL]: ["cup", "tsp", "Tbsp"],
    },
};

const fractionOptions = [
    { value: 0, label: '' },
    { value: 1/8, label: '⅛' },
    { value: 1/4, label: '¼' },
    { value: 1/3, label: '⅓' },
    { value: 3/8, label: '⅜' },
    { value: 1/2, label: '½' },
    { value: 5/8, label: '⅝' },
    { value: 2/3, label: '⅔' },
    { value: 3/4, label: '¾' },
    { value: 7/8, label: '⅞' },
];

// Function to translate terms based on current language
const getTranslation = (text) => {
    const translations = {
        en: {
            cup: "cup",
            cups: "cups",
            tsp: "tsp",
            tsps: "tsps",
            Tbsp: "Tbsp",
            Tbsps: "Tbsps",
            g: "g",
            kg: "kg",
            ml: "ml",
            L: "L"
        },
        it: {
            cup: "tazza",
            cups: "tazze",
            tsp: "cucchiaino",
            tsps: "cucchiaini",
            Tbsp: "cucchiaio",
            Tbsps: "cucchiai",
            g: "g",
            kg: "kg",
            ml: "ml",
            L: "L"
        },
        he: {
            cup: "כוס",
            cups: "כוסות",
            tsp: "כפית",
            tsps: "כפיות",
            Tbsp: "כף",
            Tbsps: "כפות",
            g: "גרם",
            kg: "ק\"ג",
            ml: "מ\"ל",
            L: "ליטר"
        },
    };

    // Function that returns the current language code or english as default
    const currentLanguage = window.delikaktusRecipesData?.currentLanguage;

    return translations[currentLanguage]?.[text] || text;
};

/* const textDomain = 'delikaktus-recipes';
// Helper function for translation of strings to the post language from the .po and .mo files
const translate = (text) => {
    return (__(text, textDomain));
}
console.log(translate("Translation text from translate() function")); */

export default function Edit(props) {
    const { attributes, setAttributes } = props;
    // Ensure attributes have default values
    const {
        unitSystem = UnitSystem.DEFAULT,
        ingredients = [],
        portionsMode = false,
        portionsAmount = 1
    } = attributes;

    // useMemo to optimize re-renders of uuid
    const generateUuid = useMemo(() => {
        return () => uuidv4() || `fallback-${Date.now()}-${Math.random()}`;
    }, []);

    let hasUpdates = false;

    // Check if any ingredient is missing an ID
    const updatedIngredients = ingredients.map((ingredient) => {
        if (!ingredient.id) {
            hasUpdates = true;
            return { ...ingredient, id: generateUuid() }; // Create and memorize a unique ID
        }
        return ingredient;
    });

    if (hasUpdates) {
        setAttributes({ ingredients: updatedIngredients });
    }

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
    // Function to toggle between unit systems
    const togglePortionsMode = () => {
        setAttributes({ portionsMode: !portionsMode });
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

    const handleIngredientChange = (index, key, value) => {
        const newIngredients = ingredients.map((ingredient, i) =>
            // Update only the changed ingredients[index].key
            i === index
            ? { ...ingredient, [key]: value }
            : ingredient
        );
        // Update the attributes in one go
        setAttributes({
            ingredients: newIngredients,
        });
    };

    // Handle adding a new ingredient
    const addIngredient = () => {
        const defaultUnitType = UnitType.MASS;
        const defaultUnitChoice = (unitOptions[unitSystem]?.[defaultUnitType] || [])[0] || '';
        const defaultQuantity = 1;
        const defaultQuantityFraction = 0;
        setAttributes({
            ingredients: [
                ...ingredients,
                {
                    id: generateUuid(), // Create and memorize a unique ID
                    unitType: defaultUnitType,
                    quantity: defaultQuantity,
                    quantityFraction: defaultQuantityFraction,
                    unitChoice: defaultUnitChoice,
                    name: ""
                }
            ]
        });
    };

    // Handle deleting an ingredient
    const deleteIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setAttributes({ ingredients: newIngredients });
    };

    // Handle adding a new ingredient
    const moveIngredientUp = (index) => {
        if (index > 0) {
            const newIngredients = [...ingredients];
            [newIngredients[index - 1], newIngredients[index]] = [newIngredients[index], newIngredients[index - 1]];
            setAttributes({ ingredients: newIngredients });
        }
    };

    // Handle adding a new ingredient
    const moveIngredientDown = (index) => {
        if (index < ingredients.length - 1) {
            const newIngredients = [...ingredients];
            [newIngredients[index], newIngredients[index + 1]] = [newIngredients[index + 1], newIngredients[index]];
            setAttributes({ ingredients: newIngredients });
        }
    };

    // Handle unit type change
    const handleUnitTypeChange = (index, e) => {
        const newUnitType = e.target.value || UnitType.MASS; // Default to mass if empty
        const validUnitChoices = unitOptions[unitSystem]?.[newUnitType] || [];
        const newUnitChoice = validUnitChoices[0] || '';
        const newIngredients = ingredients.map((ingredient, i) =>
            i === index
                ? { ...ingredient, unitType: newUnitType, unitChoice: newUnitChoice }
                : ingredient
        );
        // Update the unit choice based on the new unit type
        setAttributes({ ingredients: newIngredients });
    };

    // Handle quantity change
    const handleQuantityChange = (index, e) => {
        // Update the quantity as a valid number or a fallback value of 0
        const value = Number.parseFloat(e.target.value);
        if (!isNaN(value)) {
            handleIngredientChange(index, 'quantity', value);
            return;
        }
        // else: do not update, so the previous value remains
   };

    const increaseIngredientQuantity = (index) => {
        const value = Number(ingredients[index].quantity) || 0; // Get the current value, default 0 if NaN
        const step = value >= 1 ? 1 : 0.1; // Define the appropriate step based on the current value
        const eplsilon = 0.000001; // Adding an epsilon to avoid floating point errors in the division operation
        const roundedDownValue = Math.floor(value/step+eplsilon)*step; // Round down to the nearest appropriate decimal, epsilon added
        const newValue = parseFloat( (roundedDownValue + step).toFixed(1) ); // Increase by step and round to the nearest first decimal
        handleIngredientChange(index, 'quantity', Math.min( 999, Math.max( 0, newValue ) )); // Update the quantity, bound between 0 and 999
    };

    const decreaseIngredientQuantity = (index) => {
        const value = Number(ingredients[index].quantity) || 0; // Get the current value, default 0 if NaN
        const step = value > 1 ? 1 : 0.1; // Define the appropriate step based on the current value
        const eplsilon = 0.000001; // Subtract an epsilon to avoid floating point errors in the division operation
        const roundedUpValue = Math.ceil(value/step-eplsilon)*step; // Round up to the nearest appropriate decimal, epsilon subtracted
        const newValue = parseFloat( (roundedUpValue - step).toFixed(1) ); // Decrease by step and round to the nearest first decimal
        handleIngredientChange(index, 'quantity', Math.min( 999, Math.max( 0, newValue ) )); // Update the quantity, bound between 0 and 999
    };

    // Handle quantity fraction change
    const handleQuantityFractionChange = (index, e) => {
        // Update the quantity fraction as a valid number or a fallback value of 0
        handleIngredientChange(index, 'quantityFraction', Number.parseFloat(e.target.value) || 0);
    };

    // Handle ingredient name change
    const handleNameChange = (index, e) => {
        handleIngredientChange(index, 'name', e.target.value);
    };

    // Render ingredient input fields
    return (
        <div {...useBlockProps()}>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        id='toolbar-button-unit-system'
                        icon={getUnitSystemIcon()}
                        label={unitSystem.charAt(0).toUpperCase() + unitSystem.slice(1) + ' Units'}
                        onClick={toggleUnitSystem}
                        isPressed={false}
                    />
                    <ToolbarButton
                        id='toolbar-button-portions-mode'
                        icon={<PortionsModeButton />}
                        label='Portions Control'
                        onClick={togglePortionsMode}
                        isPressed={portionsMode}
                    />
                </ToolbarGroup>
            </BlockControls>

            <PortionsEditPanel
                promptText={'For how many portions is this recipe?'}
                portionsMode={portionsMode}
                portions={portionsAmount}
                setPortions={(newPortionsAmount) => setAttributes({ portionsAmount: newPortionsAmount })}
            />

            <div className="delikaktus-recipes-ingredients-container">
                {/* Render each ingredient to a list */}
                {ingredients.map((ingredient, index) => {
                    // Condition to display or not the UnitChoice
                    const displayUnitChoice = (unitSystem !== UnitSystem.DEFAULT && ingredient.unitType !== UnitType.EYE)
                    || (unitSystem === UnitSystem.DEFAULT && ingredient.unitType === UnitType.TOOL);

                    return (
                        <div key={ingredient.id} className="delikaktus-recipes-ingredient-item">
                            <div className='delikaktus-recipes-ingredient-arrows'>
                                {/* Button to move ingredient up in the list */}
                                <button
                                    onClick={() => moveIngredientUp(index)}
                                    className='delikaktus-recipes-ingredient-arrow-up'
                                    aria-label='Move ingredient up'
                                    title='Move ingredient up'
                                >
                                    <IconArrowUp />
                                </button>
                                {/* Button to move ingredient down in the list */}
                                <button
                                    onClick={() => moveIngredientDown(index)}
                                    className='delikaktus-recipes-ingredient-arrow-down'
                                    aria-label='Move ingredient down'
                                    title='Move ingredient down'
                                >
                                    <IconArrowDown />
                                </button>
                            </div>

                            {/* Unit Type */}
                            <select
                                onChange={(e) => handleUnitTypeChange(index, e)}
                                name="Unit Type"
                                value={ingredient.unitType}
                                className="delikaktus-recipes-input-unit-type"
                                aria-label="Select unit type for ingredient"
                                title="Select unit type for ingredient"
                            >
                                <option value={UnitType.EYE} title='By the eye'>👁</option>
                                <option value={UnitType.MASS} title='Mass'>⚖️</option>
                                <option value={UnitType.VOLUME} title='Volume'>💧</option>
                                <option value={UnitType.TOOL} title='Tool'>🥄</option>
                            </select>


                            {/* Quantity */}
                            <input
                                onChange={(e) => handleQuantityChange(index, e)}
                                className='delikaktus-recipes-input-quantity'
                                type="number"
                                label='How much of this ingredient?'
                                name="Quantity"
                                value={ isNaN(ingredient.quantity) ? "" : ingredient.quantity.toString()}
                                aria-label="Enter quantity"
                                min="0"
                                max="999"
                            />
                            <div className='delikaktus-recipes-ingredient-quantity-controllers'>
                                {/* Button to move ingredient up in the list */}
                                <button
                                    onClick={() => increaseIngredientQuantity(index)}
                                    className='delikaktus-recipes-ingredient-quantity-increase'
                                    aria-label='Increase quantity'
                                    title='Increase quantity'
                                >
                                    <IconPlus />
                                </button>
                                {/* Button to move ingredient down in the list */}
                                <button
                                    onClick={() => decreaseIngredientQuantity(index)}
                                    className='delikaktus-recipes-ingredient-quantity-decrease'
                                    aria-label='Decrease quantity'
                                    title='Decrease quantity'
                                >
                                    <IconMinus />
                                </button>
                            </div>

                            {/* Quantity Fraction */}
                            {(ingredient.unitType === "eye" || ingredient.unitType === "tool") && (
                                <select
                                    onChange={(e) => handleQuantityFractionChange(index, e)}
                                    name="Quantity Fraction"
                                    className="delikaktus-recipes-input-quantity-fraction"
                                    value={ isNaN(ingredient.quantityFraction) ? "0" : ingredient.quantityFraction.toString()}
                                    aria-label="Select quantity fraction"
                                    title='Select quantity fraction'
                                >
                                    {fractionOptions.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}                                    
                                </select>
                            )}

                            {/* Unit Choice */}
                            {/* Render <select> in metric or imperial unitSystem if the unitType not "by the eye" or in the single case that unitSystem is "default" and the unitType is "tool" */}
                            {displayUnitChoice && (
                                <select
                                    onChange={(e) => handleIngredientChange(index, 'unitChoice', e.target.value)}
                                    name="Unit Choice"
                                    className="delikaktus-recipes-input-unit-choice"
                                    value={ingredient.unitChoice}
                                    aria-label="Select measurement unit"
                                    title='Select measurement unit'
                                >
                                    {(unitOptions[unitSystem]?.[ingredient.unitType] || []).map((option) => (
                                        <option key={option} value={option}>{getTranslation(option)}</option>
                                    ))}
                                </select>
                            )}

                            {/* Ingredient Name */}
                            <input
                                onChange={(e) => handleNameChange(index, e)}
                                className='delikaktus-recipes-input-ingredient-name'
                                type="text"
                                placeholder='Ingredient name...'
                                value={ingredient.name}
                                aria-label="Enter ingredient name"
                                title='Enter ingredient name'
                            />

                            {/* Button to delete the ingredient item from the list */}
                            <button
                                onClick={() => deleteIngredient(index)}
                                className='delikaktus-recipes-ingredient-delete'
                                aria-label='Delete ingredient'
                                title='Delete ingredient'
                            >
                                <IconDelete />
                            </button>
                        </div>
                    );
                } )}
            </div>

            {/* Button to add a new ingredient item to the list */}
            <button
                onClick={addIngredient}
                className='delikaktus-recipes-ingredient-add'
                aria-label='Add ingredient'
                title='Add ingredient'
                disabled={ingredients.length >= 50} // Disable if already 20 ingredients
            >
                <IconAdd />
            </button>

        </div>
    );
}