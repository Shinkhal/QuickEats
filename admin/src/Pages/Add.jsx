import { useState } from 'react';
import { Upload, Plus, Package, IndianRupee, FileText, Tag } from 'lucide-react';
import axios from "axios";
import { toast } from 'react-toastify';

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: '',
    price: '',
    description: '',
    category: "Salad"
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data => ({
      ...data,
      [name]: value
    }));
  };

  const onSubmitHandler = async () => {
    // Validate required fields
    if (!data.name || !data.price || !data.description || !image) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('image', image);
    
    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data.success) {
        setData({
          name: '',
          price: '',
          description: '',
          category: "Salad"
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while adding the product');
    }
  };

  const categories = [
    'Salad', 'Rolls', 'Deserts', 'Sandwich', 
    'Cake', 'Pure Veg', 'Pasta', 'Noodles'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Create a new food item for your menu</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-8">
            
            {/* Image Upload Section */}
            <div className="text-center">
              <label htmlFor="image" className="block mb-4">
                <span className="text-sm font-medium text-gray-700 mb-2 block">Product Image</span>
                <div className="relative group cursor-pointer">
                  <div className="w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group-hover:border-blue-400">
                    {image ? (
                      <div className="relative">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt="Preview" 
                          className="w-44 h-44 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Upload Image</p>
                        <p className="text-sm text-gray-400">Click to browse</p>
                      </div>
                    )}
                  </div>
                </div>
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                className="hidden"
                accept="image/*"
                required
              />
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Product Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Product Name
                </label>
                <input
                  onChange={onChangeHandler}
                  value={data.name}
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              {/* Product Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Product Description
                </label>
                <textarea
                  onChange={onChangeHandler}
                  value={data.description}
                  name="description"
                  rows="4"
                  placeholder="Describe your product..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Product Category
                </label>
                <select
                  onChange={onChangeHandler}
                  value={data.category}
                  name="category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IndianRupee className="w-4 h-4 inline mr-2" />
                  Product Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    onChange={onChangeHandler}
                    value={data.price}
                    type="number"
                    name="price"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={onSubmitHandler}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Make sure all information is accurate before submitting
          </p>
        </div>
      </div>
    </div>
  );
};

export default Add;