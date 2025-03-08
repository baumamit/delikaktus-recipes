/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

import { FaWeight, FaBitbucket, FaUtensilSpoon } from "react-icons/fa";
/* import React from "react"; */

export default function RecipeIngredient (props) {
	/* const { attributes, setAttributes } = props; */

    const handleUnitSystemChange = (e) => {
        props.setAttributes({unitSystem: e.target.value});
    }

    const handleQuantityChange = (e) => {
        props.setAttributes({ingredientQuantity: e.target.value});
    }

    const renderUnitChoice = () => {
        switch (props.attributes.unitSystem) {
            case 'metric':
                return (
                    <select 
                        onChange={handleUnitChoiceChange} 
                        name="Unit Choice" 
                        id="recipe-input-unit-choice" 
                        className='recipe-input-unit-choice'
                    >
                        <option 
                            className='recipe-input-unit-choice-option' 
                            value="" 
                            selected={props.attributes.ingredientUnitChoice}
                            disabled
                        >Add units
                        </option>

                        <option 
                            className='recipe-input-unit-choice-option' 
                            value='g' 
                            selected={props.attributes.ingredientUnitChoice == 'g'}
                        >g
                        </option>

                        <option 
                            className='recipe-input-unit-choice-option' 
                            value="kg" 
                            selected={props.attributes.ingredientUnitChoice == 'kg'}
                        >kg
                        </option>

                        <option 
                            className='recipe-input-unit-choice-option' 
                            value="ml" 
                            selected={props.attributes.ingredientUnitChoice == 'ml'}
                        >ml
                        </option>

                        <option 
                            className='recipe-input-unit-choice-option' 
                            value="L" 
                            selected={props.attributes.ingredientUnitChoice == 'L'}
                        >L
                        </option>

                        <option 
                            className='recipe-input-unit-choice-option' 
                            value="cup" 
                            selected={props.attributes.ingredientUnitChoice == 'cup'}
                        >cup
                        </option>

                        <option 
                            className='recipe-input-unit-choice-option' 
                            value="tsp" 
                            selected={props.attributes.ingredientUnitChoice == 'tsp'}
                        >tsp
                        </option>

                        <option 
                            className='recipe-input-unit-choice-option' 
                            value="Tbsp" 
                            selected={props.attributes.ingredientUnitChoice == 'Tbsp'}
                        >Tbsp
                        </option>

                    </select>
                );
            default:
                return null;
        }
    };

    const handleUnitChoiceChange = (e) => {
        props.setAttributes({ingredientUnitChoice: e.target.value});
    }

    const handleNameChange = (e) => {
        props.setAttributes({ingredientName: e.target.value});
    }

    return (
        <div { ...useBlockProps() }>
            RecipeIngredient
            <div className="ingredient-inputs-controllers">
				<select 
					onChange={handleUnitSystemChange} 
					name="Unit System" 
					id="recipe-input-unit-system" 
					className='recipe-input-unit-system' 
				>
					<option 
						className='recipe-input-unit-system-option' 
						disabled 
						value="" 
						selected={props.attributes.unitSystem}
					>Add units</option>
					<option 
						className='recipe-input-unit-system-option' 
						value="text" 
						selected={props.attributes.unitSystem == 'text'}
					>Free text</option>
					<option 
						className='recipe-input-unit-system-option' 
						value="metric" 
						selected={props.attributes.unitSystem == 'metric'}
					>Metric</option>
					<option 
						className='recipe-input-unit-system-option' 
						value="imperial" 
						selected={props.attributes.unitSystem == 'imperial'}
					>Imperial</option>
				</select>
			</div>
	
			<div className="ingredient-inputs-container">
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
        </div>
    )
}