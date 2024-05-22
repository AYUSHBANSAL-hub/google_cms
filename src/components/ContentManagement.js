import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getContents,
  addContent,
  updateContent,
  deleteContent,
  setContentsNULL,
  getContentsWithLink,
} from "../actions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./ContentManagement.css";
import Avatar from "react-avatar";
import {motion} from "framer-motion";

const ContentManagement = () => {
  const dispatch = useDispatch();
  const { contents, loading } = useSelector((state) => state.content);
  const [path,setPath] = useState(["your-collection"])
  console.log(path)
  const [formData, setFormData] = useState({
    id: null,
    imageUrl: "",
    link: "",
    order: "",
    route: "",
  });

  useEffect(() => {
    dispatch(getContents())
    // dispatch(getContentsWithLink(path))
  }, [dispatch]);

  const HandleCollectionClick = (contentId) =>{
    setPath([...path, contentId])
    dispatch(setContentsNULL())
    dispatch(getContentsWithLink(path))
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {
    const newContent = {
      imageUrl: formData.imageUrl,
      link: formData.link,
      order: contents.length,
      route: formData.route,
    };
    dispatch(addContent(newContent));
    setFormData({ id: null, imageUrl: "", link: "", order: "", route: "" });
  };

  const handleUpdate = () => {
    const updatedContent = {
      imageUrl: formData.imageUrl,
      link: formData.link,
      order: Number(formData.order),
      route: formData.route,
    };
    dispatch(updateContent(formData.id, updatedContent));
    setFormData({ id: null, imageUrl: "", link: "", order: "", route: "" });
  };

  const handleEditClick = (content) => {
    setFormData({
      id: content.id,
      imageUrl: content.imageUrl,
      link: content.link,
      order: content.order,
      route: content.route,
    });
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
      dispatch(updateContent(content.id, { ...content, order: index }));
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const sortedContents = [...contents].sort((a, b) => a.order - b.order);

  return (
    <div className="content-management">
      <h1 className="title">Content Management</h1>
      <div className="grid_box">
        {contents?.map((content, index) => (
          <motion.div
            className="content_collections"
            key={index}
            whileHover={{ scale: 1.05 }}
            onClick={()=>HandleCollectionClick(content.id)}
          >
            {/* Display project thumbnail */}
            <Avatar
              className="avatar"
              name={content.id}
              size="100" // Adjust size as needed
              round={true} // Make it round
              style={{ backgroundColor: "#333" }} // Background color
            />
            <div >
              <p style={{color:"black", fontFamily:"bold"}}>{content.id}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="input-section">
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <input
          type="text"
          name="link"
          placeholder="Link"
          value={formData.link}
          onChange={handleChange}
        />
        <input
          type="number"
          name="order"
          placeholder="Order"
          value={formData.order}
          onChange={handleChange}
        />
        <input
          type="text"
          name="route"
          placeholder="Route"
          value={formData.route}
          onChange={handleChange}
        />
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
