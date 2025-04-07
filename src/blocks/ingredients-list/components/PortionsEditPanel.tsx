import React, { useEffect } from "react";
import "./portionsEditPanel.css";
import { __ } from '@wordpress/i18n';

export default function PortionsEditPanel({ promptText, portionsMode, portions, setPortions }) {
  useEffect(() => {
    // You can also set state here or trigger any other effects needed
  }, [portionsMode]); // This effect will run when portionsMode changes

  // Handle portions change
  const handlePortionsChange = (e) => {
    const newPortions = Number(e.target.value);
    // Ensure the value is a positive number or 0
    if (!isNaN(newPortions) && newPortions > 0) {
      setPortions(newPortions); // Update the attributes to the new portions amount
    } else {
      alert(`A valid amount of portions must be a positive number!
        \ndecimal fractions are acceptable.
        \n\nYou can turn off the Portions Control from the block panel.`);
    }
  };

  return !portionsMode ? null : (
    <div className='delikaktus-recipes-ingredients-list-portions-edit-panel'>
      <span>{promptText || 'For how many portions is this recipe?'}</span>
      <input
        type="number"
        onChange={(e) => handlePortionsChange(e)}
        value={portions}
        min="0"
        max="100"
        className="delikaktus-recipes-ingredients-list-portions-input-amount"
      />
    </div>
  );
}