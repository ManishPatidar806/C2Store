import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          folder: "c2store",
          resource_type: "image",
        });
        console.log('Cloudinary upload result:', {
          public_id: result.public_id,
          secure_url: result.secure_url
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log('Creating product with data:', productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

function getPublicIdFromUrl(url) {
  try {
    // Extract the public_id from Cloudinary URL
    // Common Cloudinary URL formats:
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{filename}.{ext}
    // https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{filename}.{ext}
    
    console.log('Extracting public_id from URL:', url);
    
    if (!url || !url.includes('cloudinary.com')) {
      console.log('Invalid Cloudinary URL');
      return null;
    }
    
    // Split by /upload/ to get the part after it
    const parts = url.split('/upload/');
    if (parts.length < 2) {
      console.log('Could not find /upload/ in URL');
      return null;
    }
    
    let pathAfterUpload = parts[1];
    
    // Remove version number if present (v1234567890/)
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
    
    // Remove file extension and any transformation parameters
    pathAfterUpload = pathAfterUpload.split('?')[0]; // Remove query parameters
    pathAfterUpload = pathAfterUpload.replace(/\.[^.\/]+$/, ''); // Remove extension
    
    console.log('Extracted public_id:', pathAfterUpload);
    return pathAfterUpload;
    
  } catch (error) {
    console.log('Error extracting public_id from URL:', error);
    return null;
  }
}

// Alternative function to extract public_id using regex
function getPublicIdFromUrlRegex(url) {
  try {
    // Regex to match Cloudinary URL and extract public_id
    // Matches: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{file}.{ext}
    // Captures: {folder}/{file}
    const regex = /cloudinary\.com\/[^\/]+\/image\/upload\/(?:v\d+\/)?([^?]+?)(?:\.[^.\/]+)?(?:\?.*)?$/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      console.log('Extracted public_id via regex:', match[1]);
      return match[1];
    }
    
    console.log('No match found with regex');
    return null;
    
  } catch (error) {
    console.log('Error extracting public_id via regex:', error);
    return null;
  }
}

// function for removing product
const removeProduct = async (req, res) => {
  try {
    console.log('Attempting to remove product with ID:', req.body.id);
    
    const product = await productModel.findById(req.body.id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    console.log('Product found, attempting to delete images from Cloudinary...');
    console.log('Product images:', product.image);

    // Delete images from Cloudinary with proper error handling
    const imageDeletePromises = product.image.map(async (img) => {
      try {
        // Try primary method first
        let public_id = getPublicIdFromUrl(img);
        
        // If primary method fails, try regex method
        if (!public_id) {
          console.log('Primary method failed, trying regex method...');
          public_id = getPublicIdFromUrlRegex(img);
        }
        
        if (!public_id) {
          console.log('Both methods failed - could not extract public_id from:', img);
          return { success: false, error: 'Invalid public_id', url: img };
        }

        console.log('Deleting image with public_id:', public_id);
        
        // Set timeout for Cloudinary request with multiple attempts
        let deleteResult;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          try {
            attempts++;
            console.log(`Attempt ${attempts} to delete ${public_id}`);
            
            deleteResult = await Promise.race([
              cloudinary.uploader.destroy(public_id),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Cloudinary request timeout')), 15000)
              )
            ]);
            
            console.log('Cloudinary delete result:', deleteResult);
            
            // If result indicates success or "not found" (which is OK), break
            if (deleteResult.result === 'ok' || deleteResult.result === 'not found') {
              break;
            }
            
          } catch (attemptError) {
            console.log(`Attempt ${attempts} failed:`, attemptError.message);
            if (attempts === maxAttempts) {
              throw attemptError;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        return { success: true, result: deleteResult, public_id };
        
      } catch (error) {
        console.log('Error deleting image:', error.message);
        // Don't fail the entire operation if image deletion fails
        return { success: false, error: error.message, url: img };
      }
    });

    // Wait for all image deletions to complete (or timeout)
    const deleteResults = await Promise.allSettled(imageDeletePromises);
    console.log('Image deletion results:', deleteResults);

    // Delete the product from database regardless of image deletion results
    await productModel.findByIdAndDelete(req.body.id);
    console.log('Product removed from database');

    // Count successful image deletions
    const successfulDeletions = deleteResults.filter(
      result => result.status === 'fulfilled' && result.value.success
    ).length;

    res.json({ 
      success: true, 
      message: `Product removed successfully. ${successfulDeletions}/${product.image.length} images deleted from Cloudinary.`
    });

  } catch (error) {
    console.log('Error in removeProduct:', error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export { listProducts, addProduct, removeProduct, singleProduct };
