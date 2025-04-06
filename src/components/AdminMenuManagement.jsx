import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminMenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState('all');
  const navigate = useNavigate();

  const categories = ['all', 'brunch', 'lunch', 'dinner', 'dessert', 'drinks'];

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin-login');
    } else {
      fetchMenuItems();
    }
  }, [navigate]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/menu-items');
      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch menu items. Please try again later.');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItem({
      name: '',
      desc: '',
      price: '',
      category: 'brunch',
      image: '/api/placeholder/300/200'
    });
    setShowAddModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem({ ...item });
    setShowEditModal(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setShowDeleteConfirmation(true);
  };

  const handleSubmitAdd = async (formData) => {
    try {
      await axios.post('http://localhost:5001/api/menu-items', formData);
      fetchMenuItems();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding menu item:', err);
      alert('Failed to add menu item. Please try again.');
    }
  };

  const handleSubmitEdit = async (formData) => {
    try {
      await axios.put(`http://localhost:5001/api/menu-items/${selectedItem._id}`, formData);
      fetchMenuItems();
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating menu item:', err);
      alert('Failed to update menu item. Please try again.');
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/menu-items/${selectedItem._id}`);
      fetchMenuItems();
      setShowDeleteConfirmation(false);
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert('Failed to delete menu item. Please try again.');
    }
  };

  const filteredItems = filteredCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filteredCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-12 bg-black min-h-screen px-4">
      <div className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-2xl font-bold text-white">Menu Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
          onClick={handleAddItem}
        >
          Add New Item
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md ${
              filteredCategory === category
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setFilteredCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div 
              key={item._id} 
              className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800"
            >
              <div className="h-48 bg-gray-800 relative">
                <img 
                  src={item.image || '/api/placeholder/300/200'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-white">{item.name}</h2>
                <p className="text-gray-400 text-sm mt-1 h-12 overflow-hidden">{item.desc}</p>
                <p className="text-yellow-500 font-bold mt-2">{item.price}</p>
                
                <div className="flex justify-end mt-4 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => handleEditItem(item)}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => handleDeleteItem(item)}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            No menu items found for this category.
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <MenuItemFormModal
          title="Add New Menu Item"
          item={selectedItem}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmitAdd}
        />
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <MenuItemFormModal
          title="Edit Menu Item"
          item={selectedItem}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleSubmitEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                onClick={confirmDelete}
              >
                Delete
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal for adding/editing menu items
const MenuItemFormModal = ({ title, item, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    desc: item?.desc || '',
    price: item?.price || '',
    category: item?.category || 'brunch',
    image: item?.image || '/api/placeholder/300/200'
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(item?.image || '/api/placeholder/300/200');

  const categories = ['brunch', 'lunch', 'dinner', 'dessert', 'drinks'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real application, you would upload this file to a server
    // For this example, we'll just use a placeholder and pretend we uploaded it
    setFormData(prev => ({ ...prev, image: '/api/placeholder/300/200' }));
    
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.desc) newErrors.desc = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 bg-gray-800 border rounded-md text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                rows="3"
                className={`w-full p-2 bg-gray-800 border rounded-md text-white ${
                  errors.desc ? 'border-red-500' : 'border-gray-700'
                }`}
              ></textarea>
              {errors.desc && <p className="text-red-500 text-sm mt-1">{errors.desc}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="₹250"
                className={`w-full p-2 bg-gray-800 border rounded-md text-white ${
                  errors.price ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Image</label>
              <div className="flex items-center gap-4">
                <img
                  src={imagePreview}
                  alt="Food preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                For this example, we're using placeholder images. In a real application, you would upload images to a server.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
            >
              Save
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMenuManagement;