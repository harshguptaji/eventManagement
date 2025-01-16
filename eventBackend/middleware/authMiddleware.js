import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

const authMiddleware = (requiredTag = null) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token;

            // Check if token exists
            if (!token) {
                
                return res.status(401).json({
                    message: "Access denied. No token provided., Login first",
                    success: false
                });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = decoded; // Attach admin details to request

            // console.log(`Verified Token: ${token}`); working fine in backend check for frontend only

            // Check the admin's role
            const admin = await Admin.findById(req.admin.id);
            if (!admin) {
                return res.status(401).json({
                    message: "Admin not found.",
                    success: false
                });
            }

            // Role-specific checks
            
                if (admin.role === 'admin') {
                    return next();
                }
                if(requiredTag){
                     // Additional check for subadmin tags
                    if (admin.role === 'subAdmin') {
                        if (admin.tags.includes(requiredTag)) {
                            return next();
                        }
                    }
                } else {
                    return res.status(403).json({
                        message: "You are not good fit to access this work",
                        success: false
                    });
                }
                
                return res.status(403).json({
                    message: "You are not good fit to access this work",
                    success: false
                });

        } catch (error) {
            console.error(`Authentication error: ${error.message}`);
            res.status(400).json({
                message: "Invalid token.",
                success: false
            });
        }
    };
};

export default authMiddleware;
