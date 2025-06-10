import { menu_list } from "../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="py-10 px-4 md:px-16" id="explore-menu">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Explore our menu</h1>
      <p className="text-center text-gray-600 max-w-xl mx-auto mb-8">
        Choose from a diverse menu featuring a delectable array of dishes.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {menu_list.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name))
            }
            className="cursor-pointer flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <img
              src={item.menu_image}
              alt={item.menu_name}
              className={`w-24 h-24 rounded-full border-4 ${
                category === item.menu_name ? "border-yellow-500" : "border-transparent"
              }`}
            />
            <p className="text-sm md:text-base font-medium text-gray-800">{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr className="mt-10 border-t border-gray-300" />
    </div>
  );
};

export default ExploreMenu;
