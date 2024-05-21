import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContents, addContent, updateContent, deleteContent } from '../actions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './ContentManagement.css';

const ContentManagement = () => {
  const dispatch = useDispatch();
  const { contents, loading } = useSelector(state => state.content);

  const [formData, setFormData] = useState({
    imageUrl: '',
    link: '',
    order: '',
    route: ''
  });

  useEffect(() => {
    dispatch(getContents());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdd = () => {
    const newContent = {
      imageUrl: formData.imageUrl,
      link: formData.link,
      order: contents.length, 
      route: formData.route
    };
    dispatch(addContent(newContent));
    setFormData({ imageUrl: '', link: '', order: '', route: '' });
  };

  const handleUpdate = (id) => {
    const updatedContent = {
      imageUrl: formData.imageUrl,
      link: formData.link,
      order: Number(formData.order),
      route: formData.route
    };
    dispatch(updateContent(id, updatedContent));
    setFormData({ imageUrl: '', link: '', order: '', route: '' });
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
      type: 'GET_CONTENTS',
      payload: reorderedContents
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
        <button className="add-button" onClick={handleAdd}>Add Content</button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="contents" direction="horizontal">
          {(provided) => (
            <div className="contents-grid" {...provided.droppableProps} ref={provided.innerRef}>
              {sortedContents.map((content, index) => (
                <Draggable key={content.id} draggableId={content.id} index={index}>
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
                        <button className="update-button" onClick={() => handleUpdate(content.id)}>Update</button>
                        <button className="delete-button" onClick={() => handleDelete(content.id)}>Delete</button>
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

