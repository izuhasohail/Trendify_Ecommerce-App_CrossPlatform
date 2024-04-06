import React, { useEffect, useState } from "react";
import "./ProductPage.css";
import Navbar from "../../components/Navbar/Navbar";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import ProductCard from "../../components/productCard/ProductCard";
import Footer from "../../components/Footer/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getCartItems } from "../../cartService";
import { useDispatch } from "react-redux";
import { setPageState } from "../../slices/PageSlice";

const ProductPage = () => {
  const { category: initialCategory } = useParams();
  const [category, setCategory] = useState(initialCategory);
  const dispatch = useDispatch();
  dispatch(setPageState("/Products/all"));
  
  console.log(`params is `, category);

  const [searchInput, setSearchInput] = useState("");
  const [filteredByName, setFilteredByName] = useState([]);

  const [products, setProducts] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [selectedPieceOption, setSelectedPieceOption] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          ` http://localhost:4000/api/products/filter?category=${category}`
        ); // Change the limit as needed
        console.log("category products from db: ", response.data);
        // console.log(response.data)
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  const handleCategory = async (cat) => {
    // setCategory(cat);
    try {
      // Fetch products based on the new category
      const response = await axios.get(
        `  http://localhost:4000/api/products/filter?category=${cat}`
      );
      setProducts(response.data);
      setFilteredProducts([]); // Reset filtered products
      setSelectedSortOption(""); // Reset selected sort option
      setSelectedPieceOption(""); // Reset selected piece option
      setCategory(cat); // Update the category state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSort = (property, order) => {
    setSearchInput("");
    console.log("handle sort called");
    console.log(`property is ${property} and order is ${order}`);
    // let sortedProducts = [...products];
    let sortedProducts =
      filteredProducts.length > 0 ? [...filteredProducts] : [...products];

    // Clone the products array
    // let sortedProducts = [...filteredByName.length > 0 ? filteredByName : products];

    if (order === "LH") {
      sortedProducts.sort((a, b) => a[property] - b[property]);
    } else {
      sortedProducts.sort((a, b) => b[property] - a[property]);
    }

    // setFilteredProducts(sortedProducts);
    setProducts(sortedProducts);

    setSelectedSortOption(`${property}${order}`);
  };

  const handlePiece = (pieceValue) => {
    // let newFilteredProducts = [...products];

    // if (pieceValue !== "") {
    //   newFilteredProducts = products.filter(
    //     (product) => product.piece === parseInt(pieceValue)
    //   );
    // }

    // setFilteredProducts(newFilteredProducts);
    // setSelectedPieceOption(pieceValue);

    setSearchInput("");

    let newFilteredProducts = [...products];

    if (pieceValue !== "") {
      newFilteredProducts = newFilteredProducts.filter(
        (product) => product.piece === parseInt(pieceValue)
      );
    }

    setFilteredProducts(newFilteredProducts);
    setSelectedPieceOption(pieceValue);
  };

  const handleViewAll = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/products/`); // Change the limit as needed
      console.log("category products: ", response.data);
      // console.log(response.data)

      setSearchInput("");

      setProducts(response.data);
      setFilteredProducts([]);
      setSelectedSortOption("");
      setSelectedPieceOption("");
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // const handleSearch = (e) => {
  //   const input = e.target.value;
  //   setSearchInput(input);

  //   // Filter products based on the input string
  //   const filteredByName = products.filter((product) =>
  //     product.productName.toLowerCase().includes(input.toLowerCase())
  //   );

  //   setFilteredProducts(filteredByName);
  // };

  const handleSearch = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    // Filter products based on the input string
    const filteredProducts = products.filter((product) =>
      product.productName.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredByName(filteredProducts);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1024, min: 900 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 900, min: 600 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  const filteredProductsToDisplay = searchInput
    ? filteredByName
    : selectedPieceOption
    ? filteredProducts
    : products;

  return (
    <>
      <Navbar />
      <div className="product-page">
        <div className="pp-main">
          <div className="pp-catgeory-options">
            <Carousel
              responsive={responsive}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
              autoPlay={true}
              autoPlaySpeed={2000}
            >
              <div className="pp-option">
                <div className="pp-ct-link">
                  <Link onClick={() => handleCategory("Stitched")}>
                    Stitched
                  </Link>
                </div>
              </div>

              <div className="pp-option">
                <div className="pp-ct-link">
                  <Link onClick={() => handleCategory("Unstitched")}>
                    Unstitched
                  </Link>
                </div>
              </div>

              <div className="pp-option">
                <div className="pp-ct-link">
                  <Link onClick={() => handleCategory("Women")}>Women</Link>
                </div>
              </div>

              <div className="pp-option">
                <div className="pp-ct-link">
                  <Link onClick={() => handleCategory("Men")}>Men</Link>
                </div>
              </div>

              <div className="pp-option">
                <div className="pp-ct-link">
                  <Link onClick={() => handleCategory("Kids")}>Kids</Link>
                </div>
              </div>
            </Carousel>
          </div>

          <form className="search-btn-div-pp">
            <input
              type="text"
              name="search"
              placeholder="Search...."
              value={searchInput}
              onChange={handleSearch}
            />
          </form>

          <div className="p-sorting">
            <div className="sort-options">
              <select
                id="sortOptions"
                value={selectedSortOption}
                onChange={(e) =>
                  handleSort(
                    e.target.value.substring(0, e.target.value.length - 2),
                    e.target.value.slice(-2)
                  )
                }
                className="custom-select"
              >
                <option value="">Price</option>
                <option value="priceLH">Low to High</option>
                <option value="priceHL">High to Low</option>
                {/* <option value="ratingLH">Rating Low to High</option>
                <option value="ratingHL">Rating High to Low</option> */}
              </select>

              <select
                id="pieceOptions"
                value={selectedPieceOption}
                onChange={(e) => handlePiece(e.target.value)}
                className="custom-select select2"
              >
                <option value="">Piece</option>
                <option value="3">3 piece</option>
                <option value="2">2 piece</option>
                <option value="1">1 piece</option>
                {/* <option value="ratingLH">Rating Low to High</option>
                <option value="ratingHL">Rating High to Low</option> */}
              </select>
            </div>

            <div className="view-all">
              <p onClick={handleViewAll}>View all</p>
            </div>
          </div>

          <div className="products-display-div">
            {/* {filteredProducts.length > 0
              ? filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    _id={product._id}
                    imgUrl={../${product.images[0]}}
                    name={product.productName}
                    price={product.price}
                    piece={product.piece}
                    fabric={product.fabric}
                  />
                ))
              : products.map((product) => (
                  <ProductCard
                    key={product._id}
                    _id={product._id}
                    imgUrl={../${product.images[0]}}
                    name={product.productName}
                    price={product.price}
                    piece={product.piece}
                    fabric={product.fabric}
                  />
                ))} */}

            {/* {searchInput
          ? filteredByName.map((product) => (
              <ProductCard
                key={product._id}
                _id={product._id}
                imgUrl={../${product.images[0]}}
                name={product.productName}
                price={product.price}
                piece={product.piece}
                fabric={product.fabric}
              />
            ))
          : products.map((product) => (
              <ProductCard
                key={product._id}
                _id={product._id}
                imgUrl={../${product.images[0]}}
                name={product.productName}
                price={product.price}
                piece={product.piece}
                fabric={product.fabric}
              />
            ))} */}

            {filteredProductsToDisplay.map((product) => (
              <ProductCard
                key={product._id}
                _id={product._id}
                imgUrl={`../${product.images[0]}`}
                name={product.productName}
                price={product.price}
                piece={product.piece}
                fabric={product.fabric}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;
