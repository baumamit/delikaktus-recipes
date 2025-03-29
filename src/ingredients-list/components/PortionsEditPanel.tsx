import React, { useEffect } from "react";
import "./portionsEditPanel.css";

export default function PortionsEditPanel({ portionsMode, portions, setPortions }) {
  useEffect(() => {
    // You can also set state here or trigger any other effects needed
  }, [portionsMode]); // This effect will run when portionsMode changes

  // Handle portions change
  const handlePortionsChange = (e) => {
    console.log('portions before change =', portions);

    const newPortions = Number(e.target.value);
    console.log('newPortions =', newPortions);
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
      <span>For how many portions is this recipe?</span>
      <input
        type="number"
        onChange={(e) => handlePortionsChange(e)}
        value={portions}
        className="delikaktus-recipes-ingredients-list-portions-input-amount"
      />
    </div>
  );
}