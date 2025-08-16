const AddToCart = require('../models/cartProduct');


const addToCartProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req?.user || req.user?._id; // Assuming auth middleware sets this


    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const isProductAvailable = await AddToCart.findOne({ productId, userId });

    if (isProductAvailable) {
      return res.status(409).json({
        success: false,
        message: "Already exists in Add to Cart",
      });
    }

    const payload = {
      productId,
      quantity: 1,
      userId,
    };

    const newAddToCart = new AddToCart(payload);
    const saveProduct = await newAddToCart.save();

    return res.status(200).json({
      success: true,
      message: "Product Added in Cart",
      data: saveProduct,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const countAddedProductinCart = async (req, res) => {
  try {
    // const { productId } = req.body;
    const userId = req?.user || req.user?._id; // Assuming auth middleware sets this

    const count = await AddToCart.countDocuments({
       userId:userId,
    })
    console.log("count",count);

    return res.status(200).json({
       message:'ok',
       data:count,
       success:true,
    })
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const cartProductView = async (req, res) => {
  try {
    // const { productId } = req.body;
    const userId = req?.user || req.user?._id; // Assuming auth middleware sets this

    const allProduct = await AddToCart.find({
       userId:userId,
    }).populate('productId');
  


    return res.status(200).json({
       message:'ok',
       data:allProduct,
       success:true,
    })
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const upadateCart = async(req, res)=>{
   try{

       const userId = req?.user || req.user?._id;
        
       const {productId,quantity} = req.body;
       console.log(productId,quantity)

       const payload = {
            ...(quantity && {quantity : quantity})
          }

       const updatedCart = await AddToCart.findByIdAndUpdate(productId,
         { $set: payload },
          { new: true }
       );


       return res.status(200).json({
         success:true,
         message:"Cart Update Successfully",
         data:updatedCart,
       })

   } catch(error){
       return res.status(500).json({
        success:false,
        message:"Internal Server Error",
        error:error.message,
       })
   }
}


const removetCartProduct = async(req, res)=>{
    try{

        //  const userId = req.user || req.user._id;
         const {productId} = req.body;
         console.log(productId)

         const deleteProduct = await AddToCart.deleteOne({_id:productId});

         return res.status(200).json({
            success:true,
            message:"Successfully Remove Item from cart",
            data:deleteProduct,
         })

    }catch(error){
       return res.status(500).json({
           success:false,
           message:"Internal Server Error",
           error:error.message,
       })
    }
}
module.exports = {addToCartProduct, countAddedProductinCart, cartProductView, upadateCart,removetCartProduct};