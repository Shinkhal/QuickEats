import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[90vh] bg-cover bg-center bg-[url('/header_img2.png')] flex items-center justify-center text-white relative">
      <div className="bg-black/60 p-8 rounded-lg max-w-xl text-center">
        <h2 className="text-4xl font-bold mb-4">Savor the Speed of Flavor!</h2>
        <p className="mb-6 text-lg">
          From savory to sweet, our offerings cater to every palate. Experience culinary excellence with every bite, prepared with care and expertise.
        </p>
        <button
          onClick={() => navigate("/menu")}
          className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition"
        >
          View Menu
        </button>
      </div>
    </div>
  );
};

export default Header;
