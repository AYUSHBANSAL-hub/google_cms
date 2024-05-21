import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContents, addContent, updateContent, deleteContent } from '../actions';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import './ContentManagement.css'; 

const ContentManagement = () => {
  const dispatch = useDispatch();
  const { contents, loading } = useSelector(state => state.content);

  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState('');
  const [route, setRoute] = useState('');

  useEffect(() => {
    dispatch(getContents());
  }, [dispatch]);

  const handleAdd = () => {
    const newContent = { imageUrl, link, order: Number(order), route };
    dispatch(addContent(newContent));
    setImageUrl('');
    setLink('');
    setOrder('');
    setRoute('');
  };

  const handleUpdate = id => {
    const updatedContent = { imageUrl, link, order: Number(order), route };
    dispatch(updateContent(id, updatedContent));
    setImageUrl('');
    setLink('');
    setOrder('');
    setRoute('');
  };
  

  const handleDelete = id => {
    dispatch(deleteContent(id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-management">
      <h1 className="title">Content Management</h1>
      <div className="input-section">
        <input 
          type="text" 
          placeholder="Image URL" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Link" 
          value={link} 
          onChange={(e) => setLink(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Order" 
          value={order} 
          onChange={(e) => setOrder(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Route" 
          value={route} 
          onChange={(e) => setRoute(e.target.value)} 
        />
        <button onClick={handleAdd}>Add Content</button>
      </div>
      
      <Carousel className="carousel">
        {contents.map(content => (
          <div key={content.id} className="carousel-item">
            <img src={content.imageUrl} alt={content.link} />
            <p className="legend">{content.link}</p>
            <div className="button-group">
              <button onClick={() => handleUpdate(content.id)}>Update</button>
              <button onClick={() => handleDelete(content.id)}>Delete</button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ContentManagement;
