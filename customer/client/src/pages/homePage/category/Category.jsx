import "./Category.css";
import React from "react";
import CategoryCard from '../../../components/CategoryCard/CategoryCard'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import kid from '../../../assets/pics/kid4.png'
import unst1 from '../../../assets/pics/image_48.jpeg'
import unst2 from '../../../assets/pics/image_54.jpeg'
import men1 from '../../../assets/pics/image_18.jpeg'
import stch2 from '../../../assets/pics/stitched2.jpg'
const Category = () => {


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

  const cardsData = [
    {
      id: 1,
      imgUrl:unst1,
      name: "Unstitched",
    },
    {
      id: 3,
      imgUrl: stch2,
      name: "Stitched",
    },
    {
      id: 4,
      imgUrl: men1,
      name: "Men",
    },
    {
      id: 5,
      imgUrl: unst2,
      name: "Women",
    },
    {
      id: 6,
      imgUrl: kid,
      name: "Kids",
    },
    
  ];

  const card = cardsData.map((item) => (
    <CategoryCard imgUrl={item.imgUrl} name={item.name} key={item.id} />
  ));

  return (
    <div className="ct-main_div">
      <h1 className='ct-heading'>shopby<span>category</span></h1>

      <div className="ct-category-container">
        <Carousel className="c-carousel"
          responsive={responsive}
          showDots={true}
          autoPlay={true}
          autoPlaySpeed={1500}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-20-px"
        >
          {card}
        </Carousel>
      </div>
    </div>
  );
};

export default Category;
