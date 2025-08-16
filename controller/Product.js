const Product = require('../models/product');

const uploadProduct = async(req, res)=>{
    try{

        const {productName, price, sellingPrice, brandName, description, category, productImage } = req.body;

        if(!productName || !price || !sellingPrice || !brandName || !description || !category){
            return res.status(403).json({
                success:false,
                message:"All fields are mandatory"
            })
        }

        const uploadData = await Product.create({
            productName:productName,
            brandName:brandName,
            productImage:productImage,
            description:description,
            price:price,
            sellingPrice:sellingPrice,
            category:category,
        })


        const uploadedData = await uploadData.save();

        return res.status(200).json({
            success:true,
            message:"Product Upload Successfully",
            data:uploadedData,
        })

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    }
};


const getProducts = async (req, res) => {
  try {
    const allProducts = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All product data fetched",
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(403).json({ success: false, message: "Permission denied" });
    }

    const { productId } = req.params;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const getCategoryProduct = async (req, res) => {
  try {
     
    const productCategory = await Product.distinct("category");
    
    const productByCategory = [];
    
    for(const category of productCategory){
      const product = await Product.findOne({category});
      
      if(product){
        productByCategory.push(product);
      }
    }

    return res.status(200).json({
       success:true,
       data:productByCategory,
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getSingleCategoryProduct = async (req, res) => {
  try {
    const category =
      req.params?.category || req.query?.category || req.body?.category;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Use case-insensitive match
    const products = await Product.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
    });


    return res.status(200).json({
      success: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getProductDetails = async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID is required" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchProduct = async(req, res) =>{
    try {
        const query = req.query.q;
        console.log(query)
        
        const regex = new RegExp(query, "ig");

        const product = await Product.find({
            "$or":[
              {
                productName : regex
              },
              {
                category : regex
              },
            ]
        })

        return res.status(200).json({
           data:product,
           message:"OK",
           success:true,
        })

    }catch(error){
         return res.status(500).json({
             message:"Internal Server Error",
             error:error.message,
             success:false,
         })
    }
}

const filterProduct  = async(req, res)=>{
    try{
        const {categoryList} = req.body;

        const product = await Product.find({
          category:{
            "$in":categoryList
          }
        })

        return res.status(200).json({
            success:true,
            message:"Product",
            data:product,
        })

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    }
}


module.exports = {
  uploadProduct, 
  getProducts, 
  updateProduct, 
  getCategoryProduct, 
  getSingleCategoryProduct, 
  getProductDetails, 
  searchProduct, 
  filterProduct
};