import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getContents,
  addContent,
  updateContent,
  deleteContent,
  getContentsWithLink,
} from "../actions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./ContentManagement.css";
import Avatar from "react-avatar";
import { motion } from "framer-motion";
import AddFieldModal from "./AddFieldModal";


const ContentManagement = () => {
  const dispatch = useDispatch();
  const { contents, loading, error } = useSelector((state) => state.content);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    contestId: "",
    imageUrl: "",
    isRsaFacing:"",
    order: "",
    route:"",
    visibility:"",
    webviewURL:"",
    type:"",
    knowledgeId:"",
    link:"",
  });
  const [contestData, setContestData] = useState(null);
  const [newField, setNewField] = useState({
    name: "",
    value: ""
  });
  useEffect(() => {
    if (contestData) {
      console.log(contestData);
      setFormData({
        id: contestData.id,
        contestId: contestData.contestId,
        imageUrl: contestData.imageUrl,
        isRsaFacing: contestData.isRsaFacing,
        order: contestData.order,
        route: contestData.route,
        visibility: contestData.visibility,
        webviewURL: contestData.webviewURL,
        type:contestData.type,
        knowledgeId:contestData.knowledgeId,
        link:contestData.link
      });
    }
  }, [contestData]);

  useEffect(() => {
    dispatch(getContents());
  }, [dispatch]);

  const handleCollectionClick = async (contentId) => {
    try {
      const data = await dispatch(getContentsWithLink(contentId));
      localStorage.setItem("currentContent", JSON.stringify(data));
      setContestData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const handleAddField = (fieldName, fieldValue) => {
    setContestData({ ...contestData, [fieldName]: fieldValue });
  };
  // const handleAddField = () => {
  //   const updatedContestData = { ...contestData };
  //   updatedContestData[newField.name] = newField.value;
  //   setContestData(updatedContestData);

  //   setFormData({
  //     ...formData,
  //     [newField.name]: newField.value
  //   });

  //   setNewField({
  //     name: "",
  //     value: ""
  //   });
  // };
  const handleAdd = () => {
    const newContent = {
      contentsId: formData.contestId,
      imageUrl: formData.imageUrl,
      order: contents ? contents.length : 0,
      isRsaFacing: formData.isRsaFacing,
      route: formData.route,
      visibility: formData.visibility,
      webviewURL: formData.webviewURL
    };
    dispatch(addContent(newContent));
    setFormData({
      id: null,
      contestId: "",
      imageUrl: "",
      isRsaFacing:"",
      order: "",
      route:"",
      visibility:"",
      webviewURL:""
    });
  };

  const handleUpdate = () => {
    const updatedContent = {
      contestId: formData.contestId,
      imageUrl: formData.imageUrl,
      order: Number(formData.order),
      isRsaFacing: formData.isRsaFacing,
      route: formData.route,
      visibility: formData.visibility,
      webviewURL: formData.webviewURL
    };
    dispatch(updateContent(updatedContent));
    setFormData({
      id: null,
      contestId: "",
      imageUrl: "",
      isRsaFacing:"",
      order: "",
      route:"",
      visibility:"",
      webviewURL:""
    });
  };

  const handleEditClick = (content) => {
    const keys = Object.keys(content);
    
    const updatedFormData = {};
  
    keys.forEach((key) => {
      updatedFormData[key] = content[key];
    });

    console.log(updatedFormData)
    setFormData(updatedFormData);

  };
  

  const handleBackClick = () => {
    localStorage.removeItem("currentContent");
    setContestData(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteContent(id));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedContents = Array.from(contents);
    const [reorderedItem] = reorderedContents.splice(result.source.index, 1);
    reorderedContents.splice(result.destination.index, 0, reorderedItem);

    dispatch({
      type: "GET_CONTENTS",
      payload: reorderedContents,
    });

    reorderedContents.forEach((content, index) => {
      dispatch(updateContent({ ...content, order: index }));
    });
  };

  const getInputType = (value) => {
    switch (typeof value) {
      case 'string':
        return 'text';
      case 'number':
        return 'number';
      case 'boolean':
        return 'checkbox';
      default:
        return 'text';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!contents || !Array.isArray(contents)) {
    return <div>No contents available.</div>;
  }

  const sortedContents = [...contents].sort((a, b) => a.order - b.order);

  const emptyDocuments = sortedContents.filter((content) => !content.imageUrl && !content.link);

  console.log(contestData);
  if (contestData) {
    return (
      <div className="contest-data">
        <h2>Contest Data</h2>
        {contestData.imageUrl && (
          <img src={contestData.imageUrl} alt="Contest" style={{ maxWidth: '100%' }} />
        )}
        <ul>
          {Object.entries(contestData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {String(value)}
            </li>
          ))}
        </ul>
        <div>
          {/* Add Field button */}
          {/* <button onClick={() => setShowModal(true)}>Add Field</button>
        <AddFieldModal 
          showModal={showModal} 
          onClose={() => setShowModal(false)} 
          onAddField={handleAddField} 
        /> */}
        </div>
        <button onClick={handleBackClick}>Go Back</button>
        <div className="input-section">
          {Object.entries(contestData).map(([key, value]) => (
            <input
              key={key}
              type={getInputType(value)}
              name={key}
              placeholder={key}
              value={typeof value === 'boolean' ? undefined : formData[key] || ""}
              checked={typeof value === 'boolean' ? formData[key] || false : undefined}
              onChange={handleChange}
            />
          ))}
          <button className="update-button" onClick={handleUpdate}>
            Update Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-management">
      <h1 className="title">Content Management</h1>
      <div className="grid_box">
        {emptyDocuments.map((content, index) => (
          <motion.div
            className="content_collections"
            key={index}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleCollectionClick(content.id)}
          >
            <Avatar
              className="avatar"
              name={content.id}
              size="100"
              round={true}
              style={{ backgroundColor: "#333" }}
            />
            <div>
              <p style={{ color: "black", fontFamily: "bold" }}>{content.id}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="input-section">
        {Object.entries(formData).map(([key, value]) => (
          <input
            key={key}
            type={getInputType(value)}
            name={key}
            placeholder={key}
            value={typeof value === 'boolean' ? undefined : formData[key] || ""}
            checked={typeof value === 'boolean' ? formData[key] || false : undefined}
            onChange={handleChange}
          />
        ))}
        {formData.id ? (
          <button className="update-button" onClick={handleUpdate}>
            Update Content
          </button>
        ) : (
          <button className="add-button" onClick={handleAdd}>
            Add Content
          </button>
        )}
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="contents" direction="horizontal">
          {(provided) => (
            <div
              className="contents-grid"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sortedContents.map((content, index) => (
                <Draggable
                  key={content.id}
                  draggableId={content.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="grid-item"
                    >
                      <img src={content.imageUrl} alt={content.link} />
                      <p className="legend">{content.link}</p>
                      <div className="button-group">
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(content)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(content.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ContentManagement;

