import React, { useState } from "react";

const AddFieldModal = ({ showModal, onClose, onAddField }) => {
  const [fieldName, setFieldName] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleAddField = () => {
    onAddField(fieldName, fieldValue);
    setFieldName("");
    setFieldValue("");
  };

  return (
    <div className={`modal ${showModal ? 'show' : 'hide'}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add Field</h2>
        <div>
          <label>Field Name:</label>
          <input type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
        </div>
        <div>
          <label>Field Value:</label>
          <input type="text" value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} />
        </div>
        <button onClick={handleAddField}>Add Field</button>
      </div>
    </div>
  );
};

export default AddFieldModal;
