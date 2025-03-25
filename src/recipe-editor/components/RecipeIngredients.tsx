import React, { useState } from "react";

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

const RecipeIngredients: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now(),
      name: "",
      quantity: "",
      unit: "",
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const updateIngredient = (id: number, field: keyof Ingredient, value: string) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const removeIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
  };

  return (
    <div>
      <h2>Recipe Ingredients</h2>
      <button id="recipe-ingredient-create" onClick={addIngredient}>
        Add Ingredient
      </button>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            <input
              type="text"
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => updateIngredient(ingredient.id, "quantity", e.target.value)}
            />
            <select
              value={ingredient.unit}
              onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
            >
              <option value="">Select unit</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
            </select>
            <button id="recipe-ingredient-delete" onClick={() => removeIngredient(ingredient.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeIngredients;
