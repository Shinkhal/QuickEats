import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Header from "../components/Header";
import ExploreMenu from "../components/ExploreMenu";
import AppDownload from "../components/AppDownload";
import { assets } from "../assets/assets";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const mockTestimonials = [
      {
        id: 1,
        name: "Riya Sharma",
        role: "Food Blogger",
        image: assets.user1,
        comment: "QuickEats has transformed how I order food. The app is intuitive and the delivery is always on time!",
        rating: 5,
      },
      {
        id: 2,
        name: "Rahul Kapoor",
        role: "Tech Professional",
        image: assets.user2,
        comment: "I can always count on QuickEats for quality meals delivered quickly. Their variety is impressive!",
        rating: 4,
      },
      {
        id: 3,
        name: "Neha Gupta",
        role: "Marketing Manager",
        image: assets.user3,
        comment: "The food quality is consistently excellent, and the delivery personnel are always professional.",
        rating: 5,
      },
    ];

    setTimeout(() => {
      setTestimonials(mockTestimonials);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("WELCOME50");
    toast.success("Copied to clipboard!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <Header />

      {/* How It Works Section */}
      {/* ... same as before ... */}

      <section className="container mx-auto px-4 py-6">
        <ExploreMenu category={category} setCategory={setCategory} />
      </section>

      {/* Special Offers */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-100 to-yellow-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Offers</h2>
              <p className="text-gray-700 mb-6">
                Get 50% off on your first order when you download our app. Limited time offer!
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-yellow-500 font-bold mr-2">WELCOME50</span>
                  <button
                    className="text-xs text-gray-600 border-l pl-2 hover:text-gray-900"
                    onClick={handleCopyCode}
                  >
                    Copy Code
                  </button>
                </div>
                <button
                  onClick={() => navigate("/menu")}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition"
                >
                  Order Now
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src={assets.special_offer}
                alt="Special Offer"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials with Skeleton Loader */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">&quot;{testimonial.comment}&quot;</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500" : "text-gray-300"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-yellow-500 mb-2">50+</h3>
              <p className="text-gray-300">Branches</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-yellow-500 mb-2">100+</h3>
              <p className="text-gray-300">Menu Items</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-yellow-500 mb-2">1k+</h3>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-yellow-500 mb-2">30min</h3>
              <p className="text-gray-300">Average Delivery</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6">
        <AppDownload />
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for updates on new dishes, offers, and more!
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-l-full rounded-r-full sm:rounded-r-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button className="bg-yellow-500 text-white px-6 py-2 rounded-l-full rounded-r-full sm:rounded-l-none hover:bg-yellow-600 transition">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            By subscribing, you agree to our Privacy Policy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
