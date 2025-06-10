import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-10 px-6 md:px-16" id="footer">
      <div className="flex flex-col md:flex-row justify-between gap-10 mb-6">
        
        {/* Left Section */}
        <div className="md:w-1/3">
          <p className="text-sm text-gray-300 mb-4">
            QuickEats is your go-to platform for ordering delicious meals from local restaurants. 
            Fast delivery, real-time tracking, and a seamless ordering experience — all in one place.
          </p>
          <div className="flex gap-4 mt-2">
            <img className="w-6 h-6 cursor-pointer" src={assets.facebook_icon} alt="Facebook" />
            <img className="w-6 h-6 cursor-pointer" src={assets.twitter_icon} alt="Twitter" />
            <img className="w-6 h-6 cursor-pointer" src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        {/* Center Section */}
        <div className="md:w-1/3">
          <h2 className="text-lg font-semibold mb-3">COMPANY</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="cursor-pointer hover:text-white">Home</li>
            <li className="cursor-pointer hover:text-white">About Us</li>
            <li className="cursor-pointer hover:text-white">Restaurants</li>
            <li className="cursor-pointer hover:text-white">Privacy Policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="md:w-1/3">
          <h2 className="text-lg font-semibold mb-3">GET IN TOUCH</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>+31-485-485-584</li>
            <li>support@QuickEats.com</li>
          </ul>
        </div>
      </div>

      <hr className="border-gray-700 my-6" />
      
      <p className="text-center text-sm text-gray-400">
        © 2025 QuickEats.com - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
