import {Application} from "../models/application.model.js"
import { Job } from "../models/job.model.js";
export const applyJob=async (req,res)=>{
    try {
        const userId=req.id;
        const jobId=req.params.id;
        if(!jobId){
            return res.status(404).json({
            message:"Job not found",
            success:false
        });
        }
        const existingApplication=await Application.findOne({job:jobId,applicant:userId});
        if(existingApplication){
            return res.status(400).json({
            message:"Already applied for this job",
            success:false
        })
        }
        const job=await Job.findById(jobId)
        if(!job){
            return res.status(404).json({
            message:"Job not found by id",
            success:false
        })
        }

        const newApplication=await Application.create({
            job:jobId,
            applicant:userId
        });
        job.applications.push(
            newApplication._id
        )
        await job.save();
        return res.status(201).json({
            message:"job applied successfully",
            success:true
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message:"Cannot apply job",
            success:false
        })
    }
}

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "companyId" // ✅ FIXED
        }
      });

    if (applications.length === 0) {
      return res.status(404).json({
        message: "No applied jobs found",
        success: false
      });
    }

    return res.status(200).json({
      applications,
      success: true
    });

  } catch (error) {
    console.error("getAppliedJobs error:", error);
    return res.status(500).json({
      message: "Cannot get applied job",
      success: false
    });
  }
};



export const getApplicants=async (req,res)=>{
    try {
        const jobId=req.params.id;
        const job=await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant"
            }
        });
        if(!job){
           return res.status(404).json({
            message:"Job not found",
            success:false
        }) 
        }
        return res.status(200).json({
            job,success:true
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message:"Cannot get applicants",
            success:false
        })
    }
}


export const updateStatus=async (req,res)=>{
    try {
        const {status}=req.body;
        const applicationid=req.params.id;
        if(!status){
            return res.status(404).json({
            message:"Cannot find status",
            success:false
        })
        }
        const application=await Application.findOne({_id:applicationid})
        if(!application){
                    return res.status(404).json({
            message:"Application not found.",
            success:false
        })
        }
        application.status=status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message:"Application Status Updated Successfully...",
            success:true
        })
    } catch (error) {
         console.log(error);
        return res.status(400).json({
            message:"Cannot update status",
            success:false
        })
    }
}