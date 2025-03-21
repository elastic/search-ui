import Navigation from "./components/Navigation";

const categoryItems = {
  "Video Games": {
    Games: true,
    "Video Game Accessories": true,
    "Nintendo Wii": true,
    "Sony Playstation": true,
    "All Video Games": true,
    "Microsoft Xbox": true
  },
  "Cell Phones": {
    "Cell Phone Accessories": true,
    "All Cell Phones": true,
    "Prepaid Phones & Plans": true
  },
  "Computers & Tablets": {
    "Computer Accessories": true,
    "Computer Components": true,
    Tablets: true,
    "Surge Protectors & Power": true,
    Monitors: true,
    Software: true,
    "Wi-Fi & Networking": true,
    "Tablet Accessories": true,
    Laptops: true
  },
  "TV & Home Theater": {
    "Home Theater Accessories": true,
    "Home Theater Audio & Video": true,
    TVs: true,
    "": true,
    "Blu-ray & DVD Players": true
  },
  Appliances: {
    "Major Kitchen Appliances": true,
    "Washers & Dryers": true
  },
  "Wearable Technology": {
    Headphones: true
  },
  Audio: {
    Headphones: true,
    "Home Audio": true,
    "Audio Accessories": true,
    "iPod & MP3 Players": true
  },
  "Home, Furniture & Office": {
    "Home Security & Monitoring": true
  },
  "Car Electronics & GPS": {
    "Car Security & Convenience": true,
    "Car Audio": true,
    "Installation Parts & Accessories": true,
    "GPS Navigation": true
  },
  "Cameras, Camcorders & Drones": {
    Cameras: true,
    Camcorders: true
  },
  "Movies & Music": {
    "": true
  }
};

export default () => {
  return (
    <>
      <Navigation />
      <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-4 grid-cols-2">
        {Object.keys(categoryItems).map((category) => (
          <div className="flex flex-col mb-5">
            <h3 className="text-l leading-8 font-semibold text-slate-700">
              {category}
            </h3>
            <div className="flex flex-col">
              {Object.keys(categoryItems[category]).map((subcategory) => (
                <a
                  href={`/ecommerce/category/${subcategory}`}
                  className="text-sm leading-5 text-slate-700 hover:text-blue-600 mb-1"
                >
                  {subcategory}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
