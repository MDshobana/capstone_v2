import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();
import jwt from 'jsonwebtoken';
import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enroll.js';
import Submission from '../models/Submission.js';
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import googleAuth from 'google-auth-library';
import cookies from 'cookie-parser';
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import PDFDocument from "pdfkit";
import mongoose from 'mongoose';

import authMiddleware from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';


const router = express.Router();



const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        if (file.fieldname === "thumbnail") {
            return {
                folder: "course_thumbnails",
                resource_type: "image"
            };
        }

        if (file.fieldname === "video") {
            return {
                folder: "course_videos",
                resource_type: "video"
            };
        }
        if (file.fieldname === "resume") {
            return {
                folder: "resumes",
                resource_type: "raw"
            }
        }
    }
});


const upload = multer({ storage });

const uploadResume = multer({ storage });

router.get('/student', authMiddleware, authorize('admin', 'student'), (req, res) => {
    res.json({ message: `Welcome to the student dashboard, ${req.user.email}!` });
});

router.get('/trainer', authMiddleware, authorize('admin', 'trainer'), (req, res) => {
    res.json({ message: `Welcome to the trainer dashboard, ${req.user.email}!` });
});
router.get('/company', authMiddleware, authorize('admin', 'company'), (req, res) => {
    res.json({ message: `Welcome to the company dashboard, ${req.user.email}!` });
});
router.get('/admin', authMiddleware, authorize('admin'), (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.user.email}!` });
});

router.get('/dashboard', authMiddleware, authorize('admin', 'student', 'trainer', 'company'), (req, res) => {
    res.json({ message: `Welcome to the dashboard, ${req.user.email}!` });
});


router.get('/admin/manage-users', authMiddleware, authorize('admin'), async (req, res) => {
    try {
        let users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'An error occurred while fetching users.' });
    }
});


router.post('/courses/upload', authMiddleware, authorize('admin', 'trainer'), upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }]),


    async (req, res) => {
        try {
            const { title, description, category, level } = req.body;

            const thumbnail = req.files['thumbnail'][0];

            const croppedThumbnail = cloudinary.url(thumbnail.filename, {
                width: 400,
                height: 250,
                crop: "fill",
                gravity: "auto"
            });

            const thumbnailUrl = req.files['thumbnail'][0].path;
            const videoUrl = req.files['video'][0].path;
            const course = new Course({
                title,
                description,
                category,
                level,
                thumbnail: croppedThumbnail,
                video: videoUrl
            });
            await course.save();
            res.json({
                message: 'Course uploaded successfully',
                course
            });
        }

        catch (err) {
            console.error('Error uploading course:', err);
            res.status(500).json({ message: 'An error occurred while uploading the course.' });
        }
    }
);

router.get("/courses", async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

router.put("/courses/:id", authMiddleware, authorize('admin', 'trainer'), async (req, res) => {
    const courseID = req.params.id;
    const { title, description, category, level } = req.body;
    try {
        const updatedCourse = await Course.findByIdAndUpdate(courseID, { title, description, category, level }, { new: true });

        res.json({ updatedCourse });
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ message: 'An error occurred while updating the course.' });

    }
});
router.delete("/courses/:id", authMiddleware, authorize('admin', 'trainer'), async (req, res) => {
    const courseID = req.params.id;
    try {
        await Course.findByIdAndDelete(courseID);
        res.json({ message: "Course removed successfully" });
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ message: 'An error occurred while deleting the course.' });
    }
});

router.post("/enroll", authMiddleware, authorize("student"), async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;


        const existing = await Enrollment.findOne({
            userId: req.user.id,
            courseId
        });

        if (existing) {
            return res.status(400).json({ message: "Already enrolled" });

        }

        const enrollment = new Enrollment({
            userId,
            courseId,
            isEnrolled: true,

        });
        await enrollment.save();
        res.json({ message: "Enrolled successfully", isEnrolled: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Enrollment failed" });
    }
});


router.post(
    "/submit-assignment",
    authMiddleware,
    authorize("student"),
    upload.single("file"),
    async (req, res) => {
        try {
            const { courseId, assignmentName } = req.body;

            if (!courseId || courseId === "undefined") {
                return res.status(400).json({ message: "Invalid courseId" });
            }

            if (!assignmentName) {
                return res.status(400).json({ message: "assignmentName missing" });
            }

            if (!req.file) {
                return res.status(400).json({ message: "file missing" });
            }

            const submission = new Submission({
                userId: req.user.id,
                courseId,
                assignmentName,
                fileUrl: req.file.path

            });

            await submission.save();

            res.json({ message: "Assignment submitted ✅" });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Submission failed"
            });
        }
    }
);

router.get(
    "/submissions/:courseId",
    authMiddleware,
    authorize("trainer"),
    async (req, res) => {
        try {
            const submissions = await Submission.find({
                courseId: req.params.courseId
            }).populate("userId", "email");

            res.json(submissions);

        } catch (err) {
            res.status(500).json({
                message: "Error fetching submissions"
            });
        }
    }
);

router.put(
    "/evaluate/:submissionId",
    authMiddleware,
    authorize("trainer"),
    async (req, res) => {
        try {
            const { marks, feedback } = req.body;

            const updated = await Submission.findByIdAndUpdate(
                req.params.submissionId,
                {
                    marks,
                    feedback,
                    status: "evaluated"
                },
                { new: true }
            );

            res.json({
                message: "Evaluation saved ✅",
                updated
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Evaluation failed"
            });
        }
    }
);

router.get(
    "/my-submissions",
    authMiddleware,
    authorize("student"),
    async (req, res) => {
        const submissions = await Submission.find({
            userId: req.user.id
        });

        res.json(submissions);
    }
);


router.post("/quiz", authMiddleware, authorize("trainer"), async (req, res) => {
    try {
        const { courseId, questions } = req.body;

        if (!courseId || !questions || questions.length === 0) {
            return res.status(400).json({
                message: "courseId or questions missing"
            });
        }

        const updatedQuiz = await Quiz.findOneAndUpdate(
            { courseId: new mongoose.Types.ObjectId(courseId) },
            { questions },
            { upsert: true, new: true }
        );

        console.log("UPDATED QUIZ:", updatedQuiz);

        res.json({ message: "Quiz saved ✅" });

    } catch (error) {
        console.error("Quiz upload error:", error.message);
        res.status(500).json({ message: error.message });
    }
});


router.get("/quiz/:courseId", async (req, res) => {

    const quiz = await Quiz.findOne({
        courseId: new mongoose.Types.ObjectId(req.params.courseId)
    });

    if (!quiz) {
        return res.status(404).json({ message: "No quiz found" });
    }

    res.json(quiz);
});


router.post("/submit-quiz", authMiddleware, authorize("student"), async (req, res) => {
    const { courseId, answers } = req.body;

    const quiz = await Quiz.findOne({ courseId });

    if (!quiz) {
        return res.status(404).json({
            message: "Quiz not found for this course"
        });
    }


    let score = 0;

    quiz.questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
            score++;
        }
    });

    const passed = score >= quiz.questions.length * 0.6;

    await Result.create({
        userId: req.user.id,
        courseId,
        score,
        passed
    });

    res.json({ score, passed });
});

router.get("/certificate/:courseId", authMiddleware, authorize("student"), async (req, res) => {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(25).text("Certificate of Completion", {
        align: "center"
    });

    doc.moveDown();

    doc.fontSize(18).text(
        `This certifies that ${req.user.email} has completed the course`,
        { align: "center" }
    );

    doc.end();
});


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post("/chat", authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert AI tutor helping students with coding, career, and interview preparation."
                },
                {
                    role: "student",
                    content: message
                }
            ]
        });

        const reply = response.choices[0].message.content;

        res.json({ reply });

    } catch (error) {
        console.error("AI ERROR:", error.message);
        res.status(500).json({ message: "Free Quota is over." });
    }
});


router.post("/company/register", authMiddleware, authorize("company"), async (req, res) => {
    const company = new Company(req.body);
    await company.save();
    res.json({ message: "Company registered ✅" });
});


router.get("/company/jobs", authMiddleware, authorize("company"), async (req, res) => {

    const jobs = await Job.find({
        companyId: req.user.id
    });

    res.json(jobs);
});

router.get("/jobs", authMiddleware, authorize("student"), async (req,res) => {
    
    try{
        const jobs = await Job.find({status:"available"});
        res.json(jobs);
    }catch(error){
        res.json("error fecthing jobs", error)
    }
});
router.post("/jobs", authMiddleware, authorize("company"), async (req, res) => {
    try {
        const { title, description } = req.body;

        const job = new Job({
            title,
            description,
            companyId: req.user.id
        });

        await job.save();

        console.log("SAVED JOB:", job);

        res.json({ message: "Job posted ✅" });

    } catch (err) {
        console.error(err);
    }
});


router.post("/apply", authMiddleware, authorize("student"), uploadResume.single("resume"), async (req, res) => {
    const { jobId } = req.body;
    const resumeUrl =req.file.path;
    const email = req.user.email;
    console.log(email);
    await Application.create({
        jobId,
        studentId: req.user.id,
        resumeUrl,
        email
    });
    

    res.json({ email, message: "Application submitted ✅"});
});


router.get("/applications/:jobId", authMiddleware, async (req, res) => {
    const jobId = req.params.jobId;
    const apps = await Application.find({ jobId })
        .populate("studentId", "email");
    
    res.json(apps);
});


router.put("/shortlist/:id", async (req, res) => {
    const id = req.params.id
    await Application.findByIdAndUpdate(id, {
        status: "shortlisted"
    });

    res.json({ message: "Shortlisted ✅" });
});

export default router;