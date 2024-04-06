import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./ProductForm.css";
import AlertBox from "../../../components/AlertBox/AlertBox";

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [expense, setExpense] = useState("");
  const [files, setFiles] = useState([]);
  const [isStitched, setIsStitched] = useState(false);
  const [piece, setPiece] = useState(1);
  const [fabric, setFabric] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertMessage, setAlertMessage] = useState("");

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const upload = () => {
    if (files.length > 4 || files.length < 2) {
      setAlertMessage("Maximum 4 and Minimum 2 Images Allowed");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    let type = false;
    files.forEach((file) => {
      let name = file.name.split(".");
      console.log(
        "Image Name ",
        file.name,
        " Extension",
        name[name.length - 1]
      );
      if (
        name[name.length - 1] == "jpg" ||
        name[name.length - 1] == "jpeg" ||
        name[name.length - 1] == "png"
      ) {
        console.log("Image has correct extension")
      } else {
        setAlertMessage("Only Images Are Allowed As Input Files");
        setAlertType("error");
        setShowAlert(true);
        type = true;
      }
    });
    if (type) return;

    const images = [];
    for (let i = 0; i < files.length; i++) {
      images.push(files[i].name);
    }
    console.log(images);

    const itemData = {
      productName: productName,
      description: productDescription,
      stock: stock,
      price: price,
      expense: expense,
      isStitched: isStitched.toString(),
      category: category,
      images: images,
      piece: piece,
      fabric: fabric,
    };

    const formData = new FormData();

    Object.keys(itemData).forEach((key) => {
      formData.append(key, itemData[key]);
    });

    files.forEach((file) => {
      const fileName = file.name;
      formData.append("files", file, fileName);
    });

    // console.log(formData);

    axios
      .post("http://localhost:4001/api/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);

        // Clear form fields and files after successful request
        setProductName("");
        setProductDescription("");
        setCategory("Men");
        setStock("");
        setPrice("");
        setFiles([]);
        setIsStitched(false);
        setExpense("");
        setFabric("");
        setPiece(1);

        // Display success alert
        setAlertMessage("New product created succefully");
        setAlertType("success");
        setShowAlert(true);
      })
      .catch((err) => {
        // Handle error
        setAlertMessage("Failed to create product");
        setAlertType("error");
        setShowAlert(true);
        console.error(err);
      });
  };

  return (
    <div className="item11 product-form-container" id="new-section">
      <h2>Add New Product</h2>
      <form className="product-form">
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="productDescription">Product Description:</label>
          <textarea
            id="productDescription"
            className="form-control"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense">Manufacturing Price:</label>
          <input
            type="number"
            id="expense"
            className="form-control"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="isStitched">Is Stitched:</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="isStitched"
              checked={isStitched}
              onChange={(e) => setIsStitched(e.target.checked)}
            />
            <label htmlFor="isStitched" className="checkbox-label">
              {isStitched ? "Stitched" : "Not Stitched"}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="piece">Piece:</label>
          <input
            type="number"
            id="piece"
            className="form-control"
            value={piece}
            onChange={(e) => setPiece(Math.min(3, Math.max(1, e.target.value)))}
            min={1}
            max={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fabric">Fabric:</label>
          <input
            type="text"
            id="fabric"
            className="form-control"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
          >
            <input {...getInputProps()} />
            {files.length > 0 ? (
              <div>
                <p>Selected files:</p>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview-${index}`}
                        className="preview-image"
                      />
                      {files.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Drag & drop files here, or click to select files</p>
            )}
          </div>
        </div>

        <button type="button" onClick={upload} className="submit-button">
          Add New Product
        </button>
      </form>
      {showAlert && (
        <AlertBox
          message={alertMessage}
          type={alertType}
          onClose={() => {
            setShowAlert(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductForm;
