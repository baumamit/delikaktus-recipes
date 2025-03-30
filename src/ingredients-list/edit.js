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
import { IoIosArrowUp as IconArrowUp, IoIosArrowDown as IconArrowDown } from "react-icons/io";

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
        [UnitType.VOLUME]: ["pint", "qt"],
        [UnitType.TOOL]: ["cup", "tsp", "Tbsp"],
    },
    [UnitSystem.DEFAULT]: {
        [UnitType.EYE]: [""],
        [UnitType.MASS]: [""],
        [UnitType.VOLUME]: [""],
        [UnitType.TOOL]: ["cup", "tsp", "Tbsp"],
    },
};

// Function to translate terms based on current language
const getTranslation = (text) => {
    const translations = {
        en: {
            cup: "cup",
            tsp: "tsp",
            Tbsp: "Tbsp"
        },
        it: {
            cup: "tazza",
            tsp: "cucchiaino",
            Tbsp: "cucchiaio"
        },
        he: {
            cup: "כוס",
            tsp: "כפית",
            Tbsp: "כף"
        },
    };

    // Function that returns the current language code or english as default
    const currentLanguage = window.delikaktusRecipesData?.currentLanguage;
    return translations[currentLanguage]?.[text] || text;


};

export default function Edit(props) {
    const { attributes, setAttributes } = props;
    // Ensure attributes have default values
    const {
        unitSystem = UnitSystem.DEFAULT,
        ingredients = [],
        portionsMode = false,
        portionsAmount = 1
    } = attributes;

    /* useEffect(() => {
        // You can also set state here or trigger any other effects needed
      }, [attributes]); // This effect will run when portionsMode changes */
    
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
        const defaultQuantity = "1";
        setAttributes({
            ingredients: [
                ...ingredients,
                {
                    unitType: defaultUnitType,
                    quantity: defaultQuantity,
                    quantityFraction: "",
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
        // Update the quantity in the ingredient
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
        <div {...useBlockProps()}>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        id='toolbar-button-unit-system'
                        icon={getUnitSystemIcon()}
                        label={getTranslation(unitSystem.charAt(0).toUpperCase() + unitSystem.slice(1) + ' Units')}
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
                portionsMode={portionsMode}
                portions={portionsAmount}
                setPortions={(newPortionsAmount) => setAttributes({ portionsAmount: newPortionsAmount })}
            />

            <div className="delikaktus-recipes-ingredients-container">
                {/* Render each ingredient to a list */}
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="delikaktus-recipes-ingredient-item">
                        <div className='delikaktus-recipes-ingredient-arrows'>
                            {/* Button to move ingredient up in the list */}
                            <button
                                onClick={() => moveIngredientUp(index)}
                                className='delikaktus-recipes-ingredient-arrow-up'
                                aria-label='Move ingredient up'
                                title={getTranslation('Move ingredient up')}
                            >
                                <IconArrowUp />
                            </button>
                            {/* Button to move ingredient down in the list */}
                            <button
                                onClick={() => moveIngredientDown(index)}
                                className='delikaktus-recipes-ingredient-arrow-down'
                                aria-label='Move ingredient down'
                                title={getTranslation('Move ingredient down')}
                            >
                                <IconArrowDown />
                            </button>
                        </div>

                        {/* Container for the ingredient item inputs */}
                        <div className="delikaktus-recipes-ingredient-inputs">
                            {/* Unit Type */}
                            <select
                                onChange={(e) => handleUnitTypeChange(index, e)}
                                name="Unit Type"
                                value={ingredient.unitType}
                                className="delikaktus-recipes-input-unit-type"
                                aria-label="Select unit type for ingredient"
                                title={getTranslation('Select unit type')}
                            >
                                <option value={UnitType.EYE} title="By the eye">👁</option>
                                <option value={UnitType.MASS} title={getTranslation('Mass')}>⚖️</option>
                                <option value={UnitType.VOLUME} title={getTranslation('Volume')}>💧</option>
                                <option value={UnitType.TOOL} title={getTranslation('Tool')}>🥄</option>
                            </select>

                            {/* Quantity */}
                            <input
                                onChange={(e) => handleQuantityChange(index, e)}
                                className='delikaktus-recipes-input-quantity'
                                type="number"
                                label='How much of this ingredient?'
                                value={ingredient.quantity}
                                aria-label="Enter quantity"
                                min="0"
                            />

                            {/* Quantity Fraction */}
                            {(ingredient.unitType === "eye" || ingredient.unitType === "tool") && (
                                <select
                                    onChange={(e) => handleQuantityFractionChange(index, e)}
                                    name="Quantity Fraction"
                                    className="delikaktus-recipes-input-quantity-fraction"
                                    value={ingredient.quantityFraction}
                                    aria-label="Select quantity fraction"
                                    title={getTranslation('Select quantity fraction')}
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
                            )}

                            {/* Unit Choice */}
                            {/* Render <select> in metric or imperial unitSystem if the unitType not "by the eye" or in the single case that unitSystem is "default" and the unitType is "tool" */}
                            { 
                                ( ((unitSystem !== UnitSystem.DEFAULT) && (ingredient.unitType !== UnitType.EYE)) ||
                                    (unitSystem === UnitSystem.DEFAULT && ingredient.unitType === UnitType.TOOL) )
                                && (
                                <select
                                    onChange={(e) => handleIngredientChange(index, 'unitChoice', e.target.value)}
                                    name="Unit Choice"
                                    className="delikaktus-recipes-input-unit-choice"
                                    value={ingredient.unitChoice}
                                    aria-label="Select measurement unit"
                                    title={getTranslation('Select measurement unit')}
                                >
                                    {(unitOptions[unitSystem]?.[ingredient.unitType] || []).map((option, i) => (
                                        <option key={i} value={option}>{getTranslation(option)}</option>
                                    ))}
                                </select>
                            )}

                            {/* Ingredient Name */}
                            <input
                                onChange={(e) => handleNameChange(index, e)}
                                className='delikaktus-recipes-input-ingredient-name'
                                type="text"
                                placeholder={getTranslation('Ingredient name...')}
                                value={ingredient.name}
                                aria-label="Enter ingredient name"
                                title={getTranslation('Enter ingredient name')}
                            />
                        </div>

                        {/* Button to delete the ingredient item from the list */}
                        <button
                            onClick={() => deleteIngredient(index)}
                            className='delikaktus-recipes-ingredient-delete'
                            aria-label='Delete ingredient'
                            title={getTranslation('Delete ingredient')}
                        >
                            <IconDelete />
                        </button>
                    </div>
                ))}
            </div>

            {/* Button to add a new ingredient item to the list */}
            <button
                onClick={addIngredient}
                className='delikaktus-recipes-ingredient-add'
                aria-label='Add ingredient'
                title={getTranslation('Add ingredient')}
                disabled={ingredients.length >= 200} // Disable if already 20 ingredients
            >
                <IconAdd />
            </button>

        </div>
    );
}