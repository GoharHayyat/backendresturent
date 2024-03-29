const express = require("express");
const authController = require("../controllers/authController.js")
const router = express.Router();
const User = require("../db/user.js");



router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/forgotpassword", authController.forgotPassword);
router.put("/resetpassword/:resetToken", authController.resetPassword);

router.post('/manageFavorite', async(req, res) => {
    const { userId, favorites } = req.body;
    // console.log(req.body);

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If favorites is null, set the favorites field in the database to null
        if (favorites === null) {
            user.favorites = null;
        } else {
            // Merge the new favorites with the existing favorites, avoiding duplicates
            user.favorites = favorites;
        }

        await user.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/checkisliked/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;

    // console.log("fav user",userId)
    // console.log("fav pro",productId)
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the product ID is in the user's favorites
        const isProductAvailable = user.favorites && user.favorites.includes(productId);

        res.json({ available: isProductAvailable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/userfavorites/:userId', async (req, res) => {
    const { userId } = req.params;
    // console.log("User ID:", userId);
  
    try {
      // Find the user by ID and return their favorites
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
    //   console.log("User Favorites:", user.favorites);
  
      res.json({ favorites: user.favorites });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// router.post('/manageFavoriteDEL', async(req, res) => {
//     const { userId, favorites } = req.body;
//     // console.log(req.body)

//     try {
//         // Find the user by ID
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         //For deletion favouite
//         favorites.forEach((fav) => {
//             console.log("Del", req.body)
//             const index = user.favorites.indexOf(fav);
//             if (index !== -1) {
//                 user.favorites.splice(index, 1);
//             }
//         });


//         res.json({ success: true });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

module.exports = router;