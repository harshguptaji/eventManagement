import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Tag from "../models/tagModel.js";

// functionality for regsitring admin  -- Only by admin
export const registerAdmin = async (req,res) => {
    try {
        const {name,number,password,role} = req.body;
        
        if(!name || !number || !password || !role){
            return res.status(400).json({
                message: "Please fill all the required fields",
                success: false
            });
        }

        const checkNumber = await Admin.findOne({number});
        if(checkNumber){
            return res.status(400).json({
                message: "Please try from different number , this number is already register",
                success: false
            });
        }

        const checkName = await Admin.findOne({name});
        if(checkName){
            return res.status(400).json({
                message: "Please use different Name , this name is already register",
                success: false
            })
        }

        const hasehedPassword = await bcrypt.hash(password,10);
        await Admin.create({
            name,
            number,
            password: hasehedPassword,
            role
        });

        return res.status(200).json({
            message: `New ${role}, is register successfully`,
            success: true
        });

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
    }
};

// functionality for Admin login -- Both roles admin & sub-admin
export const adminLogin = async (req,res) => {
    try {
        const {number,password} = req.body;
        if(!number || !password) {
            return res.status(400).json({
                message: "Please enteres all required fields",
                success: true
            });
        }

        const checkNumber = await Admin.findOne({number});
        if(!checkNumber) {
            return res.status(400).json({
                message: "This number is not register with us, please use different number for ,login",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password,checkNumber.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Your entered Password is incorrect",
                success: false
            })
        }

        //Generate JWT Token
        const token = jwt.sign({ id: checkNumber._id, role: checkNumber.role }, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Send response with admin details (without token)
        res.json({
            token,
            admin: {
                id: checkNumber._id,
                name: checkNumber.name,
                number: checkNumber.number,
                role: checkNumber.role,
                tags: checkNumber.tags,
                createdAt: checkNumber.createdAt,
                updatedAt: checkNumber.updatedAt
            },
        });

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Functionality for admin logout
export const adminLogout = async(req,res) => {
    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
        });

        // Send success response
        return res.status(200).json({
            message: "Logout successful",
            success: true
        });
        
    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
}

// Functionality for shows all admins
export const allAdmin = async(_,res) => {
    try {
        const admins = await Admin.find();
        // const Id = req.admin.id;
        // const adminInfo = await Admin.findById(Id);
        // if(!adminInfo){
        //     return res.status(400).json({
        //         message: "You are not authorized to access this api",
        //         success: false
        //     })
        // }
        return res.status(200).json({
            message: "All Admins",
            admins,
            success: true
        })
    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Functionality to show details of particular admin - By Id
export const adminInfoById = async(req,res) => {
    try {
        const adminId = req.params.id;
        const checkId = await Admin.findById(adminId);

        if(!checkId){
            return res.status(400).json({
                message: "This Admin is not exist any more",
                success: false
            });
        }
        return res.status(200).json({
            message: "Found Successfully",
            admin: checkId,
            success: true
        });

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Functionality to update Admin Info By Admin
export const updateInfoById = async(req,res) => {
    try {
        const adminId = req.params.id;
        const {name, number, password, role} = req.body;
        const checkId = await Admin.findById(adminId);
        if(!checkId){
            return res.status(400).json({
                message: "This Admin is not exist any more",
                success: false
            });
        }

        if(name){
            const checkName = await Admin.findOne({name});
            if(checkName){
                return res.status(400).json({
                    message: "Please use different name, this name is already register",
                    success: false
                });
            }
            checkId.name = name;
        }

        if(number){
            const checkNumber = await Admin.findOne({number});
            if(checkNumber){
                return res.status(400).json({
                    message: "Please use different number, this number is already register",
                    success: false
                });
            }
            checkId.number = number;
        }

        if(password){
            const hasehedPassword = await bcrypt.hash(password,10);
            checkId.password = hasehedPassword;
        }

        if(role){
            checkId.role = role;
        }

        await checkId.save();

        return res.status(200).json({
            message: "This Admin is updated successfullly",
            admin: checkId,
            success: true
        })

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Functionality to add tags for particular Admin
export const addNewTagToAdmin = async(req,res) => {
    try {
        const adminId = req.params.id;
        const {tagName} = req.body;
        const checkAdminId = await Admin.findById(adminId);
        if(!checkAdminId){
            return res.status(400).json({
                message: "This Admin is not exist any more",
                success: false
            });
        }

        if(!tagName){
            return res.status(400).json({
                message: "please fill tag name",
                success: false
            })
        }

        const tag = await Tag.findOne({name: tagName});
        if (!tag) {
            return res.status(400).json({
                message: `Tag: ${tagName}, not found in Tag model, Please add this tag first`,
                success: false
            });
        }

        if (!checkAdminId.tags.includes(tagName)) {
            checkAdminId.tags.push(tagName); // Add tag to array
            await checkAdminId.save(); 
        } else {
            return res.status(400).json({
                message: `Tag: ${tagName}, already exists in admin's tags.`,
                success: false
            })
        }

        return res.status(200).json({
            message: `Tag: ${tagName}, added to admin's tags.`,
            success: true
        })
        
    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Functionality to remove tags from particular admiin
export const removeTagFromAdmin = async(req,res) => {
    try {
        const adminId = req.params.id;
        const {tagName} = req.body;
        const checkAdminId = await Admin.findById(adminId);
        if(!checkAdminId){
            return res.status(400).json({
                message: "This Admin is not exist any more",
                success: false
            });
        }

        if(!tagName){
            return res.status(400).json({
                message: "please fill tag name",
                success: false
            })
        }

        // const tag = await Tag.findOne({name: tagName});
        // if (!tag) {
        //     return res.status(400).json({
        //         message: `Tag: ${tagName}, not found in Tag model, Please add this tag first`,
        //         success: false
        //     });
        // }

        if (checkAdminId.tags.includes(tagName)) {
            checkAdminId.tags.pull(tagName); // remove tag from array
            await checkAdminId.save(); 
        } else {
            return res.status(400).json({
                message: `Tag: ${tagName}, is not exists in admin's tags.`,
                success: false
            })
        }

        return res.status(200).json({
            message: `Tag: ${tagName}, remove from admin's tags.`,
            success: true,
            adminDetail: checkAdminId
        });
        
    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Delete Admin 
export const deleteAdmin = async(req,res) => {
    try {
        const adminId = req.params.id;
        const checkAdminId = await Admin.findByIdAndDelete(adminId);
        if(!checkAdminId){
            return res.status(400).json({
                message: "This admin is not exist any more",
                success: false
            });
        }

        return res.status(200).json({
            message: "Admin is deleted successfully",
            success: true
        });

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// searching of admin on the basis of number - exact searching
export const searchAdminByNumber = async(req,res) => {
    try {
        const {number} = req.body;
        if (!number) {
            return res.status(400).json({
                message: "Please provide a number to search.",
                success: false
            });
        }

        // Find admin by number
        const admin = await Admin.findOne({ number });

        if (!admin) {
            return res.status(404).json({
                message: "Admin with this number not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Admin found successfully.",
            admin: {
                id: admin._id,
                name: admin.name,
                number: admin.number,
                role: admin.role,
                tags: admin.tags,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt
            },
            success: true
        });
        
    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};