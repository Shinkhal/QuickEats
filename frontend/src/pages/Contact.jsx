import { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { StoreContext } from '../context/StoreContext';

const QueryForm = () => {
  const { url, token } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    query: "",
    expertise: "Chef",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/submit-query`,
        formData,{
          headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      toast.success(res.data.message);
      setFormData({
        name: "",
        email: "",
        contactNo: "",
        query: "",
        expertise: "Chef",
      });
    } catch (err) {
      toast.error("Error submitting form!",err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-200  text-white mt-10">
      {/* Form Section */}
      <div className="flex flex-grow items-center justify-center p-6">
        <motion.div
          className="bg-gradient-to-br from-gray-900 via-purple-800 to-blue-500 bg-opacity-20 backdrop-blur-lg text-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-center mb-6 text-white">
            Submit Your Food Query 🍽️
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "Name", name: "name", type: "text", placeholder: "Your Name" },
              { label: "Email", name: "email", type: "email", placeholder: "Your Email" },
              { label: "Contact No", name: "contactNo", type: "text", placeholder: "Your Contact Number" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-lg font-medium text-white">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required
                  onChange={handleChange}
                  value={formData[field.name]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none bg-gray-100 text-gray-900"
                />
              </div>
            ))}

            <div>
              <label className="block text-lg font-medium text-white">Your Query</label>
              <textarea
                name="query"
                placeholder="Type your query here..."
                required
                onChange={handleChange}
                value={formData.query}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none bg-gray-100 text-gray-900"
              ></textarea>
            </div>

            <div>
              <label className="block text-lg font-medium text-white">Expertise</label>
              <select
                name="expertise"
                onChange={handleChange}
                value={formData.expertise}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none bg-gray-100 text-gray-900"
              >
                <option value="Chef">Chef</option>
                <option value="Food Safety Expert">Food Safety Expert</option>
                <option value="Food Quality Check">Food Quality Check</option>
              </select>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200 font-semibold text-lg shadow-md"
            >
              Submit Query
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default QueryForm;
